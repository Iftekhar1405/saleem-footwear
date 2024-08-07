const router = require("express").Router();
const { authenticateUser } = require("../middleware/authentication");
const { addToCart } = require("../controllers/cartController");

router.route("/add-to-cart").post(authenticateUser, addToCart);

module.exports = router;
