const router = require("express").Router();

const { getAllUsers, getSingleUser } = require("../controllers/userController");
const { authenticateUser } = require("../middleware/authentication");

router.route("/").get(getAllUsers);

router.route("/:id").get(authenticateUser, getSingleUser);

module.exports = router;
