const Product = require("../models/Product");

module.exports.addProduct = (req, res) => {
    let newProduct = new Product({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price
    });

    newProduct.save()
    .then(product => res.status(201).send(product))
    .catch(err => res.status(500).send({ error: "Failed to create product" }));
};


module.exports.getAllProducts = (req, res) => {
    Product.find({})
        .then(products => res.status(200).send(products))
        .catch(err => res.status(500).send({ error: "Failed to fetch products" }));
};


module.exports.getAllActive = (req, res) => {
    Product.find({ isActive: true })
        .then(products => res.status(200).send(products))
        .catch(err => res.status(500).send({ error: "Failed to fetch active products" }));
};


module.exports.getProduct = (req, res) => {
    Product.findById(req.params.productId)
    .then(product => {
        if (!product) return res.status(404).send({ error: "Product not found" });
        return res.status(200).send(product);
    })
    .catch(err => res.status(500).send({ error: "Product not found" }));
};


module.exports.updateProduct = (req, res) => {
    Product.findByIdAndUpdate(req.params.productId, req.body, { new: true })
        .then(updatedProduct => {
            if (!updatedProduct) {
                return res.status(404).send({ error: "Product not found" });
            }
            
            return res.status(200).send({
                success: true,
                message: "Product updated successfully"
            });
        })
        .catch(err => res.status(500).send({ error: "Update failed!" }));
};


module.exports.archiveProduct = (req, res) => {
    Product.findById(req.params.productId)
        .then(product => {
            if (!product) {
                return res.status(404).send({ error: "Product not found" });
            }

            if (product.isActive === false) {
                return res.status(200).send({
                    message: "Product already archived",
                    archivedProduct: product
                });
            }

            Product.findByIdAndUpdate(req.params.productId, { isActive: false }, { new: true })
                .then(archivedProduct => {
                    return res.status(200).send({
                        success: true,
                        message: "Product archived successfully"
                    });
                })
                .catch(err => res.status(500).send({ error: "Archive failed" }));
        })
        .catch(err => res.status(500).send({ error: "Server error" }));
};


module.exports.activateProduct = (req, res) => {
    Product.findById(req.params.productId)
        .then(product => {
            if (!product) {
                return res.status(404).send({ error: "Product not found" });
            }

            if (product.isActive === true) {
                return res.status(200).send({
                    message: "Product already activated",
                    activatedProduct: product
                });
            }

            Product.findByIdAndUpdate(req.params.productId, { isActive: true }, { new: true })
                .then(activatedProduct => {
                    return res.status(200).send({
                        success: true,
                        message: "Product activated successfully"
                    });
                })
                .catch(err => res.status(500).send({ error: "Activation failed" }));
        })
        .catch(err => res.status(500).send({ error: "Server error" }));
};



module.exports.searchByName = (req, res) => {
    Product.find({ name: { $regex: req.body.name, $options: 'i' } })
        .then(products => res.status(200).send(products))
        .catch(err => res.status(500).send({ error: "Server error", details: err }));
};

module.exports.searchByPrice = (req, res) => {
    Product.find({ price: { $gte: req.body.minPrice, $lte: req.body.maxPrice } })
        .then(products => res.status(200).send(products))
        .catch(err => res.status(500).send({ error: "Server error", details: err }));
};