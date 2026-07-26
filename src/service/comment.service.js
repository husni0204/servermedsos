import prisma from "../prismadb/prisma.js";
import AppError from "../utils/AppError.js";

export const createComment = async (userId, postId, content) => {
  if (!postId || !content) {
    throw new AppError("PostId dan content wajib diisi", 400);
  }

  const postData = await prisma.post.findUnique({
    where: { id: Number(postId) },
    select: { id: true }
  });

  if (!postData) {
    throw new AppError("Post tidak ditemukan", 404);
  }

  const [newComment] = await prisma.$transaction([
    prisma.comment.create({
      data: {
        userId: Number(userId),
        postId: Number(postId),
        content
      }
    }),
    prisma.post.update({
      where: { id: Number(postId) },
      data: { commentCount: { increment: 1 } }
    })
  ]);

  return newComment;
};

export const deleteComment = async (commentId, userId) => {
  const comment = await prisma.comment.findUnique({
    where: { id: Number(commentId) }
  });

  if (!comment) {
    throw new AppError("Komentar tidak ditemukan", 404);
  }

  if (comment.userId !== Number(userId)) {
    throw new AppError("Anda tidak memiliki akses untuk menghapus komentar ini", 400);
  }

  await prisma.$transaction([
    prisma.comment.delete({
      where: { id: Number(commentId) }
    }),
    prisma.post.update({
      where: { id: Number(comment.postId) },
      data: { commentCount: { decrement: 1 } }
    })
  ]);
};
