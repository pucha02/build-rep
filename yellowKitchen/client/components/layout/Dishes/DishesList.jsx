import ProdItem from "../ProdItem/ProdItem";

const DishesList = ({ dishes, navigate }) => {
  console.log(dishes.dishes);
  return (
    <ul className="dishes__list">
      {dishes.dishes.map((dish) => (
        <ProdItem navigate={navigate} dish={dish} />
      ))}
    </ul>
  );
};

export default DishesList;
