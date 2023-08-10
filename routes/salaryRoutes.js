import express from 'express'
import verifyToken  from '../middleware/validator/verifyToken.js';
import { employeeSalary, overtimeSalary, yearlySalary } from '../controllers/salaryController.js';

const router = express.Router();

router.get('/', verifyToken, employeeSalary);
router.get('/overtime', verifyToken, overtimeSalary);
router.get('/yearly', verifyToken, yearlySalary);

export default router;
