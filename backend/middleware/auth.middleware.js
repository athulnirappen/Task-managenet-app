import { verifyToken } from "../configuration/jwt.js";




export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ msg: "no token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = verifyToken(token);

    req.userId = decoded.userId;
    req.role = decoded.role;

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({ msg: "invalid or expired token" });
  }
};


export const requireAdmin = (req, res, next) => {
  if (req.role !== "ADMIN") {
    return res.status(403).json({ msg: "admin access required" });
  }
  next();
};