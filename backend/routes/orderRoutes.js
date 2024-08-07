const express = require("express");
const router = express.Router();
const { createOrder } = require("../controllers/orderController");
const {
  authenticateUser,
  authorizePermission,
} = require("../middleware/authentication");

router.route("/").post(authenticateUser, createOrder);

module.exports = router;
