import express from "express";
import multer from "multer";
import cloudinaryConfig from "../cloudConfig.js";
import wrapAsync from "../utils/wrapAsync.js";
const route = express.Router();

import {
  addProduct,
  allOrder,
  allProduct,
  allUser,
  deleteProduct,
  deleteProductCloudinary,
  manyImageUpload,
  orderCount,
  orderDetail,
  orderUpdate,
  productCount,
  stockHendle,
  uploadImage,
  userCount,
  userDelete,
} from "../controllers/adminController.js";

// Configure multer with Cloudinary storage
const upload = multer({
  storage: cloudinaryConfig.storage,
  limits: {
    fileSize: 1 * 1024 * 1024, // 1MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

// ... (other existing routes remain the same)

route.get("/product", wrapAsync(allProduct));

// Enhanced addproduct route with Cloudinary support
route.post(
  "/addproduct",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "colorImages", maxCount: 10 },
  ]),
  wrapAsync(addProduct)
);

route.post("/upload-image", upload.single("image"), wrapAsync(uploadImage));

route.post("/upload-images", upload.array("images", 10), wrapAsync(manyImageUpload));

route.delete("/delete-image/:publicId", wrapAsync(deleteProductCloudinary));

route.put("/product/:id/toggle-stock", wrapAsync(stockHendle));

route.delete("/product/:id", wrapAsync(deleteProduct));

route.get("/product/count", wrapAsync(productCount));

route.get("/user", wrapAsync(allUser));

route.get("/user/count", wrapAsync(userCount));

route.delete("/user/:id", wrapAsync(userDelete));

route.get("/order/count", wrapAsync(orderCount));

route.get("/order", wrapAsync(allOrder));

route.put("/order/:id/status", wrapAsync(orderUpdate));

route.get("/order/stats", wrapAsync(orderDetail));


export default route;
