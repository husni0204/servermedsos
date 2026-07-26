import response from "../utils/response.js";
import * as authService from "../service/auth.service.js";
import { registerSchema, loginSchema } from "../validation/auth.validation.js";


export const RegisterUser = async (req, res) => {
  try {
    const validated = registerSchema.parse(req.body);
    const { user, token } = await authService.register(validated);
    response.created(res, { data: user, message: "User berhasil didaftarkan", token });

  } catch (error) {
    if (error instanceof Error && "issues" in error) {
      return response.validationError(res, error);
    }
    response.handleError(res, error);
  }
};

export const LoginUser = async (req, res) => {
 try {
   const validated = loginSchema.parse(req.body);
   const { user, token } = await authService.login(validated);
   response.success(res, { data: user, message: "Login berhasil", token });

 } catch (error) {
    if (error instanceof Error && "issues" in error) {
      return response.validationError(res, error);
    }
    response.handleError(res, error);
 }
};

export const GetCurrentUser = async (req, res) => {
  response.success(res, {
    data: req.user,
    message: "Berhasil mendapatkan data user"
  });
}
