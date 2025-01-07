import { useEffect } from "react";

const Burger = ({ isBurgerOpen, setIsBurgerOpen }) => {
  useEffect(() => {
    // Отключаем скролл при открытии меню
    if (isBurgerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // Убираем стиль при размонтировании компонента
    return () => {
      document.body.style.overflow = "";
    };
  }, [isBurgerOpen]);
  return (
    <>
      <div
        className={
          isBurgerOpen ? "modal-overlay-burger" : "modal-overlay-burger close"
        }
        onClick={() => {
          setIsBurgerOpen(false);
        }}
      >
        {" "}
      </div>
      <div className={isBurgerOpen ? "burger__menu open" : "burger__menu"}>
        <div className="burger__menu__info">
          <p className="burger__menu__title">0800 111 126</p>
          <p>8:00 - 22:00</p>
        </div>
        <ul className="burger__menu__list">
          <li className="burger__menu__list__item">
            <span>Delivery info</span>
          </li>
          <li className="burger__menu__list__item">
            <span>About us</span>
          </li>
          <li className="burger__menu__list__item">
            <span>Restaurants</span>
          </li>
          <li className="burger__menu__list__item">
            <span>Specialities</span>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Burger;
