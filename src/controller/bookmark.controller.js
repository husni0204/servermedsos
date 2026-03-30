import prisma from "../prismadb/prisma.js";

export const ToggleSavedPost = async (req, res) => {
    const { postId } = req.params;
    const currentUserId = req.user.id;

    try {
        // validation
        const postData = await prisma.post.findUnique({
            where: { id: Number(postId) },
        })

        if (!postData) {
            return res.status(404).json({ success: false, message: "Post/Feed tidak ditemukan !" });
        }

        const checkUserBookmark = await prisma.bookmark.findUnique({
            where: {
                userId_postId: {
                    userId: req.user.id,
                    postId: Number(postId)
                }
            }
        })

        if (checkUserBookmark) {
            // Delete Bookmark
            await prisma.bookmark.delete({
                where: {
                    userId_postId: {
                        userId: req.user.id,
                        postId: Number(postId)
                    }
                }
            })

            return res.status(200).json({ success: true, message: "Post/Feed berhasil dihapus dari bookmark!" });
        }

        // Create Bookmark
        const newBookmark = await prisma.bookmark.create({
            data: {
                userId: req.user.id,
                postId: Number(postId)
            }
        })

        return res.status(200).json({ success: true, message: "Post/Feed berhasil disimpan ke bookmark!", data: newBookmark });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Servernya ngambek Coy!", error });
    }
}

export const CheckSavedFeed = async (req, res) => {
    try {
        const { postId } = req.params;
        const currentUserId = req.user.id;

        const checkSaved = await prisma.bookmark.findUnique({
            where: {
                userId_postId: {
                    userId: currentUserId,
                    postId: Number(postId)
                }
            }
        })

        if (checkSaved) {
            return res.status(200).json({ data: true });
        } else {
            return res.status(200).json({ data: false });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Servernya ngambek Coy!", error });
    }
}