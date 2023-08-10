import express from 'express';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import cors from 'cors'
import errorHandler from './middleware/errorHandler.js';
import userRoutes from './routes/userRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js'
import employeeRouters from './routes/employeeRoutes.js'
import overtimeRouters from './routes/overtimeRoutes.js'
import salaryRouters from './routes/salaryRoutes.js'

const prisma = new PrismaClient();
const app = express();
dotenv.config();

app.use(express.static('./public'))
app.use(cors())
app.use(errorHandler);
app.use(express.json());
app.use('/api/auth', userRoutes);
app.use('/api/attendance', attendanceRoutes )
app.use('/api/users', employeeRouters)
app.use('/api/overtime', overtimeRouters)
app.use("/api/salary", salaryRouters)


app.listen(3006, () => console.log('listening on port 3006'));
