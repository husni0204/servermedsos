import prisma from "../prismadb/prisma.js";
import AppError from "../utils/AppError.js";

export const followUser = async (currentUserId, followUserId) => {
  if (Number(currentUserId) === Number(followUserId)) {
    throw new AppError("You cannot follow yourself", 400);
  }

  const otherUserId = await prisma.user.findUnique({
    where: { id: Number(followUserId) },
    select: { id: true }
  });

  if (!otherUserId) {
    throw new AppError("User not found", 404);
  }

  const isFollowUser = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: Number(followUserId),
        followingId: Number(currentUserId)
      }
    }
  });

  if (isFollowUser) {
    throw new AppError("You are already following this user", 400);
  }

  const [follow] = await prisma.$transaction([
    prisma.follow.create({
      data: {
        followerId: Number(followUserId),
        followingId: Number(currentUserId)
      }
    }),
    prisma.user.update({
      where: { id: Number(currentUserId) },
      data: { followingCount: { increment: 1 } }
    }),
    prisma.user.update({
      where: { id: Number(followUserId) },
      data: { followerCount: { increment: 1 } }
    })
  ]);

  return follow;
};

export const unfollowUser = async (currentUserId, unfollowUserId) => {
  const userUnFollow = await prisma.user.findUnique({
    where: { id: Number(unfollowUserId) },
    select: { id: true }
  });

  if (!userUnFollow) {
    throw new AppError("User not found", 404);
  }

  await prisma.$transaction([
    prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: Number(unfollowUserId),
          followingId: Number(currentUserId)
        }
      }
    }),
    prisma.user.update({
      where: { id: Number(currentUserId) },
      data: { followingCount: { decrement: 1 } }
    }),
    prisma.user.update({
      where: { id: Number(unfollowUserId) },
      data: { followerCount: { decrement: 1 } }
    })
  ]);
};

export const getSuggestedUsers = async (currentUserId) => {
  const followedUser = await prisma.follow.findMany({
    where: { followingId: currentUserId },
    select: { followerId: true },
  });

  const followedIds = followedUser.map(f => f.followerId);

  const users = await prisma.user.findMany({
    where: {
      id: {
        notIn: [...followedIds, currentUserId]
      }
    },
    select: {
      id: true,
      username: true,
      fullname: true,
      image: true
    },
    take: 5,
    orderBy: { createdAt: "desc" }
  });

  return users;
};

export const isFollowing = async (currentUserId, followUserId) => {
  const checkFollowUserId = await prisma.user.findUnique({
    where: { id: Number(followUserId) },
    select: { id: true }
  });

  if (!checkFollowUserId) {
    throw new AppError("User tidak ditemukan", 404);
  }

  const isFollowUserData = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: Number(followUserId),
        followingId: currentUserId
      }
    }
  });

  return !!isFollowUserData;
};
