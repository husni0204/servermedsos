import response from "../utils/response.js";
import * as feedService from "../service/feed.service.js";

export const CreateFeed = async (req, res) => {
    try {
        const newFeed = await feedService.createFeed(req.user.id, req.body.caption, req.file);
        response.created(res, { data: newFeed, message: "Berhasil membuat postingan" });

    } catch (error) {
        response.handleError(res, error);
    }
}

export const ReadAllFeeds = async (req, res) => {
    try {
        const { posts, page, limit, totalPages, totalFeed } = await feedService.getFeeds(req.user.id, req.query);
        response.success(res, { data: posts, message: "Berhasil mendapatkan semua postingan", page, limit, totalPages, totalFeed });

    } catch (error) {
        response.handleError(res, error);
    }
}

export const DetailFeed = async (req, res) => {
    try {
        const { post, commentPage, commentLimit } = await feedService.getFeedDetail(req.params.id, req.query);
        response.success(res, { data: post, message: "Berhasil mendapatkan detail postingan", commentPage, commentLimit });

    } catch (error) {
        response.handleError(res, error);
    }
}

export const DeleteFeed = async (req, res) => {
    try {
        await feedService.deleteFeed(req.params.id, req.user.id);
        response.ok(res, "Berhasil menghapus Feeds");

    } catch (error) {
        response.handleError(res, error);
    }
}