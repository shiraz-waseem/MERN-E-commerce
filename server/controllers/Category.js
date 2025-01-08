const Category = require("../models/Category");

const fetchCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).exec();
    res.status(200).json(categories);
  } catch (err) {
    res.status(400).json(err);
  }
};

const createCategory = async (req, res) => {
  const category = new Category(req.body);
  try {
    const doc = await category.save();
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};

const fetchCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findById(id);
    res.status(200).json(category);
  } catch (err) {
    res.status(400).json(err);
  }
};

const updateCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(category);
  } catch (err) {
    res.status(400).json(err);
  }
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    await Category.findByIdAndDelete(id);
    res.status(200).json({ msg: "Deleted Successfully" });
  } catch (err) {
    res.status(400).json(err);
  }
};

module.exports = {
  fetchCategories,
  createCategory,
  fetchCategoryById,
  updateCategory,
  deleteCategory,
};
