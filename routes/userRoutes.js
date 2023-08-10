import UserController from '../controllers/userController.js';
import verifyToken from '../middleware/validator/verifyToken.js';
import { registerValidator, loginValidator, adduserValidator } from '../middleware/validator/validator.js';
import express from 'express';

const router = express.Router();

router.post('/', registerValidator, verifyToken, UserController.register);
router.get('/', verifyToken, UserController.keepLogin);
router.post('/login', loginValidator, UserController.login);
router.post('/user', verifyToken, adduserValidator, UserController.addUser);

export default router;
