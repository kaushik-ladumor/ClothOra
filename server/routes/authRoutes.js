import express from 'express';
import { signup, verifyEmail, login } from '../controllers/authController.js';
import { logout } from '../controllers/authController.js';
import wrapAsync from '../utils/wrapAsync.js';
const route = express.Router();

route.post('/login', wrapAsync(login));
route.post('/signup', wrapAsync(signup));
route.post('/verifyEmail', wrapAsync(verifyEmail));
route.post("/logout", wrapAsync(logout));

export default route;