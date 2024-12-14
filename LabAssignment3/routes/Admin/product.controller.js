const express = require("express");
let router = express.Router();

let product=require("../../models/product.model");


router.get("/admin/products/create", (req, res) => {
  res.render('admin/product-form',{ layout: "adminlayout" });
});

router.post("/admin/products/create", async(req, res) => {
    const data = req.body;
    let newProduct= new product(data);
    await newProduct.save();
    return res.redirect("/admin/products");
    
});

router.get("/admin/products", async (req, res) => {
  try {
    let products = await product.find(); // Fetch all products
    return res.render("admin/products", {
      layout: "adminlayout",
      pageTitle: "Manage Your Products",
      products,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error retrieving products.");
  }
});


//route to render edit product form
router.get("/admin/products/edit/:id", async (req, res) => {
  let products = await product.findById(req.params.id);
  return res.render("./Admin/product_edit_form", {
    layout: "adminlayout",
    products,
  });
});
router.post("/admin/products/edit/:id", async (req, res) => {
  let products = await product.findById(req.params.id);
  products.title = req.body.title;
  products.description = req.body.description;
  products.price = req.body.price;
  await products.save();
  return res.redirect("/admin/products");
});


// route to handle Delete of product
router.get("/admin/products/delete/:id", async (req, res) => {
  let params = req.params;
  let products = await product.findByIdAndDelete(req.params.id);
  return res.redirect("/admin/products");
});



  


module.exports = router;