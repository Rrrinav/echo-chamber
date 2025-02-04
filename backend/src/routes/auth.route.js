import express from 'express';
import bodyParser from 'body-parser';

import { login, logout, signup, updateProfile, checkAuth } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

var jsonParser = bodyParser.json({limit: '50mb', extended: true});

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.put("/update-profile", protectRoute, jsonParser, updateProfile);

router.get("/check", protectRoute, checkAuth)

export default router;
