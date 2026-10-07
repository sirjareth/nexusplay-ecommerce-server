const User = require("../models/User");
const bcrypt = require("bcryptjs");
const auth = require("../auth");



module.exports.register = (req, res) => {

  if (!req.body.email.includes(`@`)) {
    return res.status(400).send({ message: 'Invalid email format'});
  }

  if (!req.body.mobileNo.length !== 11) {
    return res.status(400).send({ message: `Mobile number must be 11 digits`});
  }

  if (req.body.password < 8) {
    return res.status(400).send({ message: `Pssword must be at least 8 characters`});
  }

  User.findOne({ email: req.body.email })
  .then((result) => {
    if (result !== null) {
      return res.send("Duplicate email found");
    } else {
       
      let newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        mobileNo: req.body.mobileNo
      });

      newUser.save()
      .then((savedUser) => {
        return res.json({
          message: `User ${savedUser.firstName} is created`,
          user: savedUser
        });
      })
      .catch((saveErr) => {
        next(saveErr);
      });
      
    }
  })
  .catch((err) => {
    next(err);
  });
};

module.exports.login = (req, res, next) => {

  if (!req.body.email.includes("@")) {
    return res.status(400).send({ message: "Invalid email format" });
  }

  User.findOne({ email: req.body.email })
  .then((result) => {

    if (result === null) {
      return res.status(404).send({ message: "No email found" });
    }

    const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);

    if (isPasswordCorrect) {
      return res.json({ access: auth.createAccessToken(result) });
    } else {
      return res.status(401).send({ message: "Incorrect email or password" });
    }
     
  })
  .catch((err) => {
    next(err);
  });
};

module.exports.getUserProfile = (req, res) => {
  User.findById(req.user.id) // ← galing sa decoded token, hindi sa params
  .then((user) => {
    if (user !== null) {
      return res.status(200).send(user);
    } else {
      return res.status(404).send({ message: "User not found" });
    }
  })
  .catch((err) => {
    next(err);
  });
};