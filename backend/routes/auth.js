import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import registerUser from '../controllers/auth/registerController.js';
import loginUser from '../controllers/auth/loginController.js';
import verifyUserEmail from '../controllers/auth/verifyEmailController.js';
// import User from '../models/userModel.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/verify/:emailToken/:userId', verifyUserEmail);

export default router;
