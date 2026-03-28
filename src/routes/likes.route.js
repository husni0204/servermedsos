import express from "express";
import { AuthMiddleware } from "../middleware/auth.middleware.js";
import { CheckLikeUser, LikeFeedUser } from "../controller/like.controller.js";

const LikesRouter = express.Router();

LikesRouter.post("/:postId", AuthMiddleware, LikeFeedUser);
LikesRouter.get("/:postId", AuthMiddleware, CheckLikeUser);

export default LikesRouter;