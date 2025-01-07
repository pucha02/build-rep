import React, { useEffect, useState } from "react";

const Auth = ({ isOpen, onClose }) => {
  useEffect(() => {
    // Отключаем скролл при открытии меню
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // Убираем стиль при размонтировании компонента
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);
  const [isLogin, setIsLogin] = useState(false);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // Остановить всплытие, чтобы не закрывалась модалка
      >
        <div className="switch__modal-form">
          <div className="modal-form">
            <h2>Вход</h2>
            <form>
              <input type="email" placeholder="Введите Email" />
              <input type="password" placeholder="Введите пароль" />{" "}
              <div className="button_l">
                <div className="button" onClick={() => setIsLogin(true)}>
                  Зарегистрироваться
                </div>
                <button type="submit">Войти</button>
              </div>
            </form>
          </div>
          <div className="modal-form">
            <h2>Регистрация</h2>
            <form>
              <input type="text" placeholder="Введите имя" />
              <input type="email" placeholder="Введите Email" />
              <input type="password" placeholder="Введите пароль" />
              <div className="button_l">
                <button type="submit">Зарегистрироваться</button>
                <div className="button" onClick={() => setIsLogin(false)}>
                  Войти
                </div>
              </div>
            </form>
          </div>
          <div
            className={isLogin ? "switch-block login " : "switch-block reg"}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
