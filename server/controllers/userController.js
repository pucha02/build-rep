const ApiError = require("../error/ApiError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, Basket } = require("../models/models");
const generateJwt = (
  id,
  email,
  role,
  name,
  surname,
  phoneNumber,
  patronymic,
  date,
  gender,
  address
) => {
  return jwt.sign(
    {
      id,
      email,
      role,
      name,
      surname,
      phoneNumber,
      patronymic,
      date,
      gender,
      address,
    },
    process.env.SECRET_KEY,
    {
      expiresIn: "24h",
    }
  );
};
class UserController {
  async getAllUsers(req, res, next) {
    try {
      const users = await User.findAll();
      const customers = users.filter((user) => {
        return user.role === "USER";
      });

      return res.json(customers);
    } catch (error) {
      next(error);
    }
  }
  async registration(req, res, next) {
    const {
      email,
      password,
      role,
      name,
      surname,
      phoneNumber,
      patronymic,
      date,
      gender,
      address,
    } = req.body;
    if (!email || !password) {
      return next(ApiError.badRequest("некоректрый email или password"));
    }
    const candidate = await User.findOne({ where: { email } });
    if (candidate) {
      return next(ApiError.badRequest("юзер с таким email уже существует"));
    }
    const hashPassword = await bcrypt.hash(password, 5);
    const user = await User.create({
      email,
      password: hashPassword,
      role,
      name,
      surname,
      phoneNumber,
      patronymic,
      date,
      gender,
      address,
    });
    const basket = await Basket.create({ userId: user.id });
    const token = generateJwt(
      user.id,
      user.email,
      user.role,
      user.name,
      user.surname,
      user.phoneNumber,
      user.patronymic,
      user.date,
      user.gender,
      user.address
    );

    return res.json({ token });
  }

  async login(req, res, next) {
    const {
      email,
      password,
      name,
      surname,
      phoneNumber,
      patronymic,
      date,
      gender,
      address,
    } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return next(ApiError.internal1("пользователь не найден"));
    }
    let comparePassword = bcrypt.compareSync(password, user.password);
    if (!comparePassword) {
      return next(ApiError.internal1("пароль не верный"));
    }

    // Добавляем проверку роли пользователя
    if (user.role !== "USER") {
      return next(ApiError.internal1("Доступ запрещен"));
    }

    const token = generateJwt(
      user.id,
      user.email,
      user.role,
      user.name,
      user.surname,
      user.phoneNumber,
      user.patronymic,
      user.date,
      user.gender,
      user.address
    );
    return res.json({ token });
  }
  async loginAdmin(req, res, next) {
    const {
      email,
      password,
      name,
      surname,
      phoneNumber,
      patronymic,
      date,
      gender,
      address,
    } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return next(ApiError.internal1("пользователь не найден"));
    }
    let comparePassword = bcrypt.compareSync(password, user.password);
    if (!comparePassword) {
      return next(ApiError.internal1("пароль не верный"));
    }

    if (user.role !== "ADMIN") {
      return next(ApiError.internal1("Доступ запрещен"));
    }

    const token = generateJwt(
      user.id,
      user.email,
      user.role,
      user.name,
      user.surname,
      user.phoneNumber,
      user.patronymic,
      user.date,
      user.gender,
      user.address
    );
    return res.json({ token });
  }

  async check(req, res, next) {
    const token = generateJwt(
      req.user.id,
      req.user.email,
      req.user.role,
      req.user.name,
      req.user.surname,
      req.user.phoneNumber,
      req.user.patronymic,
      req.user.date,
      req.user.gender,
      req.user.address
    );
    return res.json({ token });
  }
  async updateUser(req, res, next) {
    try {
      const { id } = req.user;
      const {
        email,
        password,
        name,
        surname,
        phoneNumber,
        patronymic,
        date,
        gender,
        address,
      } = req.body;

      const user = await User.findByPk(id);
      if (!user) {
        return next(ApiError.notFound("Пользователь не найден"));
      }

      if (email) user.email = email;
      if (password) {
        const hashPassword = await bcrypt.hash(password, 5);
        user.password = hashPassword;
      }
      if (name) user.name = name;
      if (surname) user.surname = surname;
      if (phoneNumber) user.phoneNumber = phoneNumber;
      if (patronymic) user.patronymic = patronymic;
      if (date) user.date = date;
      if (gender) user.gender = gender;
      if (address) user.address = address;

      await user.save(); // Сохраняем обновленные данные

      // Генерируем новый токен
      const token = generateJwt(
        user.id,
        user.email,
        user.role,
        user.name,
        user.surname,
        user.phoneNumber,
        user.patronymic,
        user.date,
        user.gender,
        user.address
      );

      return res.json({
        token,
        message: "Данные пользователя успешно обновлены",
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
