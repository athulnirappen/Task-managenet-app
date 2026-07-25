import jwt from 'jsonwebtoken';
import 'dotenv/config'
 
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
 
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not set in environment variables');
}

export const signToken = (user) => {
  return jwt.sign(
    { userId: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};


export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};