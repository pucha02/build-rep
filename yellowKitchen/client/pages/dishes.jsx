import DishesList from "../components/layout/Dishes/DishesList";
import Sort from "../components/layout/Dishes/Sort";
import Footer from "../components/layout/Footer/Footer";
import Header from "../components/layout/Header/Header";
import { useRouter } from "next/router";
import Head from "next/head";

export async function getServerSideProps() {
  try {
    const res = await fetch("http://localhost:5000/api/dishes");
    const dishes = await res.json();

    return {
      props: {
        dishes,
      },
    };
  } catch (error) {
    console.error("Ошибка при получении данных:", error);
    return {
      props: {
        dishes: [],
      },
    };
  }
}

const products = (dishes) => {
  const router = useRouter();

  const navigate = ({ link }) => {
    // Навигация на страницу /about
    router.push(`${link}`);
  };
  return (
    <>
      <Head>
        <title>Меню — Ресторан с доставкой на дом</title>

        <meta
          name="description"
          content="Просмотрите наше меню с широким выбором блюд: пицца, суши, паста, десерты и многое другое. Закажите доставку еды на дом!"
        />

        <meta
          name="keywords"
          content="меню ресторана, доставка еды, пицца, суши, паста, десерты"
        />

        <meta
          property="og:title"
          content="Меню — Ресторан с доставкой на дом"
        />
        <meta
          property="og:description"
          content="Посмотрите наше разнообразное меню с пиццей, суши и другими вкусными блюдами. Заказывайте доставку на дом!"
        />
        <meta
          property="og:image"
          content="https://www.yourrestaurant.com/images/menu-og-image.jpg"
        />
        <meta property="og:url" content="https://www.yourrestaurant.com/menu" />
        <meta property="og:type" content="website" />
      </Head>
      <Header />
      <main className="main">
        <div className="dishes__container">
          <Sort />
          <DishesList navigate={navigate} dishes={dishes} />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default products;
