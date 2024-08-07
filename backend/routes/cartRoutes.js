const router = require("express").Router();
const { authenticateUser } = require("../middleware/authentication");
const {
  addToCart,
  getCart,
  removeitem,
} = require("../controllers/cartController");

router.route("/add-to-cart").post(authenticateUser, addToCart);
router.route("/get-cart").get(authenticateUser, getCart);
router.route("/:id").delete(authenticateUser, removeitem);

module.exports = router;
