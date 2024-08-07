const Cart = require("../models/Cart");
const CartItem = require("../models/CartItem");
const Product = require("../models/Product");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");

const addToCart = async (req, res) => {
  const { productId, quantity, set, color } = req.body;
  const userId = req.user.userId;
  //   console.log(req.user.userId);
  const product = await Product.findById(productId);
  if (!product) {
    throw new CustomError.NotFoundError("Product not found");
  }

  // Calculate the price for the given quantity
  const price = product.price * quantity;

  // Create a new CartItem
  const cartItem = new CartItem({
    productId,
    quantity,
    price,
    set,
    color,
  });

  // Find the user's cart or create a new one
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = new Cart({ userId, items: [], totalPrice: 0, totalItems: 0 });
  }

  // Add the CartItem to the cart
  cart.items.push(cartItem);
  cart.totalPrice += price;
  cart.totalItems += quantity;

  await cart.save();
  res.status(StatusCodes.OK).json({ data: cart });
  //   console.log("adding to kart");
};

const getCart = async (req, res) => {
  const userId = req.user.userId;

  const cart = await Cart.findOne({ userId }).populate("items.productId");

  if (!cart) {
    throw new CustomError("Cart not found");
  }
  res.status(StatusCodes.OK).json({ data: cart });
};

const removeitem = async (req, res) => {
  //   const { cartItemId } = req.params.id;
  const userId = req.user.userId;
  //   console.log(req.params.id);
  //   console.log(userId);

  // Find the user's cart
  const cart = await Cart.findOne({ userId });
  if (!cart) {
    throw new Error("Cart not found");
  }

  // Find the CartItem
  const cartItem = cart.items.id(req.params.id);
  //   console.log(cartItem);

  if (!cartItem) {
    throw new Error("CartItem not found");
  }

  //   Remove the CartItem from the cart
  cart.items.pull(cartItem._id);
  cart.totalPrice -= cartItem.price;
  cart.totalItems -= cartItem.quantity;

  //   await cart.save();
  res.status(StatusCodes.OK).json({ data: "item Romoved", cart });
};
module.exports = { addToCart, getCart, removeitem };
