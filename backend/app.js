require("dotenv").config();
require("express-async-errors");
const cors = require("cors");
const express = require("express");
const morgan = require("morgan");
const app = express();

// packages
const cookieParser = require("cookie-parser");

const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

// connectDV
const connectDB = require("./db/connect");

// routes mapping
const authRouter = require("./routes/authRoutes");
const productRouter = require("./routes/productRoutes");
const userRouter = require("./routes/userRoutes");

// middleware
app.use(morgan("tiny"));
app.set("trust proxy", 1);
app.use(cors());
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

app.get("/", (req, res) => {
  res.send("Finally af ter so much long time....");
});

const port = process.env.PORT || 7000;

// app.listen(PORT, () => {
//   console.log(`app is lestening on POST ${PORT}`);
// });
// routing map
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/users", userRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server is listening in in PORT:${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};
start();
