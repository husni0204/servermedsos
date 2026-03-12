import express from "express";
import { getSearchUser, getUserByUsername } from "../controller/user.controller.js";

const UserRouter = express.Router();

UserRouter.get("/search", getSearchUser);
UserRouter.get("/:username", getUserByUsername)

export default UserRouter;