const jwt = require("jsonwebtoken");
const ApiError = require("../utils/apiError");

function auth(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) throw new ApiError(401, "No token provided");

    const token = authHeader.split(" ")[1];
    if (!token) throw new ApiError(401, "Invalid token format");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = auth;
