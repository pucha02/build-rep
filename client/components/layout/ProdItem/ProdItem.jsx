import Image from "next/image";
const ProdItem = ({ dish, navigate }) => {
  return (
    <li
      className="product__item"
      onClick={() => {
        navigate({ link: `dishes/${dish.name}` });
      }}
    >
      <Image
        className="product__item__img"
        src={dish.image}
        alt="404"
        width={296}
        height={184}
      />
      <p className="product__item__name">{dish.name}</p>
      <p className="product__item__price">{dish.price} $</p>
      <p className="product__item__description">{dish.description}</p>
    </li>
  );
};

export default ProdItem;
