import express from 'express';
import { allproduct, productDetail } from '../controllers/productController.js';

const route = express.Router();

route.get('/', allproduct);

route.get("/:id", productDetail);


export default route;
