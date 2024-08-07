const Order = require("../models/Order");
const CustomError = require("../errors");

// router.post("/orders", authenticateUser, async (req, res) => {
//   try {
//     const { orderId, orderDetail, customerId, orderDate, status } = req.body;

//     // Create a new order
//     const newOrder = new Order({
//       orderId,
//       orderDetail,
//       customerId: req.user.userId, // assuming customerId is the userId from the token
//       orderDate,
//       status,
//     });

//     await newOrder.save();

//     res
//       .status(201)
//       .json({ message: "Order Placed", orderId: newOrder.orderId });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

const createOrder = async (req, res) => {
  console.log(req.body);
  res.status(200).json({ msg: " all clear!!" });
};
module.exports = { createOrder };
