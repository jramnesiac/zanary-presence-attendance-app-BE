import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs from "fs";
import handlebars from "handlebars";
import transporter from "../middleware/transporter.js";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();
const generateToken = (payload, expiresIn) =>
  jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "7h" });

const UserController = {
  register: async (req, res) => {
    try {
      const { fullname, password, phone, birthdate } = req.body
      if (await prisma.user.findFirst({ where: { phone } }))
        throw {
          message:
            "Phone number is already registered. Did you forget to clock in?",
        };

      const hashPassword = await bcrypt.hash(
        password,
        await bcrypt.genSalt(10)
      );

      res.status(200).send({
        status: true,
        result: await prisma.user.create({
          fullname,
          email: req.user.email,
          password: hashPassword,
          phone,
          birthdate: new Date(birthdate),
          RoleId: req.user.roleId,
        }),
        message: "Registration successful! Ready to track your attendance?",
      });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await prisma.user.findFirst({ where: { email } });
      if (!user || !(await bcrypt.compare(password, user.password)))
        throw { message: "Login failed! Maybe you're still on break?" };

      res.status(200).send({
        message: "Login Success! Don't forget to clock in!",
        result: user,
        token: generateToken({ id: user.id }, "7d"),
      });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  },

  addUser: async (req, res) => {
    try {
      const { email, roleId } = req.body;
      if (!req.user.isAdmin || (await prisma.user.findFirst({ where: { email } })))
        throw {
          message:
            "Only the boss can add employees or email already in the attendance list.",
        };

      const token = generateToken({ email, roleId }, "3d");
      const data = fs.readFileSync("../email/emailTransporter.HTML", "utf-8");
      await transporter.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject: "Join Our Attendance System",
        html: handlebars.compile(data)({
          token,
          message: "Welcome to the team,",
        }),
      });

      res
        .status(200)
        .send({
          message:
            "Invitation sent! Check your email to join the attendance tracking system.",
          token,
        });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  },

  keepLogin: async (req, res) => {
    try {
      res.status(200).send(
        await prisma.user.findFirst({
          where: { id: req.user.id },
          attributes: {
            exclude: [
              "password",
              "phone",
              "isSuspended",
              "isDeleted",
              "updatedAt",
            ],
          },
        })
      );
    } catch (error) {
      res.status(400).send(error);
    }
  },

  deleteUser: async (req, res) => {
    try {
      const userId = req.params.id; // Asumsi ID pengguna diteruskan sebagai parameter dalam URL

      // Opsional: Tambahkan pemeriksaan otorisasi, mis. pastikan pengguna yang meminta adalah admin
      if (!req.user.isAdmin) {
        return res
          .status(403)
          .send({
            message: "You're not the boss here! Only admins can delete users.",
          });
      }

      // Temukan pengguna dengan ID yang diberikan
      const user = await prisma.user.findOne({ where: { id: userId } });

      // Jika pengguna tidak ditemukan, kirim pesan kesalahan
      if (!user) {
        return res
          .status(404)
          .send({
            message: "User not found. Maybe they already clocked out forever?",
          });
      }

      // Hapus pengguna dari database
      await user.destroy();

      // Kirim respons sukses
      res
        .status(200)
        .send({
          message:
            "User deleted successfully. Don't forget to adjust the attendance records!",
        });
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  },
};

export default UserController;
