const router = require("express").Router();
const { searchProduct } = require("../controllers/productController");

router.get("/", searchProduct);

module.exports = router;
