const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    console.log(req.headers);
    let token = req.headers.authorization;

    console.log(token);

    if (token) {
      let user = jwt.verify(token, process.env.JWT_SECRET);
      console.log(user);
      req.userId = user._id;
      req.name = user.name;
      next();
    } else {
      res.status(401).json({
        message: "Unauthorized User",
        error: "ERrpr",
      });
    }
  } catch (error) {
    res.status(401).json({
      message: "Unauthorized User",
      error: error,
    });
  }
};

module.exports = auth;
