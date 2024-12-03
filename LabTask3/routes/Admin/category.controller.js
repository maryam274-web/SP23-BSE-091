const express = require("express");
let router = express.Router();

let categories=require("../../models/category.model");


router.get("/admin/products/Categories/create", (req, res) => {
  res.render('admin/categories_form',{ layout: "adminlayout" });
});

router.post("/admin/products/Categories/create", async(req, res) => {
  console.log("Request body:", req.body);
    const data = req.body;
    let newCategory= new categories(data);
    await newCategory.save();
    return res.redirect("/admin/products/Categories");
    
});

router.get("/admin/products/categories", async (req, res) => { // Make route lowercase
    try {
      let Category = await categories.find();
      return res.render("admin/categories", { // Adjust view path accordingly
        layout: "adminlayout",
        pageTitle: "Manage Your Category",
        Category,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).send("Error retrieving Category.");
    }
  });
  


//route to render edit product form
router.get("/admin/products/Categories/edit/:id", async (req, res) => {
  let category = await categories.findById(req.params.id);
  return res.render("./Admin/categories_edit_form", {
    layout: "adminlayout",
    category,
  });
});
router.post("/admin/products/Categories/edit/:id", async (req, res) => {
  let category = await categories.findById(req.params.id);
  category.title = req.body.title;
  category.description = req.body.description;
  category.price = req.body.price;
  await category.save();
  return res.redirect("/admin/products/Categories");
});


// route to handle Delete of product
router.get("/admin/products/Categories/delete/:id", async (req, res) => {
  let params = req.params;
  let  Category = await  categories.findByIdAndDelete(req.params.id);
  return res.redirect("/admin/products/Categories");
});



  


module.exports = router;