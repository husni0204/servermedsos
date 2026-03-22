import prisma from "../prismadb/prisma.js";

export const CreateComment = async (req, res) => {
    try {
        const currentUserId = req.user.id;

        const { postId, content } = req.body;

        // validasi 1
        if (!postId || !content) {
            return res.status(400).json({success: false, message: "PostId dan content wajib diisi"});
        }

        // validasi 2
        const postData = await prisma.post.findUnique({
            where: {
                id: Number(postId)
            }
        })

        if (!postData) {
            return res.status(404).json({success: false, message: "Post tidak ditemukan"});
        }

        // insert data
        const newComment =await prisma.comment.create({
            data: {
                userId: Number(currentUserId),
                postId: Number(postId),
                content
            }
        })

        // update post count
        await prisma.post.update({
            where: {
                id: Number(postId)
            },
            data: {
                commentCount: { increment: 1 }
            }
        })

        res.status(201).json({success: true, message: "Berhasil membuat komentar", data: newComment})

    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: "Servernya ngambek Coy!", error})
    }
}

export const DeleteCommentById = async (req, res) => {
    const { id } = req.params;

    const currentUserId = req.user.id;

    const comment = await prisma.comment.findUnique({
        where: {
            id: Number(id)
        }
    })

    if (!comment) {
        return res.status(404).json({success: false, message: "Komentar tidak ditemukan"});
        
    }

    if (comment.userId != currentUserId) {
        return res.status(400).json({success: false, message: "Anda tidak memiliki akses untuk menghapus komentar ini"});
        
    }

    // hapus comment
    await prisma.comment.delete({
        where: {
            id: Number(id)
        }
    })

    // update post count
    await prisma.post.update({
        where: {
            id: Number(comment.postId)
        },
        data: {
            commentCount: { decrement: 1 }
        }
    })

    res.status(200).json({success: true, message: "Berhasil menghapus komentar"})
}