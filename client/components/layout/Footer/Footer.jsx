import Image from "next/image";
import logo from "../../../assets/image/logo-white.png";

const Footer = ({ style }) => {
  return (
    <footer className="footer" style={style}>
      <div className="footer__container">
        <div className="footer__preview">
          <Image src={logo} alt="404" />
        </div>
        <div className="footer__content">
          <div className="footer__content__about">
            <p>About Us</p>
            <ul>
              <li>
                <span>concept</span>
              </li>
              <li>
                <span>franchis</span>
              </li>
              <li>
                <span>Businnes</span>
              </li>
              <li>
                <span>Sing Up rest</span>
              </li>
              <li>
                <span>For investors</span>
              </li>
            </ul>
          </div>
          <div className="footer__content__help">
            <p>Get Help</p>
            <ul>
              <li>
                <span>Read FAQs</span>
              </li>

              <li>
                <span>Rests</span>
              </li>

              <li>
                <span>Specialities</span>
              </li>

              <li>
                <span>Sign up to deliver</span>
              </li>
            </ul>
          </div>
          <div className="footer__content__contact">
            <p>Contact Us</p>
            <ul>
              <li>
                <span>Yellow kitchen Paris 11</span>
              </li>
              <li>
                <span>69 avenue de la Republique 75011 Paris</span>
              </li>
              <li>
                <span>0800 111 126</span>
              </li>
              <li>
                <span>contact@yellowkitchens.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
