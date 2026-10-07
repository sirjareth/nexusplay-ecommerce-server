const User = require("../models/User");
const bcrypt = require("bcryptjs");
const auth = require("../auth");

module.exports.register = (req, res) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(req.body.email)) return res.status(400).send({ error: "Invalid Email" });
    if (req.body.mobileNo.length !== 11) return res.status(400).send({ error: "Invalid mobile number" });
    if (req.body.password.length < 8) return res.status(400).send({ error: "Password must be at least 8 characters" });

    User.findOne({ email: req.body.email })
    .then((result) => {
        if (result !== null) return res.status(409).send({ error: "Duplicate email found" });
        
        let newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 10),
            mobileNo: req.body.mobileNo
        });

        newUser.save()
          .then((savedUser) => res.status(201).send({ 
            message: "User registered successfully",
            user: savedUser 
        }))

        .catch((saveErr) => res.status(500).send({ error: "Error saving user" }));
    })
    .catch((err) => res.status(500).send({ error: "Server error" }));
};

module.exports.login = (req, res) => {

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(req.body.email)) {
    return res.status(400).send({ error: "Invalid email format" });
  }

  User.findOne({ email: req.body.email })
  .then((result) => {
    if (!result) {
      return res.status(404).send({ error: "No email found" });
    }

    const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);
    
    if (!isPasswordCorrect) {
      return res.status(401).send({ error: "Email and password do not match" });
    }
    
    return res.status(200).send({ access: auth.createAccessToken(result) });
  })
  .catch((err) => res.status(500).send({ error: "Server Error" }));

};


module.exports.getUserProfile = (req, res) => {
    const userId = req.params.id || req.user.id;
    User.findById(userId)
    .then((user) => {
        if (!user) return res.status(404).send({ error: "User not found" });
        user.password = undefined; 
        return res.status(200).send({ user: user });
    })
    .catch((err) => res.status(500).send({ error: "Server error" }));
};


module.exports.setAsAdmin = (req, res) => {
    User.findByIdAndUpdate(req.params.id, { isAdmin: true }, { new: true })
    .then((user) => {
        if (!user) return res.status(404).send({ error: "User not found" });
        user.password = undefined;
        return res.status(200).send({ message: "User updated to admin successfully", updatedUser: user });
    })
    .catch((err) => res.status(500).send({ error: "Server error" }));
};


module.exports.updatePassword = (req, res) => {
    let hashedPassword = bcrypt.hashSync(req.body.newPassword, 10);
    User.findByIdAndUpdate(req.user.id, { password: hashedPassword }, { new: true })
    .then(user => {
        if (!user) return res.status(404).send({ error: "User not found" });
        return res.status(200).send({ message: "Password reset successfully" });
    })
    .catch(err => res.status(500).send({ error: "Server error" }));
};