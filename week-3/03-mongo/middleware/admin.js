const { Admin } = require("../db/index.js");

// Middleware for handling auth
async function adminMiddleware(req, res, next) {
  // Implement admin auth logic
  // You need to check the headers and validate the admin from the admin DB. Check readme for the exact headers to be expected
  const username = req.headers.username;
  const password = req.headers.password;

  if (!(username && password)) {
    return res.status(403).send("Please provide username and password");
  }

  const existingAdmin = await Admin.findOne({
    username,
    password,
  });

  if (!existingAdmin) {
    return res.status(403).send("Incorrect credentials!");
  }

  next();
}

module.exports = adminMiddleware;
