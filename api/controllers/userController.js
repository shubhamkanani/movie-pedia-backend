import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { USER_ROLES } from "../constants/enums.js";
import User from "../models/user.js";

import dotenv from "dotenv";
dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

export default {
  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email: email });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Create a token with user information and role
      const tokenPayload = {
        userId: user._id,
        name: user.username,
        role: user.role,
      };

      const token = jwt.sign(tokenPayload, SECRET_KEY);

      res.status(200).json({ message: "Login successful", token: token });
    } catch (error) {
      res.status(500).json({ message: "An error occurred" });
    }
  },
  register: async (req, res) => {
    const { username, email, password, role } = req.body;

    if (!Object.values(USER_ROLES).includes(role)) {
      return res.status(400).json({ message: "Invalid User type" });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        role,
      });

      await newUser.save();

      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      res.status(500).json({ message: "An error occurred" });
    }
  },
};
