const Product = require("../models/Product");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");

const createProduct = async (req, res) => {
  // console.log(req.body);
  // console.log("cookies:", req.cookies);
  // console.log(req.body.items);
  // const {
  //   body: { items },
  // } = req.body;
  const items = req.body;
  req.body.user = req.user.userId;
  const product = await Product.create(items);
  res.status(StatusCodes.CREATED).json({ product });
};

const getAllProducts = async (req, res) => {
  const products = await Product.find({}).select(
    "name brand color price discount images set style"
  );
  console.log("OK");

  res.status(StatusCodes.OK).json({ products, count: products.length });
};

const getSingleProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOne({ _id: productId });
  if (!product) {
    throw new CustomError.NotFoundError(`No product with id: ${productId}`);
  }
  res.status(StatusCodes.OK).json({ product });
};

const updateProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.updateOne(
    { _id: productId },
    { $set: req.body },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!product) {
    throw new CustomError.NotFoundError(`No product wth Id: ${productId}`);
  }
  res.status(StatusCodes.OK).json({ product });
};

const deleteProduct = async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findOne({ _id: productId });
  if (!product) {
    throw new CustomError.NotFoundError(`No product with Id: ${productId}`);
  }
  await Product.deleteOne({ _id: productId });
  res.status(StatusCodes.OK).json({ msg: "Product have been deleted ;)" });
};

const searchProduct = async (req, res) => {
  try {
    const { q, page = 1 } = req.query; // Extract 'q' and 'page' from query parameters

    // Construct the search query
    const searchQuery = {
      $or: [
        { brand: { $regex: q, $options: "i" } }, // Case-insensitive search in brand
        { category: { $regex: q, $options: "i" } }, // Case-insensitive search in category
        { article: { $regex: q, $options: "i" } }, // Case-insensitive search in article
        { gender: { $regex: q, $options: "i" } }, // Case-insensitive search in gender
      ],
    };

    // Pagination options
    const limit = 10; // Number of results per page
    const skip = (page - 1) * limit; // Calculate how many results to skip

    // Execute the query with pagination
    const products = await Product.find(searchQuery)
      //  .select") // Only select the productName field
      .skip(skip) // Skip the appropriate number of results
      .limit(limit); // Limit the number of results returned

    // Get the total count of matching documents
    const total = await Product.countDocuments(searchQuery);

    // Calculate the total number of pages
    const totalPages = Math.ceil(total / limit);

    // Send the response with products, current page, and total pages
    res.json({
      products,
      currentPage: parseInt(page),
      totalPages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  searchProduct,
};
