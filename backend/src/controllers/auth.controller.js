import bcrypt from "bcryptjs"

import User from "../models/user.model.js"
import { generateToken } from "../lib/utils.js"
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

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
  const { email, password } = req.body;

  try {
    const user = await User.findOne({email});
    if (!user)
    {
      return res.status(400).json({message: "Invalid credentials"});
    }

    console.log("User: ", user);

    const isPassCorrect = await bcrypt.compare(password, user.password);
    if (!isPassCorrect) {
      return res.status(400).json({message: "Invalid credentials"});
    }

    generateToken(user._id, res);
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
      message: "Logged in successfully"
    });

  } catch (err) {
    console.error("Error in login controller: ", err.message);
    res.status(500).json({message: "Internal server error!"});
  }
}


export const logout = async (req, res) => {

  try {
    res.clearCookie("jwt", "", {maxAge: 0});
    res.status(200).json({message: "Logged out successfully"});
  } catch (err) {
    console.error("Error in logout controller: ", err.message);
    res.status(500).json({message: "Internal server error!"});
  }
}


export const updateProfile = async (req, res) => {

  try {
    const {profilePic} = req.body;
    const userId = req.user._id

    if (!profilePic) {
      return res.status(400).json({message: "Provide the profile pic bro/sis and others?"});
    }

    const uploadRes = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(userId, {profilePic: uploadRes.secure_url}, {new: true});
    res.status(200).json({
      _id: updatedUser._id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      profilePic: updatedUser.profilePic,
      message: "Profile updated successfully"
    });

  } catch (err) {
    console.error("Error in updateProfile controller: ", err.message);
    res.status(500).json({message: "Internal server error!"});
  }

};


export const checkAuth = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (err) {
    console.error("Error in checkAuth controller: ", err.message);
    res.status(500).json({message: "Internal server error!"});
  }
};
