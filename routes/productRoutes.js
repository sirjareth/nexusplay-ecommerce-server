const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const auth = require("../auth");


function verifyAdmin(req, res, next) {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        return res.status(403).send({ auth: "Failed", message: "Action forbidden: Admin only" });
    }
}

router.post("/", auth.verify, verifyAdmin, productController.addProduct);
router.get("/all", auth.verify, verifyAdmin, productController.getAllProducts);
router.get("/active", productController.getAllActive);
router.get("/:productId", productController.getProduct);
router.patch("/:productId/update", auth.verify, verifyAdmin, productController.updateProduct);
router.patch("/:productId/archive", auth.verify, verifyAdmin, productController.archiveProduct);
router.patch("/:productId/activate", auth.verify, verifyAdmin, productController.activateProduct);


router.post("/search-by-name", productController.searchByName);
router.post("/search-by-price", productController.searchByPrice);

module.exports = router;