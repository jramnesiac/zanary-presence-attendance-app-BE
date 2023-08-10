import express from 'express';
import { getEmployee, getRole, changePic } from '../controllers/employeeController.js';
import  verifyToken  from '../middleware/validator/verifyToken.js';
import  multerPicture from '../middleware/mutler.js';

const router = express.Router();

router.get('/', verifyToken, getEmployee);
router.get('/position', getRole);
router.patch('/picture', verifyToken, multerPicture().single('file'), changePic);

export default router;
