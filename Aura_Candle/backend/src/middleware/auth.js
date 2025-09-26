const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.SECRET_KEY || "your_jwt_secret";

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(403).json({ error: "No token provided. Access denied!" });
  }

  if (!token.startsWith("Bearer ")) {
    return res
      .status(403)
      .json({ error: "Invalid token format. Use Bearer token." });
  }

  jwt.verify(token.split(" ")[1], JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized. Invalid token!" });
    }
    req.user = decoded;
    next();
  });
};

function authorize(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Access denied." });
    }
    next();
  };
}


module.exports = { verifyToken, authorize };
