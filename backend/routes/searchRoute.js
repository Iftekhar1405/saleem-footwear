const router = require("express").Router();
const {
  searchProduct,
  searchCategory,
  distinctCategory,
  testSearch,
} = require("../controllers/productController");

// router.get("/", testSearch);
router.get("/category", searchCategory);
// router.get("")

module.exports = router;
