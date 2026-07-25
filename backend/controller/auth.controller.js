import { signToken } from "../configuration/jwt.js";
import prisma from "../configuration/prisma.js";
import bcrypt from "bcrypt";

const SALT = process.env.SALT_ROUNDS || 10;

export const Register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;


    if (!name || !email || !password || !role) {
      return res.status(400).json({
        msg: "email, name, password, and role are required",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return res
        .status(409)
        .json({ msg: " user with this email already exists" });
    }
    

    const hashPassword = await bcrypt.hash(password, Number(SALT));

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashPassword,
        role,
      },
    });

    const { password: _omit, ...safeUser } = user;

    return res.status(200).json({
      msg: "register successfully",
      data: safeUser,
    });
  } catch (error) {
    console.error("Register error:", error);
    return res
      .status(500)
      .json({ msg: "Something went wrong during registration" });
  }
};

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        msg: "email and password required",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(401).json({
        msg: "user is not found with this credentails",
      });
    }

    const matchPassword = await bcrypt.compare(password, user.password);

    if (!matchPassword) {
      return res.status(401).json({
        msg: "password is not matching",
      });
    }

    const token = signToken(user);

    const { password: _omit, ...safeUser } = user;

    return res.status(200).json({
        msg:"login success fully",
        data:safeUser,
        token
    })
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ msg: "Something went wrong during login" });
  }
};
