const Order = require("../models/Order");
const Cart = require("../models/Cart");

// [POST] - Non-admin user checkout (Create Order)
module.exports.createOrder = (req, res) => {
    // Prevent admins from placing orders
    if (req.user.isAdmin) {
        return res.status(403).send({ error: "Action forbidden: Admins cannot place orders" });
    }

    Cart.findOne({ userId: req.user.id })
        .then(cart => {
            if (!cart) return res.status(404).send({ error: "Cart not found" });
            if (cart.cartItems.length === 0) return res.status(400).send({ error: "Cart is empty" });

            let newOrder = new Order({
                userId: req.user.id,
                productsOrdered: cart.cartItems.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    subtotal: item.subtotal
                })),
                totalPrice: cart.totalPrice
            });

            return newOrder.save()
                .then(order => {
                    // Clear the cart after successful order
                    cart.cartItems = [];
                    cart.totalPrice = 0;
                    return cart.save().then(() => {
                        return res.status(201).send({
                            message: "Order placed successfully",
                            order: order
                        });
                    });
                });
        })
        .catch(err => res.status(500).send({ error: "Server error", details: err }));
};

// [GET] - Retrieve all orders (Admin only)
module.exports.getAllOrders = (req, res) => {
    Order.find({})
        .then(orders => res.status(200).send(orders))
        .catch(err => res.status(500).send({ error: "Server error", details: err }));
};

// [GET] - Retrieve authenticated user's own orders
module.exports.getUserOrders = (req, res) => {
    Order.find({ userId: req.user.id })
        .then(orders => {
            if (orders.length === 0) return res.status(404).send({ error: "No orders found" });
            return res.status(200).send(orders);
        })
        .catch(err => res.status(500).send({ error: "Server error", details: err }));
};