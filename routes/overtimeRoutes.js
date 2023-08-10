import express from 'express';
import { clockInOT, clockOutOT } from '../controllers/overtimeController.js';
import  verifyToken  from '../middleware/validator/verifyToken.js';

const router = express.Router();

router.post('/', verifyToken, clockInOT);
router.patch('/', verifyToken, clockOutOT);

export default router;
