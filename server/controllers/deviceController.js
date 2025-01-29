const uuid = require("uuid");
const path = require("path");
const { Device, DeviceInfo } = require("../models/models");
const { Op } = require("sequelize");
const ApiError = require("../error/ApiError");

class DeviceController {
  async create(req, res, next) {
    try {
      let {
        name,
        price,
        brandId,
        typeId,
        info,
        discount,
        catigory,
        relevance,
      } = req.body;
      const { img, img2, img3, img4 } = req.files;

      let fileName = uuid.v4() + ".jpg";
      img.mv(path.resolve(__dirname, "..", "static", fileName));

      let fileName2 = uuid.v4() + ".jpg";
      img2.mv(path.resolve(__dirname, "..", "static", fileName2));

      let fileName3 = uuid.v4() + ".jpg";
      img3.mv(path.resolve(__dirname, "..", "static", fileName3));

      let fileName4 = uuid.v4() + ".jpg";
      img4.mv(path.resolve(__dirname, "..", "static", fileName4));

      const device = await Device.create({
        name,
        price,
        brandId,
        typeId,
        img: fileName,
        img2: fileName2,
        img3: fileName3,
        img4: fileName4,
        discount,
        catigory,
        relevance,
      });

      if (info) {
        info = JSON.parse(info);
        info.forEach((el) => {
          DeviceInfo.create({
            title: el.title,
            description: el.description,
            deviceId: device.id,
          });
        });
      }

      return res.json(device);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
  async getAll(req, res) {
    let { brandId, typeId, limit, page, sortBy } = req.query;
    page = page || 1;
    limit = limit || 9;
    let offset = page * limit - limit;
    let device;

    let order = [];
    if (sortBy === "priceAscending") {
      order.push(["id", "ASC"]);
    } else if (sortBy === "priceDescending") {
      order.push(["id", "DESC"]);
    }

    if (!brandId && !typeId) {
      device = await Device.findAndCountAll({ limit, offset, order });
    }
    if (brandId && !typeId) {
      device = await Device.findAndCountAll({
        where: { brandId },
        limit,
        offset,
        order,
      });
    }
    if (!brandId && typeId) {
      device = await Device.findAndCountAll({
        where: { typeId },
        limit,
        offset,
        order,
      });
    }
    if (brandId && typeId) {
      device = await Device.findAndCountAll({
        where: { brandId, brandId },
        limit,
        offset,
        order,
      });
    }
    return res.json(device);
  }
  async getOne(req, res) {
    const { id } = req.params;
    const device = await Device.findOne({
      where: { id },
      include: [{ model: DeviceInfo, as: "info" }],
    });
    return res.json(device);
  }
  async getActualDevices(req, res) {
    let { limit, page } = req.query;
    page = page || 1;
    limit = limit || 9;
    let offset = page * limit - limit;
    let device;

    try {
      device = await Device.findAndCountAll({
        where: { relevance: "actual" },
        limit,
        offset,
      });

      return res.json(device);
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async getSearchDevices(req, res) {
    let { limit, page, searchTerm } = req.query;
    page = page || 1;
    limit = limit || 9;
    let offset = page * limit - limit;

    try {
      let devices;

      devices = await Device.findAndCountAll({
        where: {
          name: { [Op.iLike]: `%${searchTerm}%` },
        },
        limit,
        offset,
      });

      return res.json(devices);
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

module.exports = new DeviceController();
