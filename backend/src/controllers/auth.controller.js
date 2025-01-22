import bcrypt from "bcryptjs"

import User from "../models/user.model.js"
import { generateToken } from "../lib/utils.js"

export const signup = async (req, res) => {
  const {fullName, email, password} = req.body;

  try {

    if (!fullName || !email || !password) {
      return res.status(400).json({message: "All fields are required. You monkey!"});
    }

    if (password.length < 6) {
      return res.status(400).json({message: "Password must be at least 6 characters long"});
    }

    const userExists = await User.findOne({email});
    if (userExists) {
      return res.status(400).json({message: "User with this email already exists"});
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName: fullName,
      email: email,
      password: hashedPassword,
    });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();
      res.status(201).json({message: "User created successfully"});
    } else {
      res.status(400).json({message: "Failed to create user. Invalid data"});
    }

  } catch(err) {
    console.error("Error in signup controller: ", err.message);
    res.status(500).json({message: "Internal server error!"});
  }
}


export const login = async (req, res) => {

}


export const logout = async (req, res) => {

}
