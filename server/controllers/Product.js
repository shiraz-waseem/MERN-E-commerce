const Product = require("../models/Product");

const createProduct = async (req, res) => {
  const product = new Product(req.body); // req.body API Call frontend sy aye gy

  try {
    const doc = await product.save();
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};

// /products?_page=1&_limit=2
// PostMan Query Params mein value add hurhy
const fetchAllProducts = async (req, res) => {
  // let query = Product.find({ deleted: { $ne: true } }); // deleted not equal to true
  // let totalProductsQuery = Product.find({ deleted: { $ne: true } });

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
    query = query.find({ category: req.query.category }); // find laga di of mongodb

    // Total count after category
    totalProductsQuery = totalProductsQuery.find({
      category: req.query.category,
    });
  }

  // same for brand
  if (req.query.brand) {
    query = query.find({ brand: req.query.brand });
    totalProductsQuery = totalProductsQuery.find({ brand: req.query.brand });
  }

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
    res.set("X-Total-Count", totalDocs); // Header ka naam and value to give for header
    res.status(200).json(docs);
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
