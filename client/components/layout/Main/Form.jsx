import Image from "next/image";
import map from "../../../assets/image/map.png";
const Form = () => {
  return (
    <div className="inquiry">
      <div className="inquiry__container">
        <div className="inquiry__content">
          <div className="inquiry__content__txt">
            <h3>Your nearest restaurants</h3>
            <span>
              Each kitchen works with its own delivery area to deliver food to
              you as soon as possible
            </span>
          </div>
          <div className="inquiry__content__form">
            <div className="inquiry__content__form__input">
              <input type="text" placeholder="Enter delivery address" />
              <Image src={map} alt="404" width={24} height={24} />
            </div>
            <button>send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form;
