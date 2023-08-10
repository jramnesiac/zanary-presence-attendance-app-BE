import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const employeeSalary = async (req, res) => {
    try {
      const { id } = req.user;
      const result = await prisma.attendance.findMany({
        where: { id: id },
        include: {
          user: {
            select: {
              id: true,
              fullname: true,
              email: true,
            },
            include: {
              role: true, // Include the related role if it's a relation field
            },
          },
        },
      });
      
  
      const baseSalary = checkUser.role.salary;
      const hourSalary = baseSalary / 8;
  
      const updatedResult = result.map(log => {
        let deduction = 0;
        if (log.clockIn && !log.clockOut) {
          deduction = log.user.role.salary * 0.5;
        } else if (!log.clockIn && !log.clockOut) {
          deduction = log.user.role.salary;
        }
  
        let salaryOvertime = 0;
        if (log.overtimeIn && log.overtimeOut) {
          const delta = (log.overtimeOut - log.overtimeIn) / (60 * 60 * 1000);
  
          for (let i = 1; i <= delta; i++) {
            if (i > 1) salaryOvertime += 2 * hourSalary;
            else salaryOvertime += 1.5 * hourSalary;
          }
        }
  
        return {
          ...log,
          deduction,
          salaryOvertime,
        };
      });
  
      res.status(200).send({
        result: updatedResult,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({ message: "Error processing attendance data" });
    }
  };
  
  export const overtimeSalary = async (req, res) => {
    try {
      const { id } = req.user;
      const checkUser = await prisma.user.findUnique({
        where: { id },
        include: { role: true },
      });
  
      if (!checkUser) {
        throw { message: "Employee not found in attendance records" };
      }
  
      const attendanceLog = await prisma.attendance.findMany({
        where: {
          i: id,
          NOT: [
            { overtimeIn: null },
            { overtimeOut: null },
          ],
        },
      });
  
      const baseSalary = checkUser.role.salary;
      const hourSalary = baseSalary / 8;
  
      let salaryOT = 0;
      for (const log of attendanceLog) {
        if (log.overtimeIn && log.overtimeIn) {
          const delta = (log.overtimeOut - log.overtimeIn) / (60 * 60 * 1000);
          console.log(delta);
  
          for (let i = 1; i <= delta; i++) {
            if (i > 1) overtimeSalary += 2 * hourSalary;
            else if (i === 1) overtimeSalary += 1.5 * hourSalary; // Fixed the assignment operator to comparison operator
          }
        }
      }
  
      res.status(200).send({ salaryOvertime });
    } catch (error) {
      console.log(error);
      res.status(400).send({ message: "Error calculating overtime salary" });
    };
};

    export const yearlySalary = async (req, res) => {
        try {
          const { id } = req.user;
          const checkUser = await prisma.user.findUnique({
            where: { id },
            include: { role: true },
          });
      
          if (!checkUser) {
            throw { message: "Employee not found in attendance records" };
          }
      
          const attendanceLog = await prisma.attendance.findMany({
            where: {
              userId: id,
              NOT: [
                { overtimeIn: null },
                { overtimeOut: null },
              ],
            },
            include: {
              user: {
                select: {
                  id: true,
                  role: true,
                },
              },
            },
          });
      
          const baseSalary = checkUser.role.salary;
          const hourSalary = baseSalary / 8;
      
          const monthlyRecap = Array.from({ length: 12 }, () => ({
            totalSalary: 0,
            totalDeduction: 0,
            totalSalaryOT: 0,
          }));
      
          attendanceLog.forEach(log => {
            const year = new Date(log.overtimeIn).getFullYear();
            const month = new Date(log.overtimeOut).getMonth();
      
            let deduction = 0;
            let salaryOT = 0;
      
            if (log.clockIn && !log.clockOut) {
              deduction = log.user.position.salary * 0.5;
            } else if (!log.clockIn && !log.clockOut) {
              deduction = log.user.role.salary;
            }
      
            if (log.overtimeIn && log.overtimeOut) {
              const delta = (log.overtimeOut- log.overtimeIn) / (60 * 60 * 1000);
      
              for (let i = 1; i <= delta; i++) {
                if (i > 1) salaryOT += 2 * hourSalary;
                else salaryOT += 1.5 * hourSalary;
              }
            }
      
            monthlyRecap[month].totalSalary += baseSalary - deduction;
            monthlyRecap[month].totalDeduction += deduction;
            monthlyRecap[month].totalSalaryOT += salaryOT;
          });
      
          res.status(200).send({
            monthlyRecap,
          });
        } catch (error) {
          console.log(error);
          res.status(400).send({ message: "Error calculating yearly salary" });
        }
      };
      
  
  