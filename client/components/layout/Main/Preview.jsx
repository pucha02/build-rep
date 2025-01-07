import Image from "next/image";
import deli from "../../../assets/image/Photo-plate.png";
import rucola from "../../../assets/image/rucola-png.png";
import arrow from "../../../assets/image/arrow.svg";
const Preview = ({ navigate }) => {
  return (
    <div className="preview">
      <div className="preview__content">
        <div className="preview__content__function">
          <h1>Your Food court at home</h1>
          <div className="preview__content__function__btn-list">
            <button className="preview__button">Delivery </button>
            <button className="preview__button">Takeout</button>
          </div>
        </div>
        <div
          className="animation__content"
          onClick={() => {
            navigate({ link: "dishes" });
          }}
        >
          <div className="animation__content__image">
            <Image src={deli} alt="" />
          </div>
          <div className="animation__content__image-animation">
            <Image src={rucola} alt="" />
          </div>
          <div className="animation__content__arrow">
            <Image src={arrow} alt="" />
            <span>Click for more</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preview;
