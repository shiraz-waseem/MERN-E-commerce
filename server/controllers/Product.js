const Product = require("../models/Product");

const createProduct = async (req, res) => {
  // console.log(req.body);
  const product = new Product(req.body); // req.body API Call frontend sy aye gy

  try {
    const existingProduct = await Product.findOne({
      description: req.body.description,
    });

    if (existingProduct) {
      // If a product with the same title exists, send a 400 response with an error message
      return res.status(400).json({
        message: "The Description has been taken",
      });
    }
    const doc = await product.save();
    res.status(201).json(doc);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: "Failed to create product",
      error: err.message || "Unknown error occurred",
    });
  }
};

// /products?_page=1&_limit=2
// PostMan Query Params mein value add hurhy
const fetchAllProducts = async (req, res) => {
  let condition = {};
  if (!req.query.admin) {
    condition.deleted = { $ne: true };
  }

  let query = Product.find(condition);
  let totalProductsQuery = Product.find(condition);

  // Category time
  // Multiple category bhi support. Last category we click wohi arhy thy when we did in frontend not here aisa
  if (req.query.category) {
    // agar category aye gy in query mtlb filter krwana cha rhy
    query = query.find({ category: { $in: req.query.category.split(",") } }); // find laga di of mongodb

    // Total count after category
    totalProductsQuery = totalProductsQuery.find({
      category: { $in: req.query.category.split(",") },
    });
  }

  // same for brand
  // if (req.query.brand) {
  //   query = query.find({ brand: { $in: req.query.brand.split(",") } });
  //   totalProductsQuery = totalProductsQuery.find({
  //     brand: { $in: req.query.brand.split(",") },
  //   });
  // }

  // agar _sort ha and order saath hi huty asc ya desc then sorting ki request fire huwi ha
  // sort = {_sort:"price",_order="desc"}

  //TODO : How to get sort on discounted Price not on Actual price

  // query = kia har jagah we are appending it adding it in query

  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query._sort]: req.query._order });
  }

  // Total Counts for pagination
  const totalDocs = await totalProductsQuery.count().exec();
  console.log({ totalDocs });

  // pagination
  if (req.query._page && req.query._limit) {
    const pageSize = req.query._limit;
    const page = req.query._page;

    query = query.skip(pageSize * (page - 1)).limit(pageSize); // Formula phela page nothing skip
  }

  try {
    const docs = await query.exec(); // execute
    // res.set("X-Total-Count", totalDocs); // Header ka naam and value to give for header
    res.set({
      "X-Total-Count": totalDocs,
      "Access-Control-Expose-Headers": "X-Total-Count",
    });

    // res.status(200).json(docs);
    res.status(200).json({
      totalItems: totalDocs,
      products: docs, // Ensure this is an array
    });
  } catch (err) {
    res.status(400).json(err);
  }
};

const fetchProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json(err);
  }
};

// sirf jo field change woh hugy
const updateProduct = async (req, res) => {
  console.log("I got hit");
  const { id } = req.params;

  try {
    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true, // frontend py dependent ha is lia new
    });
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json(err);
  }
};

module.exports = {
  createProduct,
  fetchAllProducts,
  fetchProductById,
  updateProduct,
};
