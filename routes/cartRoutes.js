const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const auth = require("../auth");

router.get("/get-cart", auth.verify, cartController.getCart);
router.post("/add-to-cart", auth.verify, cartController.addToCart);
router.patch("/update-cart-quantity", auth.verify, cartController.updateQuantity);

router.patch("/:productId/remove-from-cart", auth.verify, cartController.removeFromCart);
router.put("/clear-cart", auth.verify, cartController.clearCart);


module.exports = router;