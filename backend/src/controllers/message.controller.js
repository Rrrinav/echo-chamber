import express from "express";
import User from "../models/user.model";
import Message from "../models/message.model"; M

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
    const { id: userToChatID } = req.params.id;
    const senderID = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: senderID, recieverId: userToChatID },
        { senderId: userToChatID, recieverId: senderID },
      ],
    });

    res.status(200).json(messages);


  } catch (err) {
    console.error("Error in getMessages controller: ", err.message);
    res.status(500).json({ message: "Internal server Error" });
  }
};

export const sendMessage = async (req, res) => {

};
