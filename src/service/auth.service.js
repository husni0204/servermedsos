import prisma from "../prismadb/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";

export const register = async ({ fullname, username, email, password }) => {
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email },
        { username }
      ]
    },
    select: { email: true, username: true }
  })

  if (existingUser) {
    if (existingUser.email === email) {
      throw new AppError("Email sudah terdaftar, silahkan gunakan email lain", 400);
    }
    throw new AppError("Username sudah terdaftar, silahkan gunakan username lain", 400);
  }

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  const newUser = await prisma.user.create({
    data: {
      fullname,
      username,
      password: hashedPassword,
      email,
    }
  })

  const jwtSecret = process.env.JWT_SECRET;
  const token = jwt.sign({ id: newUser.id }, jwtSecret, { expiresIn: "1d" });

  return {
    user: {
      id: newUser.id,
      fullname: newUser.fullname,
      username: newUser.username,
      email: newUser.email,
      image: newUser.image,
      bio: newUser.bio
    },
    token
  };
};

export const login = async ({ email, password }) => {
  const existingEmail = await prisma.user.findUnique({
    where: { email }
  });

  if (!existingEmail) {
    throw new AppError("Email tidak terdaftar, silahkan register", 400);
  }

  const comparePassword = bcrypt.compareSync(password, existingEmail.password);

  if (!comparePassword) {
    throw new AppError("Password salah, silahkan coba lagi", 400);
  }

  const jwtSecret = process.env.JWT_SECRET;
  const token = jwt.sign({ id: existingEmail.id }, jwtSecret, { expiresIn: "1d" });

  return {
    user: {
      id: existingEmail.id,
      fullname: existingEmail.fullname,
      username: existingEmail.username,
      email: existingEmail.email,
      image: existingEmail.image,
      bio: existingEmail.bio
    },
    token
  };
};
