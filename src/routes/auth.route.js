import express from "express";
import { GetCurrentUser, LoginUser, RegisterUser } from "../controller/auth.controller.js";
import { AuthMiddleware } from "../middleware/auth.middleware.js";

const AuthRouter = express.Router();

AuthRouter.post("/register", RegisterUser);
AuthRouter.post("/login", LoginUser);
AuthRouter.get("/me", AuthMiddleware, GetCurrentUser)

export default AuthRouter;
