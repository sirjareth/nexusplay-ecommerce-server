const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
	userId: {type: String, required: [true, "User ID is required"]},
	cartItems: [
		{
			productId: { type: String, required: [true, "Product ID is required"]},
			quantity: { type: Number, required: [true, "Quantity is required"]},
			subtotal: { type: Number, required: [true, "Subtotal is required"]}

	}],
	totalPrice: { type: Number, default: 0}
});

module.exports = mongoose.model("Cart", cartSchema);