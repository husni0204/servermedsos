import * as z from "zod";
import prisma from "../prismadb/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


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

    const jwtSecret = process.env.JWT_SECRET;
    const token = jwt.sign({id: newUser.id}, jwtSecret, {expiresIn: "6d"});

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
      },
      token: token
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

export const LoginUser = async (req, res) => {
 try {
   // validation email and password
   const {email, password} = req.body;

   if (!email || !password) {
    return res.status(400).json({success: false, message: "Email dan password harus diisi"});
   }

   const existingEmail = await prisma.user.findUnique({
    where: {
      email: email
    }
   });

    if (!existingEmail) {
      return res.status(400).json({success: false, message: "Email tidak terdaftar, silahkan register"});
    }
 
   // comparing password with database
   const comparePassword = bcrypt.compareSync(password, existingEmail.password);

    if (!comparePassword) {
      return res.status(400).json({success: false, message: "Password salah, silahkan coba lagi"});
    }
 
   // generate jwt and save id user to jwt
   const jwtSecret = process.env.JWT_SECRET;
   const token = jwt.sign({id: existingEmail.id}, jwtSecret, {expiresIn: "6d"});
 
   // response success
    return res.status(200).json({
      success: true,
      message: "Login berhasil ",
      data : {
        id: existingEmail.id,
        fullname: existingEmail.fullname,
        username: existingEmail.username,
        email: existingEmail.email,
        image: existingEmail.image,
        bio: existingEmail.bio
      },
      token: token
    });
  
 } catch (error) {
    res.status(500).json({success: false, message: "Servernya ngambek coy"});
 } 
};

export const GetCurrentUser = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Berhasil mendapatkan data user",
    data: req.user
  });
}
