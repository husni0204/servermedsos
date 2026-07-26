import response from "../utils/response.js";
import * as userService from "../service/user.service.js";
import { updateUserSchema } from "../validation/user.validation.js";


export const getUserByUsername = async (req, res) => {
    try {
        const user = await userService.getUserByUsername(req.params.username);
        response.success(res, { data: user, message: "Berhasil mendapatkan data user" });

    } catch (error) {
        response.handleError(res, error);
    }
}

export const getSearchUser = async (req, res) => {
    try {
        const users = await userService.searchUsers(req.query.username);
        response.success(res, { data: users, message: "Berhasil mendapatkan data user" });

    } catch (error) {
        response.handleError(res, error);
    }
}

export const updateUser = async (req, res) => {
    try {
        const validated = updateUserSchema.parse(req.body);
        const updatedUser = await userService.updateUser(req.user.id, validated);
        response.created(res, { data: updatedUser, message: "Berhasil update user" });

    } catch (error) {
        if (error instanceof Error && "issues" in error) {
            return response.validationError(res, error);
        }
        response.handleError(res, error);
    }
}

export const updateAvatar = async (req, res) => {
    try {
        const updatedUser = await userService.updateAvatar(req.user.id, req.file);
        response.created(res, { data: updatedUser, message: "Berhasil update foto profile" });

    } catch (error) {
        response.handleError(res, error);
    }
}