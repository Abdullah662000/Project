const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verification = require("./verification");
exports.userSignup = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashpass = await bcrypt.hash(req.body.password, salt);
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashpass,
    });
    const find = await User.findOne({ email: req.body.email });
    if (find) {
      return res.status(400).send("user already exists");
    }
    const s = await user.save();
    res.status(200).send(s);
  } catch (err) {
    res.status(400).send(err);
  }
};
exports.userSignin = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const pass = await bcrypt.compare(req.body.password, user.password);
      if (pass) {
        const token = await jwt.sign(
          { _id: user._id },
          process.env.TOKEN_SECRET
        );
        res.header(token, "auth-token");
        res.send(token);
      } else {
        res.status(400).send("email or pass incorrect");
      }
    } else {
      res.status(400).send("email or pass incorrect");
    }
  } catch (err) {
    res.status(400).send(err);
  }
};
