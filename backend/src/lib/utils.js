import jwt from "jsonwebtoken";

export const generateToken = async (userID, res) => {
  const token = jwt.sign({id: userID}, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.cookie("jwt", token, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development"
  });

  return token;
};
