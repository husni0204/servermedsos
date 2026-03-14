import express from 'express';
import { FollowUserAccount, UnfollowUserAccount } from '../controller/follow.controller.js';
import { AuthMiddleware } from '../middleware/auth.middleware.js';

const FollowRouter = express.Router();

FollowRouter.post("/", AuthMiddleware, FollowUserAccount);
FollowRouter.delete("/:unfollowUserId", AuthMiddleware, UnfollowUserAccount)

export default FollowRouter;