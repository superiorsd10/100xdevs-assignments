const jwt = require("jsonwebtoken");
const jwtPassword = "sachin";

function userMiddleware(req, res, next) {
  // Implement user auth logic
  // You need to check the headers and validate the user from the user DB. Check readme for the exact headers to be expected

  const token = req.headers.authentication;

  if (!token) {
    return res.status(403).send("Please provide the authentication token");
  }

  try {
    const validate = jwt.verify(token, jwtPassword);
    next();
  } catch (err) {
    return res.status(403).send("Invalid token");
  }
}

module.exports = userMiddleware;
