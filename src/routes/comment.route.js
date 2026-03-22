import express from "express";
import { AuthMiddleware } from "../middleware/auth.middleware.js";
import { CreateComment, DeleteCommentById } from "../controller/comment.controller.js";

const CommentRouter = express.Router();

CommentRouter.post("/", AuthMiddleware, CreateComment);
CommentRouter.delete("/:id", AuthMiddleware, DeleteCommentById);

export default CommentRouter;