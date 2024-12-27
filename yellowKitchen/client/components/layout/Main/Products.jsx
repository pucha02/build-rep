import Image from "next/image";
import deli from "../../../assets/image/Photo.png";
import ProdItem from "../ProdItem/ProdItem";
import { useState } from "react";
const Products = ({ dishes, navigate }) => {
  const [renderCount, setRenderCount] = useState(4);

  return (
    <div className="products">
      <div className="products__content">
        <h2>Restaurant Menu</h2>
        <button
          onClick={() => {
            renderCount === 4 ? setRenderCount(8) : setRenderCount(4);
          }}
        >
          {renderCount === 4 ? "Show all" : "Hide"}
        </button>
      </div>
      <ul
        className={renderCount === 4 ? "products__list" : "products__list open"}
      >
        {dishes.map((dish, index) => {
          if (dish.id <= renderCount) {
            return <ProdItem key={index} dish={dish} navigate={navigate} />;
          }
        })}
      </ul>
    </div>
  );
};

export default Products;
