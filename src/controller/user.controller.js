import * as z from "zod";
import prisma from "../prismadb/prisma.js";
import cloudinary from "../utils/cloudinary.js";


export const getUserByUsername = async (req, res) => {
    const { username } = req.params;

    try {
        const user = await prisma.user.findUnique({
            where: {username}, omit: {password: true, imageId: true}
        })

        if (!user) {
            return res.status(404).json({success: false, message: "User not found"})
        }

        return res.status(200).json({success: true,message: "Berhasil mendapatkan data user", data: user})

    } catch (error) {
        return res.status(500).json({success: false, message: "Servernya ngambek Coy!"})
    }
}

export const getSearchUser = async (req, res) => {
    const { username } = req.query;

    if (!username) {
        return res.status(400).json({success: false, message: "Username query is required"})
    }

    const users = await prisma.user.findMany({
        where: {
            username: {
                contains: username, mode: "insensitive"
            }
        },
        select: {
            id: true,
            username: true,
            fullname: true,
            image: true
        }
    })

    if (users.length === 0) {
        return res.status(404).json({success: false, message: "No users found"})
    }

    res.status(200).json({success: true, message: "Berhasil mendapatkan data user", data: users})
}

export const updateUser = async (req, res) => {
    try {
        // validation dengan zod
        const userSchema = z.object({
            fullname: z.string().min(6, "Fullname minimal 6 karakter"),
            username: z.string().min(6, "Username minimal 6 karakter"),
            bio: z.string().min(10, "Bio minimal 10 karakter"),

        });

        const validated = userSchema.parse(req.body);
    
        // validation username
        const currentUser = await prisma.user.findUnique({
            where: {
                username: validated.username
            }
        })

        if (currentUser) {
            return res.status(400).json({success: false, message: "Username sudah digunakan"})
        }
    
        // update user berdasarkan req user
        const updatedUser = await prisma.user.update({
            where: {
                id: req.user.id
            },
            data: {
                bio: validated.bio,
                fullname: validated.fullname,
                username: validated.username
            },
            omit: {password: true}
        })
    
        // response success
        return res.status(201).json({success: true, message: "Berhasil update user", data: updatedUser})
        
    } catch (error) {
        if (error instanceof Error && "issues" in error) {
        // zod
        const errors = error.issues.map((i) => i.message);
        return res.status(400).json({
          success: false,
          message: errors
        });
      }
      // error express
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Servernya ngambek coy"
      });
    }
}

export const updateAvatar = async (req, res) => {
    try {
        // validasi file
        if (!req.file) {
            return res.status(400).json({success: false, message: "File gambar wajib diupload"})
        }
    
        // get current dari req user id
        const currentUser = await prisma.user.findUnique({
            where: {id: req.user.id}
        })
        
        // validasi 2 buat fungsi hapus gambar lama
        if (currentUser.imageId) {
            await cloudinary.uploader.destroy(currentUser.imageId)
        }

        // upload gambar dengan buffer multer
        const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

        const result = await cloudinary.uploader.upload(fileStr, {
            folder: "avatar",
            transformation: [{
                width: 300,
                height: 300,
            }]
        });
    
        // update user image dan imageId di database table user
        const updatedUser = await prisma.user.update({
            where: {id: req.user.id},
            data: {
                image: result.secure_url,
                imageId: result.public_id
            },
            omit: {password: true}
        })
    
        // response success
        res.status(201).json({success: true, message: "Berhasil update foto profile", data: updatedUser})
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({success: false, message: "Servernya ngambek coy", error})
    }
}