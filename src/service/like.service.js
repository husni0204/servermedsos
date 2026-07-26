import prisma from "../prismadb/prisma.js";
import AppError from "../utils/AppError.js";

export const toggleLike = async (userId, postId) => {
  const postData = await prisma.post.findUnique({
    where: { id: Number(postId) },
    select: { id: true }
  });

  if (!postData) {
    throw new AppError("Feeds tidak ditemukan", 404);
  }

  const checkLike = await prisma.likes.findUnique({
    where: {
      userId_postId: {
        userId,
        postId: Number(postId)
      }
    }
  });

  if (checkLike) {
    await prisma.$transaction([
      prisma.likes.delete({
        where: {
          userId_postId: {
            userId,
            postId: Number(postId)
          }
        }
      }),
      prisma.post.update({
        where: { id: Number(postId) },
        data: { likeCount: { decrement: 1 } }
      })
    ]);

    return { liked: false };
  }

  const [newLike] = await prisma.$transaction([
    prisma.likes.create({
      data: { userId, postId: Number(postId) }
    }),
    prisma.post.update({
      where: { id: Number(postId) },
      data: { likeCount: { increment: 1 } }
    })
  ]);

  return { liked: true, data: newLike };
};

export const checkLike = async (userId, postId) => {
  const postData = await prisma.post.findUnique({
    where: { id: Number(postId) },
    select: { id: true }
  });

  if (!postData) {
    throw new AppError("Feeds tidak ditemukan", 404);
  }

  const checkLike = await prisma.likes.findUnique({
    where: {
      userId_postId: {
        userId,
        postId: Number(postId)
      }
    }
  });

  return !!checkLike;
};
