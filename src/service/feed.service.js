import cloudinary from "../utils/cloudinary.js";
import prisma from "../prismadb/prisma.js";
import AppError from "../utils/AppError.js";

export const createFeed = async (userId, caption, file) => {
  if (!caption) {
    throw new AppError("Caption wajib diisi", 400);
  }

  if (!file) {
    throw new AppError("File gambar wajib diupload", 400);
  }

  const fileStr = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

  const result = await cloudinary.uploader.upload(fileStr, {
    folder: "feeds",
    transformation: [
      { aspec_ratio: "4:5", crop: "fill", gravity: "auto" },
      { quality: "auto", fetch_format: "auto" }
    ]
  });

  const newFeed = await prisma.post.create({
    data: {
      caption,
      image: result.secure_url,
      imageId: result.public_id,
      userId
    }
  });

  await prisma.user.update({
    where: { id: Number(userId) },
    data: { postCount: { increment: 1 } }
  });

  return newFeed;
};

export const getFeeds = async (userId, { page: p = "1", limit: l = "3" } = {}) => {
  const page = Number(p);
  const limit = Number(l);

  const followings = await prisma.follow.findMany({
    where: { followingId: userId },
    select: { followerId: true }
  });

  const followingIds = followings.map(f => f.followerId);
  const skip = (page - 1) * limit;

  const totalFeed = await prisma.post.count({
    where: {
      userId: { in: [...followingIds, userId] }
    }
  });

  const posts = await prisma.post.findMany({
    where: {
      userId: { in: [...followingIds, userId] }
    },
    include: {
      user: {
        select: {
          id: true,
          fullname: true,
          username: true,
          image: true
        }
      }
    },
    orderBy: { createdAt: "desc" },
    skip,
    take: limit
  });

  const totalPages = Math.ceil(totalFeed / limit);

  return { posts, totalFeed, totalPages, page, limit };
};

export const getFeedDetail = async (postId, { commentPage: cp = "1", commentLimit: cl = "10" } = {}) => {
  const commentPage = Number(cp);
  const commentLimit = Number(cl);
  const commentSkip = (commentPage - 1) * commentLimit;

  const post = await prisma.post.findUnique({
    where: { id: Number(postId) },
    include: {
      user: {
        select: {
          id: true,
          fullname: true,
          username: true,
          image: true
        }
      },
      comments: {
        skip: commentSkip,
        take: commentLimit,
        select: {
          id: true,
          content: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              fullname: true,
              username: true,
              image: true,
              createdAt: true
            }
          }
        },
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if (!post) {
    throw new AppError("Postingan tidak ditemukan", 404);
  }

  return { post, commentPage, commentLimit };
};

export const deleteFeed = async (postId, userId) => {
  const postData = await prisma.post.findUnique({
    where: { id: Number(postId) },
    select: { userId: true, imageId: true }
  });

  if (!postData) {
    throw new AppError("Feeds tidak ditemukan", 404);
  }

  if (postData.userId !== Number(userId)) {
    throw new AppError("Anda tidak memiliki akses untuk menghapus Feeds ini", 400);
  }

  if (postData.imageId) {
    await cloudinary.uploader.destroy(postData.imageId);
  }

  await prisma.post.delete({
    where: { id: Number(postId) }
  });
};
