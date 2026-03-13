import express from "express";
import { getSearchUser, getUserByUsername, updateAvatar, updateUser } from "../controller/user.controller.js";
import { AuthMiddleware } from "../middleware/auth.middleware.js";
import uploadPhotoProfile from "../middleware/upload.middleware.js";

const UserRouter = express.Router();

UserRouter.get("/search", getSearchUser);
UserRouter.get("/:username", getUserByUsername);
UserRouter.put("/update-user", AuthMiddleware, updateUser);
UserRouter.put("/update-photo-profile", AuthMiddleware, uploadPhotoProfile.single("image"), updateAvatar)

export default UserRouter;