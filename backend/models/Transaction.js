const mongoose = require('mongoose');

// Define the schema for transactions
const transactionSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true }, // Unique transaction ID
    title: { type: String, required: true }, // Title 
    price: { type: Number, required: true }, // Price
    description: { type: String }, // Description
    category: { type: String, required: true }, // Category
    image: { type: String }, // Product image
    sold: { type: Boolean, required: true }, // Whether the product is sold or not
    dateOfSale: { type: Date, required: true }, // Date of sale
});

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
