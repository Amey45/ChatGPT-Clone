const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.getUsers = async (req, res, next) => {
  await User.find()
    .exec()
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

exports.register = async (req, res, next) => {
  try {
    // if (!this.validateEmail(req.body.email)) {
    //   return res.status(400).json({ msg: "Invalid email" });
    // }'

    console.log(req.body);

    const users = await User.find({ email: req.body.email }).exec();

    console.log("users", users);

    if (users.length != 0) {
      return res.status(409).json({
        msg: "already user exist with this email!",
      });
    } else {
      if (!req.body.password) {
        return res.status(400).json({
          message: "Invalid Password",
        });
      }

      try {
        const hash = await bcrypt.hash(req.body.password, 10);

        const user = new User({
          name: req.body.name,
          email: req.body.email,
          password: hash,
        });

        try {
          const response = await user.save();
          return res.status(200).json({
            message: "registered successfully",
          });
        } catch (error) {
          return res.status(500).json({
            pathofmethod: "Error while registering users",
            error,
          });
        }
      } catch (error) {
        return res.status(500).json({
          error,
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      message: "Error while finding user",
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email }).exec();

    if (!user) {
      return res.status(404).json({
        message: "Authentication failed: User not found",
      });
    }

    const result = await bcrypt.compare(req.body.password, user.password);

    if (result) {
      let token = jwt.sign(
        {
          _id: user._id,
          email: user.email,
        },
        process.env.JWT_SECRET
      );

      return res.status(200).json({
        message: "Login successful",
        token: token,
      });
    }

    return res.status(401).json({
      message: "Invalid credentials",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      error: error,
      message: "Error while logging in",
    });
  }
};

exports.validateEmail = function (email) {
  var re = new RegExp("^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$");
  if (!re.test(email)) return false;
  return true;
};

exports.verifyUser = async (req, res, next) => {
  try {
    //user token check
    const user = await User.findById(req.id);
    return res
      .status(200)
      .json({ message: "OK", name: user.name, email: user.email });
  } catch (error) {
    console.log(error);
    return res.status(200).json({ message: "ERROR", cause: error.message });
  }
};
