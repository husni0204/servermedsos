import express from 'express';
import { AuthMiddleware } from '../middleware/auth.middleware.js';
import { CheckSavedFeed, ToggleSavedPost } from '../controller/bookmark.controller.js';

const BookmarkRouter = express.Router();

BookmarkRouter.post("/:postId", AuthMiddleware, ToggleSavedPost);
BookmarkRouter.get("/:postId", AuthMiddleware, CheckSavedFeed);

export default BookmarkRouter;