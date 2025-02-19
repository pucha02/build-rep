import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { headers } from '../headers.js';

const JWT_SECRET = 'your_jwt_secret_key';
export const registerUser = async (req, res) => {
    const { number_phone, firstname, password, companyname, city, addresses } = req.body;
    console.log(addresses)
    console.log("Получен запрос на регистрацию пользователя:", req.body);

    // Проверяем обязательные поля
    if (!number_phone || !firstname || !password) {
        console.error("Не заполнены обязательные поля:", { number_phone, firstname, password });
        return res.status(400).json({ message: "Заповніть всі обов'язкові поля" });
    }

    try {
        // Проверяем, существует ли пользователь с таким номером телефона
        console.log("Проверка существующего пользователя с номером телефона:", number_phone);
        const existingUser = await User.findOne({ number_phone });
        if (existingUser) {
            console.error("Пользователь с таким номером телефона уже существует:", number_phone);
            return res.status(400).json({ message: 'Користувач з таким номером телефону вже існує' });
        }

        // Хэшируем пароль
        console.log("Хэширование пароля для пользователя:", firstname);
        const hashedPassword = await bcrypt.hash(password, 10);

        // Создаём нового пользователя
        console.log("Создание нового пользователя в базе данных...");
        const newUser = new User({
            number_phone, firstname, companyname, password: hashedPassword, city, addresses: []
        });
        console.log("Пользователь успешно создан:", newUser);

        // Создание контрагента через GraphQL API
        console.log("Начало создания контрагента через GraphQL API...");
        const upsertContragentQuery = {
            query: `
                mutation MyMutation($formalName: String!) {
                    upsertContragent(input: { formalName: $formalName }) {
                        id
                        formalName
                    }
                }
            `,
            variables: {
                formalName: companyname || firstname,
            },
        };

        const contragentResponse = await fetch("https://api.keruj.com/api/graphql", {
            method: "POST",
            headers: headers,
            body: JSON.stringify(upsertContragentQuery),
        });

        const contragentData = await contragentResponse.json();
        console.log("Ответ от GraphQL API (создание контрагента):", contragentData);

        const contragentId = contragentData?.data?.upsertContragent?.id;

        if (!contragentId) {
            console.error("Не удалось создать контрагента. Ответ от API:", contragentData);
            throw new Error("Не вдалося створити контрагента");
        }

        console.log("Контрагент успешно создан с ID:", contragentId);

        // Создание контакта
        console.log("Начало создания контакта...");
        const createContactQuery = {
            query: `
                mutation MyMutation($ownerId: UUID!, $ownerSchema: OwnerSchema!, $firstName: String!, $phone: String!, $type: ContactType!) {
                    createContact(input: { ownerId: $ownerId, ownerSchema: $ownerSchema, firstName: $firstName, phone: $phone, type: $type }) {
                        ownerId
                    }
                }
            `,
            variables: {
                ownerId: contragentId,
                ownerSchema: "CONTRAGENTS",
                firstName: firstname,
                phone: number_phone,
                type: "PERSON",
            },
        };

        const contactResponse = await fetch("https://api.keruj.com/api/graphql", {
            method: "POST",
            headers: headers,
            body: JSON.stringify(createContactQuery),
        });

        const contactData = await contactResponse.json();
        console.log("Ответ от GraphQL API (создание контакта):", contactData);

        if (!contactData?.data?.createContact) {
            console.error("Не удалось создать контакт. Ответ от API:", contactData);
            throw new Error("Не вдалося створити контакт");
        }

        console.log("Контакт успешно создан:", contactData.data.createContact);

        // Создание нескольких адресов
        console.log("Начало создания адресов...");
        const addressResponses = [];
        const mongoAddresses = [];

        for (const address of addresses) {
            const createAddressQuery = {
                query: `
                    mutation MyMutation($contragentId: String!, $city: String!, $streetLine1: String!) {
                        createAddress(input: { contragentId: $contragentId, city: $city, streetLine1: $streetLine1 }) {
                            id
                            city
                            streetLine1
                        }
                    }
                `,
                variables: {
                    contragentId: contragentData?.data?.upsertContragent?.id,
                    city: city, // Город из тела запроса
                    streetLine1: address, // Вся строка адреса как streetLine1
                },
            };

            const addressResponse = await fetch("https://api.keruj.com/api/graphql", {
                method: "POST",
                headers: headers,
                body: JSON.stringify(createAddressQuery),
            });

            const addressData = await addressResponse.json();

            if (!addressData?.data?.createAddress) {
                console.error(
                    "Не удалось создать адрес. Ответ от API:",
                    addressData
                );
                throw new Error("Не вдалося створити адресу");
            }

            console.log("Адреса створена:", addressData.data.createAddress);

            // Добавляем в массив для MongoDB
            mongoAddresses.push({
                
                address: addressData.data.createAddress.streetLine1,
                graphqlId: addressData.data.createAddress.id, // Сохраняем GraphQL ID
            });

            addressResponses.push(addressData.data.createAddress);
        }

        // Сохраняем пользователя с адресами в MongoDB
        newUser.addresses = mongoAddresses;
        await newUser.save();

        res.status(201).json({
            message: 'Користувач успішно зареєстрований',
            contragentId,
            contact: contactData.data.createContact,
            addresses: addressResponses,
        });
    } catch (error) {
        console.error("Ошибка регистрации или создания контрагента/контакта/адресов:", error.message, error.stack);
        res.status(500).json({ message: 'Помилка реєстрації або створення контрагента/контакта/адресів' });
    }
};





export const loginUser = async (req, res) => {
    const { number_phone, password } = req.body;

    try {
        const user = await User.findOne({ number_phone });
        if (!user) return res.status(400).json({ message: 'Користувача з таким номером телефону не знайдено' });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).json({ message: 'Неправильний пароль' });

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, id: user._id });
    } catch (error) {
        res.status(500).json({ message: 'Помилка при вході' });
    }
};
