import express from 'express';
import { FollowUserAccount, getLimitUser, isFollowUser, UnfollowUserAccount } from '../controller/follow.controller.js';
import { AuthMiddleware } from '../middleware/auth.middleware.js';

const FollowRouter = express.Router();

FollowRouter.post("/", AuthMiddleware, FollowUserAccount);
FollowRouter.delete("/:unfollowUserId", AuthMiddleware, UnfollowUserAccount);
FollowRouter.get("/user", AuthMiddleware, getLimitUser);
FollowRouter.get("/:followUserId", AuthMiddleware, isFollowUser);

export default FollowRouter;