import response from "../utils/response.js";
import * as commentService from "../service/comment.service.js";

export const CreateComment = async (req, res) => {
    try {
        const newComment = await commentService.createComment(req.user.id, req.body.postId, req.body.content);
        response.created(res, { data: newComment, message: "Berhasil membuat komentar" });

    } catch (error) {
        response.handleError(res, error);
    }
}

export const DeleteCommentById = async (req, res) => {
    try {
        await commentService.deleteComment(req.params.id, req.user.id);
        response.ok(res, "Berhasil menghapus komentar");

    } catch (error) {
        response.handleError(res, error);
    }
}