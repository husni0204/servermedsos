import prisma from "../prismadb/prisma.js";

export const FollowUserAccount = async (req, res) => {
    // inputan current user  inputan follow user
    const currentUserId = req.user.id;

    const { followUserId } = req.body;

    // cek jika current user sama dengan followed userid
    if (currentUserId === followUserId) {
        return res.status(400).json({success: false, message: "You cannot follow yourself" });
    }

    const otherUserId = await prisma.user.findUnique({
        where: {
            id: Number(followUserId)
        }
    })

    if (!otherUserId) {
        return res.status(404).json({success: false, message: "User not found" });
    }

    const isFollowUser = await prisma.follow.findUnique({
        where: {
            followerId_followingId: {
                followerId: Number(followUserId),
                followingId: Number(currentUserId)
            }
        }
    })

    if (isFollowUser) {
        return res.status(400).json({success: false, message: "You are already following this user" });
    }

    try {
        const follow = await prisma.follow.create({
            data: {
                followerId: followUserId,
                followingId: currentUserId
            }
        })

        // update user count
        await prisma.user.update({
            where: {
                id: currentUserId
            },
            data: {
                followingCount: {
                    increment: 1
                }
            }
        })

        await prisma.user.update({
            where: {
                id: followUserId
            },
            data: {
                followerCount: {
                    increment: 1
                }
            }
        })

        return res.status(201).json({success: true, message: "Followed user successfully", data: follow });

    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false, message: "Servernya ngambek Coy!" });
    }
}

export const UnfollowUserAccount = async (req, res) => {
    const {unfollowUserId} = req.params;
    const currentUserId = req.user.id;

    const userUnFollow = await prisma.user.findUnique({
        where: {
            id: Number(unfollowUserId)
        }
    })

    if (!userUnFollow) {
        return res.status(404).json({success: false, message: "User not found" });
    }

    try {
        await prisma.follow.delete({
            where: {
                followerId_followingId: {
                    followerId: Number(unfollowUserId),
                    followingId: Number(currentUserId)
                }
            }
        })

        // update count user following dan follower
        await prisma.user.update({
            where: {
                id: currentUserId
            },
            data: {
                followingCount: {
                    decrement: 1
                }
            }
        })

        await prisma.user.update({
            where: {
                id: Number(unfollowUserId)
            },
            data: {
                followerCount: {
                    decrement: 1
                }
            }
        })

        res.status(200).json({success: true, message: "Unfollow user successfully"});

    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: "Servernya ngambek Coy!", error });
    }
}