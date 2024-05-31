const express = require("express");
const app = express();
require("./db/conn");
const cors = require("cors");
const productsRouter = require("./routes/Products");
const categoriesRouter = require("./routes/Categories");
const brandsRouter = require("./routes/Brands");

const port = 8000;

app.use(express.json()); // to parse req.body
app.use(
  cors({
    exposedHeaders: ["X-Total-Count"],
  })
);
app.use(express.urlencoded({ extended: false }));

//APIS
app.use("/products", productsRouter);
app.use("/categories", categoriesRouter);
app.use("/brands", brandsRouter);

app.get("/", (req, res) => {
  res.json({ status: "success" });
});

app.listen(port, () => {
  console.log(`listening to port no ${port}`);
});
