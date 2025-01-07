import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import Header from "../../components/layout/Header/Header";
import Footer from "../../components/layout/Footer/Footer";

export async function getServerSideProps(context) {
  const { name } = context.query;

  if (!name) {
    return {
      notFound: true,
    };
  }

  try {
    const res = await fetch("http://13.60.77.193/api/dishes"); 
    const dishes = await res.json();

    const dish = dishes.find((d) => d.name === name);

    if (!dish) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        dish,
      },
    };
  } catch (error) {
    console.error("Ошибка при получении данных с API:", error);
    return {
      notFound: true,
    };
  }
}


const product = ({ dish }) => {
  return (
    <>
      <Head>
        <title>{dish.name} — Заказать с доставкой | Ваш ресторан</title>
        <meta name="description" content={dish.description} />
        <meta
          name="keywords"
          content={` ${dish.name}, доставка еды, ресторан`}
        />
        <meta property="og:title" content={dish.name} />
        <meta property="og:description" content={dish.description} />
        <meta property="og:image" content={dish.image} />

        <meta property="og:type" content="product" />
      </Head>
      <Header style={{ height: "10vh" }} />
      <main className="main" style={{ height: "55vh" }}>
        <div className="container">
          <div className="product">
            <Image src={dish.image} alt="404" width={296} height={184} />
            <div className="product__content">
              <h2 className="product__item__name">{dish.name}</h2>
              <p className="product__item__price">{dish.price}</p>
              <p className="product__item__description">{dish.description}</p>
              <button className="dishes__sort__list__btn">Buy</button>
            </div>
          </div>
        </div>
      </main>
      <Footer style={{ height: "45vh" }} />
    </>
  );
};

export default product;
