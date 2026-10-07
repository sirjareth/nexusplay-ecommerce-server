const Cart = require("../models/Cart");




module.exports.getCart = (req, res) => {
    Cart.findOne({ userId: req.user.id })
        .then(cart => {
            if (!cart) return res
            	.status(404).send({ error: "Cart not found" });
            return res
            .status(200).send(cart);
        })
        .catch(err => res.status(500)
        	.send({ error: "Server error", details: err }));
};



module.exports.addToCart = (req, res) => {
    const { productId, quantity, subtotal } = req.body;

    Cart.findOne({ userId: req.user.id })
        .then(cart => {
            if (!cart) {
                // If no cart, create a new one
                let newCart = new Cart({
                    userId: req.user.id,
                    cartItems: [{ productId, quantity, subtotal }],
                    totalPrice: subtotal
                });
                return newCart.save().then(c => res.status(201).send(c));
            }

            // If cart exists, check if product is already in it
            let itemIndex = cart.cartItems.findIndex(item => item.productId === productId);
            
            if (itemIndex > -1) {
                // STACKING LOGIC: Add the new quantity and subtotal to the existing ones
                cart.cartItems[itemIndex].quantity += quantity; 
                cart.cartItems[itemIndex].subtotal += subtotal;
            } else {
                // If product is not in cart, push it as a new item
                cart.cartItems.push({ productId, quantity, subtotal });
            }

            // Recalculate the grand total for the whole cart
            cart.totalPrice = cart.cartItems.reduce((sum, item) => sum + item.subtotal, 0);
            return cart.save().then(c => res.status(200).send(c));
        })
        .catch(err => res.status(500).send({ error: "Server error", details: err }));
};



module.exports.updateQuantity = (req, res) => {
    const { productId, newQuantity } = req.body;

    Cart.findOne({ userId: req.user.id })
        .then(cart => {
            if (!cart) return res.status(404).send({ error: "Cart not found" });

            let item = cart.cartItems.find(item => item.productId === productId);
            if (!item) return res.status(404).send({ error: "Item not found in cart" });

            const pricePerItem = item.subtotal / item.quantity;

            item.quantity = newQuantity;

            item.subtotal = pricePerItem * newQuantity;

            if (item.quantity === 0) {
                 cart.cartItems = cart.cartItems.filter(i => i.productId !== productId);
            }

            cart.totalPrice = cart.cartItems.reduce((sum, item) => sum + item.subtotal, 0);
				return cart.save().then(c => res.status(200).send(c));
        })
        .catch(err => res.status(500).send({ error: "Server error", details: err }));
};



module.exports.removeFromCart = (req, res) => {
    Cart.findOne({ userId: req.user.id })
        .then(cart => {
            if (!cart) return res.status(404).send({ error: "Cart not found" });

            let itemIndex = cart.cartItems.findIndex(item => item.productId === req.params.productId);
            if (itemIndex === -1) return res.status(404).send({ message: "Item not found in cart" });

            cart.cartItems.splice(itemIndex, 1);
            cart.totalPrice = cart.cartItems.reduce((sum, item) => sum + item.subtotal, 0);

            return cart.save().then(c => res.status(200).send({ message: "Item removed from cart", cart: c }));
        })
        .catch(err => res.status(500).send({ error: "Server error", details: err }));
};

module.exports.clearCart = (req, res) => {
    Cart.findOne({ userId: req.user.id })
        .then(cart => {
            if (!cart) return res.status(404).send({ error: "Cart not found" });
            if (cart.cartItems.length === 0) return res.status(200).send({ message: "Cart is already empty" });

            cart.cartItems = [];
            cart.totalPrice = 0;

            return cart.save().then(c => res.status(200).send({ message: "Cart cleared successfully", cart: c }));
        })
        .catch(err => res.status(500).send({ error: "Server error", details: err }));
};