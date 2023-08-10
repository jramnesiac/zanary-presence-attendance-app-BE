import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const clockInOT = async (req, res) => {
  try {
    const checkUser = await prisma.user.findUnique({
      where: { id: req.user.id },
    });
    if (!checkUser) throw { message: "User not found in attendance system" };

    const todayStart = new Date();
    todayStart.setDate(todayStart.getDate() + 1);
    todayStart.setHours(-17, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setDate(todayEnd.getDate() + 1);
    todayEnd.setHours(6, 59, 59, 599);

    const checkClockInOT = await prisma.attendance.findFirst({
      where: {
        UserId: req.user.id,
        clockInOT: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    });

    if (checkClockInOT) throw { message: "Overtime clock-in already recorded for today" };

    const date = new Date();
    const timeNow = new Date(date.getTime() + (7 * 3600 * 1000));

    await prisma.attendance.updateMany({
      where: {
        UserId: req.user.id,
        clockIn: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
      data: { clockInOT: timeNow },
    });

    res.status(200).send({
      message: "Overtime clock-in recorded successfully!",
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

export const clockOutOT = async (req, res) => {
  try {
    const checkUser = await prisma.user.findUnique({
      where: { id: req.user.id },
    });
    if (!checkUser) throw { message: "User not found in attendance system" };

    const todayStart = new Date();
    todayStart.setDate(todayStart.getDate() + 1);
    todayStart.setHours(-17, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setDate(todayEnd.getDate() + 1);
    todayEnd.setHours(6, 59, 59, 599);

    const checkClockOutOT = await prisma.attendance.findFirst({
      where: {
        UserId: req.user.id,
        clockOutOT: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    });

    if (checkClockOutOT) throw { message: "Overtime clock-out already recorded for today" };

    const date = new Date();
    const timeNow = new Date(date.getTime() + (7 * 3600 * 1000));

    await prisma.attendance.updateMany({
      where: {
        UserId: req.user.id,
        clockIn: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
      data: { clockOutOT: timeNow },
    });

    res.status(200).send({
      message: "Overtime clock-out recorded successfully!",
    });
  } catch (error) {
    res.status(400).send(error);
  }
};
