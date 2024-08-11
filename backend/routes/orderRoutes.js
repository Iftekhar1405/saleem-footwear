const express = require("express");
const router = express.Router();
const {
  createOrder,
  orderHistory,
  updateOrderStatus,
} = require("../controllers/ordersController");
const {
  authenticateUser,
  authorizePermission,
} = require("../middleware/authentication");

router.route("/").post(authenticateUser, createOrder);
router.route("/history").get(authenticateUser, orderHistory);
router
  .route("/status/:orderId")
  .patch([authenticateUser, authorizePermission("admin")], updateOrderStatus);

module.exports = router;
