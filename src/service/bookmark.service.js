import prisma from "../prismadb/prisma.js";
import AppError from "../utils/AppError.js";

export const toggleBookmark = async (userId, postId) => {
  const postData = await prisma.post.findUnique({
    where: { id: Number(postId) },
    select: { id: true }
  });

  if (!postData) {
    throw new AppError("Post/Feed tidak ditemukan !", 404);
  }

  const checkUserBookmark = await prisma.bookmark.findUnique({
    where: {
      userId_postId: {
        userId,
        postId: Number(postId)
      }
    }
  });

  if (checkUserBookmark) {
    await prisma.bookmark.delete({
      where: {
        userId_postId: {
          userId,
          postId: Number(postId)
        }
      }
    });

    return { bookmarked: false };
  }

  const newBookmark = await prisma.bookmark.create({
    data: { userId, postId: Number(postId) }
  });

  return { bookmarked: true, data: newBookmark };
};

export const checkBookmark = async (userId, postId) => {
  const checkSaved = await prisma.bookmark.findUnique({
    where: {
      userId_postId: {
        userId,
        postId: Number(postId)
      }
    }
  });

  return !!checkSaved;
};
