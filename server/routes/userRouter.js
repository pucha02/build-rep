const Router = require("express");
const router = new Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/registration", userController.registration);
router.post("/login", userController.login);
router.get("/auth", authMiddleware, userController.check);
router.put("/update", authMiddleware, userController.updateUser);
router.post("/admin", userController.loginAdmin);
router.get("/users", userController.getAllUsers);

module.exports = router;
