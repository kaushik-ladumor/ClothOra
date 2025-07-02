import express from  'express';
const route = express.Router();
import authenticate from '../middleware/authMiddleware.js';
import {FindUser, updatePassword} from '../controllers/userController.js';


route.get("/", authenticate, FindUser);

route.put("/update-password", authenticate, updatePassword);


export default route;
