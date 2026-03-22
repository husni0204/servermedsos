import express from "express";
import { AuthMiddleware } from "../middleware/auth.middleware.js";
import { LikeFeedUser } from "../controller/like.controller.js";

const LikesRouter = express.Router();

LikesRouter.post("/:postId", AuthMiddleware, LikeFeedUser)

export default LikesRouter;