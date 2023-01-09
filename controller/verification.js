const jwt = require("jsonwebtoken");
module.exports = function (req, res, next) {
  const t = req.headers["authorization"];
  const bearer = t.split(" ");
  const token = bearer[1];
  if (!token) {
    return res.status(400).json("token not found");
  }
  try {
    const res = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = res;
    next();
  } catch (err) {
    res.status(400).json("invalid token");
  }
};
