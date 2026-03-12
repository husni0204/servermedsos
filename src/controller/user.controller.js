import prisma from "../prismadb/prisma.js";


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