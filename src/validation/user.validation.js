import * as z from "zod";

export const updateUserSchema = z.object({
  fullname: z.string().min(6, "Fullname minimal 6 karakter"),
  username: z.string().min(6, "Username minimal 6 karakter"),
  bio: z.string().min(10, "Bio minimal 10 karakter"),
});
