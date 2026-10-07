const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../auth");


// Routes
router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/details", auth.verify, userController.getUserProfile);
router.patch("/update-password", auth.verify, userController.updatePassword);
router.patch("/:id/set-as-admin", auth.verify, userController.setAsAdmin);
router.get("/:id", auth.verify, userController.getUserProfile);

module.exports = router;