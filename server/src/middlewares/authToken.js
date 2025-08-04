const jwt = require("jsonwebtoken");
const { JWT_ACCESS_SECRET_KEY } = require("../config/config");

module.exports = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token)
    return res.json({ message: "no token provided!", statusCode: 401 });

  jwt.verify(token, JWT_ACCESS_SECRET_KEY, (err, decoded) => {
    if (err)
      return res.json({
        message: "invalid or expired token!",
        statusCode: 403, //forbidden
      });
    req.user = decoded; //id, email, fullName, role
    next();
  });
};