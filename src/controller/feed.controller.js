import cloudinary from "../utils/cloudinary.js";
import prisma from "../prismadb/prisma.js";

export const CreateFeed = async (req, res) => {
    try {
        const { caption } = req.body
        const currentUserId = req.user.id

        // validation
        if (!caption) {
            return res.status(400).json({success: false, message: "Caption wajib diisi"})
        }

        if (!req.file) {
            return res.status(400).json({success: false, message: "File gambar wajib diupload"})
        }

        // upload gambar dengan buffer multer
        const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

        const result = await cloudinary.uploader.upload(fileStr, {
            folder: "feeds",
            transformation: [
                {aspec_ratio: "4:5", crop: "fill", gravity: "auto"}, 
                {quality: "auto", fetch_format: "auto"}
            ]
        });

        // buat postingan feed baru
        const newFeed = await prisma.post.create({
            data: {
                caption,
                image: result.secure_url,
                imageId: result.public_id,
                userId: currentUserId
            }
        })

        // update data user
        await prisma.user.update({
            where: {
                id: Number(currentUserId)
            },
            data: {
                postCount: {increment: 1}
            }
        })

        // response success
        res.status(201).json({success: true, message: "Berhasil membuat postingan", data: newFeed})

    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: "Servernya ngambek Coy!", error})
    }
}

export const ReadAllFeeds = async (req, res) => {
    try {
        const posts = await prisma.post.findMany(
            {
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
                orderBy: {
                    createdAt: "desc"
                }
            }
        )

        res.status(200).json({success: true, message: "Berhasil mendapatkan semua postingan", data: posts})

    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: "Servernya ngambek Coy!", error})
    }
}

export const DetailFeed = async (req, res) => {
    const { id } = req.params;
    try {
        const post = await prisma.post.findUnique({
            where: {
                id: Number(id)
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
            }
        })

        if (!post) {
            return res.status(404).json({success: false, message: "Postingan tidak ditemukan"})
            
        }

        res.status(200).json({success: true, message: "Berhasil mendapatkan detail postingan", data: post})

    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: "Servernya ngambek Coy!", error})
    }
}

export const DeleteFeed = async (req, res) => {
    const { id } = req.params;

    try {
        const postData = await prisma.post.findUnique({
            where: {
                id: Number(id)
            }
        })
        
        if (!postData) {
            return res.status(404).json({success: false, message: "Feeds tidak ditemukan"})
        }

        if (postData.userId != req.user.id) {
            return res.status(400).json({success: false, message: "Anda tidak memiliki akses untuk menghapus Feeds ini"})
        }

        if (postData.imageId) {
            await cloudinary.uploader.destroy(postData.imageId)
        }

        await prisma.post.delete({
            where: {
                id: Number(id)
            }
        })

        res.status(200).json({success: true, message: "Berhasil menghapus Feeds"})

    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: "Servernya ngambek Coy!", error})
    }
}