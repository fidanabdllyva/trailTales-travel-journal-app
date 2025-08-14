const jwt = require("jsonwebtoken");
const { JWT_ACCESS_SECRET_KEY } = require("../config/config");

module.exports = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ message: "no token provided!", statusCode: 401 });
  }

  jwt.verify(token, JWT_ACCESS_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        message: "invalid or expired token!",
        statusCode: 403,
      });
    }
    req.user = decoded; 
    next();
  });
};
