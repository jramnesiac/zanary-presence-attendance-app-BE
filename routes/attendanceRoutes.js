import express from 'express';
import { clockIn, clockOut, todayLog, logHistory } from '../controllers/attendanceController.js';
import verifyToken from '../middleware/validator/verifyToken.js';

const router = express.Router();

router.post('/clockin', verifyToken, clockIn);
router.post('/clockout', verifyToken, clockOut);
router.get('/todaylog', verifyToken, todayLog);
router.get('/loghistory', verifyToken, logHistory);

export default router;
