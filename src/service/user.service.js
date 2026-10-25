import prisma from "../prismadb/prisma.js";
import cloudinary from "../utils/cloudinary.js";
import AppError from "../utils/AppError.js";

export const getUserByUsername = async (username) => {
  const user = await prisma.user.findUnique({
    where: { username },
    omit: { password: true, imageId: true },
    include: {
      posts: {
        omit: { userId: true, imageId: true }
      },
      bookmarks: {
        include: {
          post: {
            omit: { userId: true, imageId: true },
          }
        }
      }
    }
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};

export const searchUsers = async (searchTerm) => {
  const trimmed = (searchTerm || "").trim();

  if (!trimmed) {
    throw new AppError("Username query is required", 400);
  }

  if (trimmed.length < 2) {
    throw new AppError("Minimal 2 karakter untuk pencarian", 400);
  }

  const users = await prisma.$queryRaw`
    SELECT id, username, fullname, image
    FROM "User"
    WHERE username ILIKE ${'%' + trimmed + '%'}
    ORDER BY similarity(username, ${trimmed}) DESC
    LIMIT 20
  `;

  return users;
};

export const updateUser = async (userId, { fullname, username, bio }) => {
  const existingUser = await prisma.user.findUnique({
    where: { username }
  });

  if (existingUser && existingUser.id !== userId) {
    throw new AppError("Username sudah digunakan", 400);
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { bio, fullname, username },
    omit: { password: true }
  });

  return updatedUser;
};

export const updateAvatar = async (userId, file) => {
  if (!file) {
    throw new AppError("File gambar wajib diupload", 400);
  }

  const currentUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { imageId: true }
  });

  if (currentUser.imageId) {
    await cloudinary.uploader.destroy(currentUser.imageId);
  }

  const fileStr = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

  const result = await cloudinary.uploader.upload(fileStr, {
    folder: "avatar",
    transformation: [{ width: 300, height: 300 }]
  });

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      image: result.secure_url,
      imageId: result.public_id
    },
    omit: { password: true }
  });

  return updatedUser;
};
