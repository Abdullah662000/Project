const jwt = require("jsonwebtoken");
module.exports = function (req, res, next) {
  const t = req.header["authorization"];
  const bearer = t.splice(" ");
  const token = bearer[1];
  console.log(token);
  if (!token) {
    return res.status(400).send("token not found");
  }
  try {
    const res = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = res;
    next();
  } catch (err) {
    res.status(400).send("invalid token");
  }
};
