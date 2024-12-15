const mongoose=require("mongoose");

let productSchema=new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    image: {  type: String },
    category: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Category', 
    },
   
});

let productModel=mongoose.model("Product",productSchema);
module.exports=productModel;