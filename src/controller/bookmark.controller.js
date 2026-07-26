import response from "../utils/response.js";
import * as bookmarkService from "../service/bookmark.service.js";

export const ToggleSavedPost = async (req, res) => {
    try {
        const { bookmarked, data } = await bookmarkService.toggleBookmark(req.user.id, req.params.postId);

        if (!bookmarked) {
            return response.ok(res, "Post/Feed berhasil dihapus dari bookmark!");
        }

        response.success(res, { data, message: "Post/Feed berhasil disimpan ke bookmark!" });

    } catch (error) {
        response.handleError(res, error);
    }
}

export const CheckSavedFeed = async (req, res) => {
    try {
        const status = await bookmarkService.checkBookmark(req.user.id, req.params.postId);
        response.success(res, { data: status, message: "Status bookmark berhasil didapatkan" });

    } catch (error) {
        response.handleError(res, error);
    }
}