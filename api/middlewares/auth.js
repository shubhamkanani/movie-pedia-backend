import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ message: "Token not Provided...!" });
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, SECRET_KEY, (err, decodedToken) => {
    if (err) {
      return res.status(403).json({ message: "Invalid Token." });
    }
    req.user = decodedToken;
    next();
  });
}

function checkUserRole(requiredRole) {
  return (req, res, next) => {
    const userRole = req.user.role;

    if (userRole !== requiredRole) {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  };
}

export { authenticateToken, checkUserRole };
