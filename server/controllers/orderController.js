const uuid = require("uuid");
const path = require("path");
const { Order, OrderDevices } = require("../models/models");
const { Op } = require("sequelize");
const ApiError = require("../error/ApiError");

class OrderController {
  async create(req, res, next) {
    try {
      let {
        orderEmail,
        phoneNumber,
        name,
        surname,
        products,
        delivery,
        payment,
        cost,
      } = req.body;

      const order = await Order.create({
        orderEmail,
        phoneNumber,
        name,
        surname,
        products,
        delivery,
        payment,
        cost,
      });

      if (products) {
        products = JSON.parse(products);
        const ordersId = order.id;
        products.forEach((el) => {
          OrderDevices.create({
            name: el.name,
            category: el.catigory,
            count: el.count,
            orderId: ordersId,
          });
        });
      }

      return res.json(order);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
  async getAllOrders(req, res, next) {
    try {
      const orders = await Order.findAll();
      const ordersWithProdPromises = orders.map(async (order) => {
        const { id } = order;
        const orderWithProd = await Order.findByPk(id, {
          include: [{ model: OrderDevices, as: "devices" }],
        });
        return orderWithProd;
      });

      const ordersWithProd = await Promise.all(ordersWithProdPromises);

      return res.json(ordersWithProd);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new OrderController();
