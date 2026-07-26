import response from "../utils/response.js"
import * as likeService from "../service/like.service.js"

export const LikeFeedUser = async (req, res) => {
    try {
        const { liked, data } = await likeService.toggleLike(req.user.id, req.params.postId);

        if (!liked) {
            return response.ok(res, "Berhasil menghapus like");
        }

        response.created(res, { data, message: "Berhasil menambahkan like" });

    } catch (error) {
        response.handleError(res, error);
    }
}

export const CheckLikeUser = async (req, res) => {
    try {
        const status = await likeService.checkLike(req.user.id, req.params.postId);
        response.success(res, { data: status, message: "Status like berhasil didapatkan" });

    } catch (error) {
        response.handleError(res, error);
    }
}