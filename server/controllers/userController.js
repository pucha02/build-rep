import {User} from "../models/User.js";
import bcrypt from "bcrypt";

// Получить всех пользователей
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Получить пользователя по _id
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Зарегистрировать (создать) нового пользователя
export const createUser = async (req, res) => {
  console.debug("[DEBUG] Получены данные для создания пользователя:", req.body);

  // Извлекаем строковое значение пароля
  const passwordString = req.body.password && req.body.password.name;
  if (!passwordString) {
    console.error("[DEBUG] Пароль отсутствует или имеет неверный формат");
    return res.status(400).json({ message: "Неверный формат пароля" });
  }

  // Формируем объект пользователя с корректным полем password
  const userData = { 
    ...req.body,
    password: passwordString  // используем строку, а не объект
  };

  const user = new User(userData);

  try {
    const newUser = await user.save();
    console.debug("[DEBUG] Пользователь успешно создан:", newUser);
    res.status(201).json(newUser);
  } catch (err) {
    console.error("[DEBUG] Ошибка при создании пользователя:", err);
    res.status(400).json({ message: err.message });
  }
};



// Обновить данные пользователя по _id
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    let updateFields = {};

    // Преобразуем входные данные: если значение является объектом (например, number_phone),
    // то формируем поля вида "number_phone.name", "number_phone.title"
    for (const key in req.body) {
      if (req.body.hasOwnProperty(key)) {
        if (typeof req.body[key] === 'object' && req.body[key] !== null) {
          for (const subKey in req.body[key]) {
            if (req.body[key].hasOwnProperty(subKey)) {
              updateFields[`${key}.${subKey}`] = req.body[key][subKey];
            }
          }
        } else {
          updateFields[key] = req.body[key];
        }
      }
    }

    // Если передан новый пароль, хешируем его вручную
    if (updateFields.password) {
      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(updateFields.password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Удалить пользователя по _id
export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser)
      return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
