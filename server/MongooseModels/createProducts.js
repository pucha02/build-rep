const mongoose = require('mongoose');
const Product = require('./Product'); // Вкажіть правильний шлях до вашої моделі Product

const mongoURI = 'mongodb+srv://wixi4598:gj2TIqB9qCzKUeeR@cluster0.zoliw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const products = [
    {
        id: 1,
        title: "Чоловіча футболка Nike",
        category: {
            id: 100,
            title: "Футболки",
        },
        description: "Легка та зручна футболка для тренувань і повсякденного носіння.",
        cost: "49.99",
        color: [
            {
                color_name: "Чорний",
                sizes: [
                    { size_name: "S" },
                    { size_name: "M" },
                    { size_name: "L" }
                ],
                img: [
                    { img_link: "http://example.com/nike_black_s.jpg" },
                    { img_link: "http://example.com/nike_black_m.jpg" }
                ]
            },
            {
                color_name: "Білий",
                sizes: [
                    { size_name: "M" },
                    { size_name: "L" },
                    { size_name: "XL" }
                ],
                img: [
                    { img_link: "http://example.com/nike_white_m.jpg" },
                    { img_link: "http://example.com/nike_white_l.jpg" }
                ]
            }
        ]
    },
    {
        id: 2,
        title: "Жіночі легінси Adidas",
        category: {
            id: 101,
            title: "Легінси",
        },
        description: "Спортивні легінси для йоги та тренувань, облягаючі та еластичні.",
        cost: "69.99",
        color: [
            {
                color_name: "Сірий",
                sizes: [
                    { size_name: "XS" },
                    { size_name: "S" }
                ],
                img: [
                    { img_link: "http://example.com/adidas_gray_xs.jpg" },
                    { img_link: "http://example.com/adidas_gray_s.jpg" }
                ]
            }
        ]
    },
    {
        id: 3,
        title: "Кросівки Puma",
        category: {
            id: 102,
            title: "Кросівки",
        },
        description: "Зручні кросівки для бігу з амортизацією та дихаючими матеріалами.",
        cost: "89.99",
        color: [
            {
                color_name: "Червоний",
                sizes: [
                    { size_name: "42" },
                    { size_name: "43" },
                    { size_name: "44" }
                ],
                img: [
                    { img_link: "http://example.com/puma_red_42.jpg" },
                    { img_link: "http://example.com/puma_red_43.jpg" }
                ]
            },
            {
                color_name: "Синій",
                sizes: [
                    { size_name: "41" },
                    { size_name: "42" }
                ],
                img: [
                    { img_link: "http://example.com/puma_blue_41.jpg" },
                    { img_link: "http://example.com/puma_blue_42.jpg" }
                ]
            }
        ]
    }
];

// Підключення до MongoDB та вставка продуктів
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Підключено до MongoDB");

        // Вставляємо кілька товарів
        return Product.insertMany(products);
    })
    .then((result) => {
        console.log("Продукти успішно додані:", result);
    })
    .catch((error) => {
        console.error("Помилка під час додавання продуктів:", error);
    })
    .finally(() => {
        mongoose.disconnect();
    });
