import prisma from "../prismadb/prisma.js"

export const LikeFeedUser = async (req, res) => {
    // request
    const currentUserId = req.user.id
    const { postId } = req.params

    try {
        // validasi
        const postData = await prisma.post.findUnique({
            where: {
                id: Number(postId)
            }
        })

        if (!postData) {
            return res.status(404).json({success: false, message: "Feeds tidak ditemukan"})
        }

        // check jika user sudah like
        const CheckLike = await prisma.likes.findUnique({
            where: {
                userId_postId: {
                    userId: currentUserId,
                    postId: Number(postId)
                }
            }
        })

        if (CheckLike) {
            return res.status(400).json({success: false, message: "Anda sudah like feeds ini"})
        }

        // Insert Data Like
        const newLike = await prisma.likes.create({
            data: {
                userId: currentUserId,
                postId: Number(postId)
            }
        })

        // update post
        await prisma.post.update({
            where: { id: Number(postId) },
            data: {
                likeCount: {increment: 1}
            }
        })

        res.status(201).json({success: true, message: "Berhasil menambahkan like", data: newLike})

    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: "Servernya ngambek Coy!", error})
    }
}