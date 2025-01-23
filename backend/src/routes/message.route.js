import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js"
import { getUsersForUser, getMessages } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersForUser);
router.get("/:id", protectRoute, getMessages);
router.send("/send/:id", protectRoute, sendMessage);


export default router;
