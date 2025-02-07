import express from "express";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import {ObjectId} from "mongodb";

import { io, getSocketId } from "../lib/socket.js";

export const getUsersForUser = async (req, res) => {
  try {
    const currentUserID = req.user._id;
    const users = await User.find({ _id: { $ne: currentUserID } }).select("-password");

    res.status(200).json(users);
  } catch (err) {
    console.error("Error in getUsersForUser controller: ", err.message);
    res.status(500).json({ message: "Internal server Error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const userToChatID  = req.params.id;
    const senderID = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: senderID, receiverId: userToChatID },
        { senderId: userToChatID, receiverId: senderID }
      ],
    });


    res.status(200).json(messages);


  } catch (err) {
    console.error("Error in getMessages controller: ", err.message);
    res.status(500).json({ message: "Internal server Error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;
    const { text, image } = message;

    let imageUrl;
    if (image) {
      // Upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();
    
    const receiverSocketId = getSocketId(receiverId);

    if (receiverSocketId) { io.to(receiverSocketId).emit("newMessage", newMessage); } 

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
