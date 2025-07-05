import express from 'express';
import { allproduct, productDetail } from '../controllers/productController.js';
import wrapAsync from '../utils/wrapAsync.js';

const route = express.Router();

route.get('/', wrapAsync(allproduct));

route.get("/:id", wrapAsync(productDetail));


export default route;
