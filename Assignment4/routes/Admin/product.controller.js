const express = require("express");
const multer = require("multer");
const path = require("path");
let router = express.Router();

let product=require("../../models/product.model");
let Category = require("../../models/category.model");


router.get("/admin/products", async (req, res) => {
  try {
    const search = req.query.search || ""; // Extract search query

    // Build a query to match product title, description, or category title
    let query = {};

    if (search) {
      // Fetch matching categories based on search
      const matchingCategories = await Category.find({
        title: { $regex: search, $options: "i" }, // Case-insensitive category search
      });

      const categoryIds = matchingCategories.map((cat) => cat._id); // Extract category IDs

      // Build the query to search in title, description, or category
      query.$or = [
        { title: { $regex: search, $options: "i" } }, // Match product title
        { description: { $regex: search, $options: "i" } }, // Match product description
        { category: { $in: categoryIds } }, // Match category IDs
      ];
    }

    // Fetch filtered products and populate category
    let products = await product.find(query).populate("category", "title");

    // Render the products page with filtered results
    return res.render("admin/products", {
      layout: "adminlayout",
      pageTitle: "Manage Your Products",
      products,
      currentSearch: search, // Pass the search value for input persistence
    });
  } catch (err) {
    console.error("Error fetching products with search:", err);
    return res.status(500).send("Error retrieving products.");
  }
});



router.get("/admin/products/create", async(req, res) => {
  const categories = await Category.find();
  // console.log(categories);
  res.render('admin/product-form',{ 
    layout: "adminlayout",
    categories, 
   });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Public/uploads"); // Path to save images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename with original extension
  },
});
const upload = multer({ storage: storage });



router.post("/admin/products/create",upload.single('productImage'), async (req, res) => {
  try {
    let { title, price, description, categoryId } = req.body;
    let image = "";
    
    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }

    // console.log("Uploaded File:", req.file);

    // Create a new product
    let newProduct = new product({
      title,
      price,
      description,
      category: categoryId,
      image: image || "",
    });
    console.log("New Product Data:", newProduct);

    await newProduct.save();

    // Add the product to the selected category
    await Category.findByIdAndUpdate(categoryId, {
      $push: { products: newProduct._id },
    });

    res.redirect("/admin/products");
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).send("Error creating product");
  }
});





//route to render edit product form
router.get("/admin/products/edit/:id", async (req, res) => {
  let products = await product.findById(req.params.id).populate('category');
  const categories = await Category.find();
  return res.render("./Admin/product_edit_form", {
    layout: "adminlayout",
    products,
    categories,
    currentSearch: "",
  });
});


router.post("/admin/products/edit/:id", upload.single('productImage'), async (req, res) => {
  try {
    let data = req.body; 
    if (req.file) {
      data.image = `/uploads/${req.file.filename}`;
    }
    // Fetch the product being edited
    let productToUpdate = await product.findById(req.params.id).populate("category");
    // console.log("Request Body:", req.body);
    const { title, price, description, categoryId } = req.body;
    // console.log("Product Before Update:", productToUpdate);
    const oldCategoryId = productToUpdate.category ? productToUpdate.category._id : null;

    // Update product details
    productToUpdate.title = title;
    productToUpdate.price = price;
    productToUpdate.description = description;
    productToUpdate.category = categoryId;
    productToUpdate.image = `/uploads/${req.file.filename}`;
    

    await productToUpdate.save();

    // console.log("Updated Product:", productToUpdate);
    const newCategory = await Category.findById(categoryId);
    // console.log("New Category:", newCategory);

    // Remove product from old category if it changed
    if (oldCategoryId && oldCategoryId.toString() !== categoryId) {
      await Category.findByIdAndUpdate(oldCategoryId, {
        $pull: { products: productToUpdate._id },
      });
    }

    // Add product to the new category
    await Category.findByIdAndUpdate(categoryId, {
      $addToSet: { products: productToUpdate._id },
    });

    res.redirect("/admin/products");
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).send("Error updating product");
  }
});


// route to handle Delete of product
router.get("/admin/products/delete/:id", async (req, res) => {
  let params = req.params;
  let products = await product.findByIdAndDelete(req.params.id);
  return res.redirect("/admin/products");
});






module.exports = router;