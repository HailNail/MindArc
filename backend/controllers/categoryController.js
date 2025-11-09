import Category from "../models/categoryModel.js";
import Product from "../models/productModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";

const createCategory = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.json({ error: "Name is required" });
    }

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.json({ error: "Category already exists" });
    }

    const category = await new Category({ name }).save();
    res.json(category);
  } catch (error) {
    console.error(error);
    res.statuse(400).json(error);
  }
});

const updateCategory = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;
    const { categoryId } = req.params;

    const category = await Category.findOne({ _id: categoryId });

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    category.name = name || category.name;
    const updateCategory = await category.save();
    res.json(updateCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ "Internal Server Error": error.message });
  }
});

const removeCategory = asyncHandler(async (req, res) => {
  try {
    const categoryId = req.params.categoryId;

    const existingProduct = await Product.findOne({ category: categoryId });
    if (existingProduct) {
      return res.status(400).json({
        error:
          "Cannot delete category because it is assigned to one or more products.",
      });
    }

    const removed = await Category.findByIdAndDelete(req.params.categoryId);
    if (!removed) {
      return res.status(400).json({
        error: "Category not found",
      });
    }
    res.json({
      message: "Category deleted successfully",
      id: removed._id,
      name: removed.name,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ "Internal Server Error": error.message });
  }
});

const listCategory = asyncHandler(async (req, res) => {
  try {
    const categories = await Category.find({});
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const count = await Product.countDocuments({ category: category._id });
        return { ...category._doc, productCount: count };
      })
    );

    res.json(categoriesWithCount);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

const readCategory = asyncHandler(async (req, res) => {
  try {
    const category = await Category.findOne({ _id: req.params.id });
    res.json(category);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});
export {
  createCategory,
  updateCategory,
  removeCategory,
  listCategory,
  readCategory,
};
