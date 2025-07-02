import express from 'express';
import { signup, verifyEmail, login } from '../controllers/authController.js';
import { logout } from '../controllers/authController.js';
const route = express.Router();

route.post('/login', login);
route.post('/signup', signup);
route.post('/verifyEmail', verifyEmail);
route.post("/logout", logout);

export default route;