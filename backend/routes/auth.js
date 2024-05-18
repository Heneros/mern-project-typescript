import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import registerUser from '../controllers/auth/registerController.js';
// import User from '../models/userModel.js';

const router = express.Router();

router.post('/register', registerUser);

export default router;
