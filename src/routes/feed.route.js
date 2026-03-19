import express from "express";
import { AuthMiddleware } from "../middleware/auth.middleware.js";
import uploadPhotoProfile from "../middleware/upload.middleware.js";
import { CreateFeed, DeleteFeed, DetailFeed, ReadAllFeeds } from "../controller/feed.controller.js";

const FeedRouter = express.Router();

FeedRouter.post("/", AuthMiddleware, uploadPhotoProfile.single("image"), CreateFeed)
FeedRouter.get("/", AuthMiddleware, ReadAllFeeds);
FeedRouter.get("/:id", AuthMiddleware, DetailFeed);
FeedRouter.delete("/:id", AuthMiddleware, DeleteFeed);

export default FeedRouter;