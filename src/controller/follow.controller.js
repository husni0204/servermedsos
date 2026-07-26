import response from "../utils/response.js";
import * as followService from "../service/follow.service.js";

export const FollowUserAccount = async (req, res) => {
    try {
        const follow = await followService.followUser(req.user.id, req.body.followUserId);
        response.created(res, { data: follow, message: "Followed user successfully" });

    } catch (error) {
        response.handleError(res, error);
    }
}

export const UnfollowUserAccount = async (req, res) => {
    try {
        await followService.unfollowUser(req.user.id, req.params.unfollowUserId);
        response.ok(res, "Unfollow user successfully");

    } catch (error) {
        response.handleError(res, error);
    }
}

export const getLimitUser = async (req, res) => {
    try {
        const users = await followService.getSuggestedUsers(req.user.id);
        response.success(res, { data: users, message: "5 user terbaru yang belum di follow" });

    } catch (error) {
        response.handleError(res, error);
    }
}

export const isFollowUser = async (req, res) => {
    try {
        const status = await followService.isFollowing(req.user.id, req.params.followUserId);
        response.success(res, { data: status, message: "Status follow berhasil didapatkan" });

    } catch (error) {
        response.handleError(res, error);
    }
}