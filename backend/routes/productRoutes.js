const router = require("express").Router();

const {
  createProduct,
  getAllProducts,
  getSingleProduct,
} = require("../controllers/productController");
const {
  authenticateUser,
  authorizePermission,
} = require("../middleware/authentication");

router
  .route("/")
  .post([authenticateUser, authorizePermission("admin")], createProduct)
  .get(getAllProducts);

router.route("/:id").get(getSingleProduct);

module.exports = router;
