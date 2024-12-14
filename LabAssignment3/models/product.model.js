const mongoose=require("mongoose");

let productSchema=new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
   
});

let productModel=mongoose.model("product",productSchema);
module.exports=productModel;