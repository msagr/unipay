import express from "express";
import getUserProfile from "../controllers/user/getUserProfile.js";
import checkAuth from "../middleware/checkAuthMiddleware.js";
import updateUserProfile from "../controllers/user/updateUserProfile.js";

const router = express.Router();

router.route("/profile").get(checkAuth, getUserProfile);
router.patch("/profile", checkAuth, updateUserProfile);

export default router;