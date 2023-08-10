import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const clockIn = async (req, res) => {
  try {
    const { note } = req.body;
    const checkUser = await prisma.user.findFirst({
      where: {
        id: req.user.id,
      },
    });
    if (!checkUser) throw { message: 'No account found' };

    const todayStart = new Date();
    todayStart.setDate(todayStart.getDate() + 1);
    todayStart.setHours(-17, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setDate(todayEnd.getDate() + 1);
    todayEnd.setHours(6, 59, 59, 599);

    const checkClockIn = await prisma.attendance.findFirst({
      where: {
        UserId: req.user.id,
        clockIn: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    });

    if (checkClockIn) throw { message: 'You have clocked in' };

    const date = new Date();
    const timeNow = new Date(date.getTime() + 7 * 3600 * 1000);

    await prisma.attendance.create({
      data: {
        UserId: req.user.id,
        clockIn: timeNow,
        note,
      },
    });

    res.status(200).send({
      message: 'Clock In Success!',
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

export const clockOut = async (req, res) => {
    try {
      const checkUser = await prisma.user.findFirst({
        where: {
          id: req.user.id,
        },
      });
  
      if (!checkUser) throw { message: "No account found" };
  
      const todayStart = new Date();
      todayStart.setDate(todayStart.getDate() + 1);
      todayStart.setHours(-17, 0, 0, 0);
  
      const todayEnd = new Date();
      todayEnd.setDate(todayEnd.getDate() + 1);
      todayEnd.setHours(6, 59, 59, 599);
  
      const checkClockOut = await prisma.attendance.findFirst({
        where: {
          UserId: req.user.id,
          clockOut: {
            gte: todayStart,
            lte: todayEnd,
          },
        },
      });
  
      if (checkClockOut) throw { message: "You have clocked out" };
  
      const date = new Date();
      const timeNow = new Date(date.getTime() + 7 * 3600 * 1000);
  
      await prisma.attendance.updateMany({
        where: {
          UserId: req.user.id,
          clockIn: {
            gte: todayStart,
            lte: todayEnd,
          },
        },
        data: { clockOut: timeNow },
      });
  
      res.status(200).send({
        message: "Clock Out Success!",
      });
    } catch (error) {
      res.status(400).send(error);
    }
  };

  export const todayLog = async (req, res) => {
    try {
      const checkUser = await prisma.user.findFirst({
        where: {
          id: req.user.id
        }
      });
  
      if (!checkUser) throw { message: "Account not found" };
  
      const todayStart = new Date();
      todayStart.setDate(todayStart.getDate() + 1);
      todayStart.setHours(-17, 0, 0, 0);
  
      const todayEnd = new Date();
      todayEnd.setDate(todayEnd.getDate() + 1);
      todayEnd.setHours(6, 59, 59, 599);
  
      const result = await prisma.attendance.findFirst({
        where: {
          UserId: req.user.id,
          OR: [
            {
              clockOut: {
                gte: todayStart,
                lte: todayEnd
              }
            },
            {
              clockIn: {
                gte: todayStart,
                lte: todayEnd
              }
            }
          ]
        }
      });
  
      res.status(200).send(result);
    } catch (error) {
      res.status(400).send(error);
    }
  };

  export const logHistory = async (req, res) => {
    try {
      const page = +req.query.page || 1;
      const limit = +req.query.limit || 10;
      const offset = (page - 1) * limit;
      const sort = req.query.sort || "ASC";
      const sortBy = req.query.sortBy || "clockIn";
  
      const checkUser = await prisma.user.findFirst({
        where: {
          id: req.user.id,
        },
      });
      if (!checkUser) throw { message: "Account not found" };
  
      const result = await prisma.attendance.findMany({
        where: {
          UserId: req.user.id,
        },
        skip: offset,
        take: limit,
        orderBy: {
          [sortBy]: sort,
        },
      });
  
      const count = await prisma.attendance.count({
        where: {
          UserId: req.user.id,
        },
      });
  
      res.status(200).send({
        totalPage: Math.ceil(count / limit),
        currentPage: page,
        totalLog: count,
        result,
      });
    } catch (error) {
      res.status(400).send(error);
    }
  };
  

  
