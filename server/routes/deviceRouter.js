const Router = require("express");
const router = new Router();
const deviceController = require("../controllers/deviceController");
router.post("/", deviceController.create);
router.get("/", deviceController.getAll);
router.get("/actual", deviceController.getActualDevices);
router.get("/search", deviceController.getSearchDevices);
router.get("/:id", deviceController.getOne);

module.exports = router;
