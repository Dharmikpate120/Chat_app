const jwt = require("jsonwebtoken");
const jwtKey = "Dh4rm1kP473lv";

function fetchUser(req, res=1, next) {
  try {
    const result = jwt.verify(req.headers.auth_token, jwtKey);
    if (res === 1) {
      return result.phone;
    } else {
      req.body = { ...req.body, phone: result.phone };
      next();
    }
  } catch (err) {
    res.json({ threat: "Please Signin Using Verified Methods!" });
    return;
  }
}

module.exports = { fetchUser };
