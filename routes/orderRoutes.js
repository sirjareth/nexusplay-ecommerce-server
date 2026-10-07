const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const auth = require("../auth");

function verifyAdmin(req, res, next) {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        return res.status(403).send({ auth: "Failed", message: "Action forbidden: Admin only" });
    }
}

// Non-admin user checkout
router.post("/checkout", auth.verify, orderController.createOrder);

// Retrieve all orders - Admin only
router.get("/all-orders", auth.verify, verifyAdmin, orderController.getAllOrders);

// Retrieve authenticated user's own orders
router.get("/my-orders", auth.verify, orderController.getUserOrders);

module.exports = router;