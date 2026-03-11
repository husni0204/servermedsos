import * as z from "zod";
import prisma from "../prismadb/prisma.js";
import bcrypt from "bcrypt";

export const RegisterUser = async (req, res) => {
  try {
    // validation
    const userSchema = z.object({
      fullname: z.string().min(6, "Fullname minimal 6 karakter"),
      username: z.string().min(6, "Username minimal 6 karakter"),
      email: z.email("Inputan harus berformat email example@mail.com"),
      password: z.string().min(8, "Password minimal 8 karakter"),
    });

    const validated = userSchema.parse(req.body);

    // cek apakah email dan username sudah terdaftar
    const emailExisting = await prisma.user.findUnique({
      where: {
        email: validated.email,
      },
    })

    if (emailExisting) {
      return res.status(400).json({message: "Email sudah terdaftar, silahkan gunakan emaial lain"});
    }

    const usernameExisting = await prisma.user.findUnique({
      where: {
        username: validated.username,
      },
    })

    if (usernameExisting) {
      return res.status(400).json({message: "Username sudah terdaftar, silahkan gunakan username lain"});
    }

    // Enkripsi password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(validated.password, salt);

    // Insert data ke database
    const newUser = await prisma.user.create({
      data: {
        fullname: validated.fullname,
        username: validated.username,
        password: hashedPassword,
        email: validated.email,
      }
    })

    return res.status(201).json({
      success: true,
      message: "User berhasil didaftarkan",
      data : {
        id: newUser.id,
        fullname: newUser.fullname,
        username: newUser.username,
        email: newUser.email,
        image: newUser.image,
        bio: newUser.bio
      }
    });

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
};

export const LoginUser = (req, res) => {
  res.json({
    message: "Login endpoint",
  });
};
