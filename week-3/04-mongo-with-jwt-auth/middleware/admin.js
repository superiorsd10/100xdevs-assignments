const jwt = require("jsonwebtoken");
const jwtPassword = "sachin";

// Middleware for handling auth
function adminMiddleware(req, res, next) {
  // Implement admin auth logic
  // You need to check the headers and validate the admin from the admin DB. Check readme for the exact headers to be expected

  const token = req.headers.authorization;

  console.log(token);

  if (!token) {
    return res.status(403).send("Please provide the authorization token!");
  }

  try {
    const validate = jwt.verify(token, jwtPassword);
    next();
  } catch (err) {
    return res.status(403).send("Invalid token!");
  }
}

module.exports = adminMiddleware;
