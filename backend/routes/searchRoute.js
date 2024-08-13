const router = require("express").Router();
const {
  searchProduct,
  searchCategory,
} = require("../controllers/productController");

router.get("/", searchProduct);
router.get("/category", searchCategory);

module.exports = router;
