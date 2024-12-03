const mongoose=require("mongoose");

let categorySchema=new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
   
});

let categoryModel=mongoose.model("categories",categorySchema);
module.exports=categoryModel;
