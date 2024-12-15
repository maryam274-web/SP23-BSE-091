const mongoose=require("mongoose");

let categorySchema=new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    products: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product'  // The referenced model is Product
    }],
   
});

let categoryModel=mongoose.model("Category",categorySchema);
module.exports=categoryModel;