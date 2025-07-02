import express from "express";
import multer from "multer";
import cloudinaryConfig from "../cloudConfig.js";
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

route.get("/product", allProduct);

// Enhanced addproduct route with Cloudinary support
route.post(
  "/addproduct",
  upload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "colorImages", maxCount: 10 },
  ]),
  addProduct
);

// New route for uploading single image
route.post("/upload-image", upload.single("image"), uploadImage);

// New route for uploading multiple images
route.post("/upload-images", upload.array("images", 10), manyImageUpload);

// Route to delete image from Cloudinary
route.delete("/delete-image/:publicId", deleteProductCloudinary);

route.put("/product/:id/toggle-stock", stockHendle);

route.delete("/product/:id", deleteProduct);

// Get product count
route.get("/product/count", productCount);

route.get("/user", allUser);

// Get user count
route.get("/user/count", userCount);

route.delete("/user/:id", userDelete);

route.get("/order/count", orderCount);

// Enhanced GET /admin/order route with complete user population
route.get("/order", allOrder);

// Enhanced PUT /admin/order/:id/status with better error handling
route.put("/order/:id/status", orderUpdate);

// Additional route to get detailed order statistics
route.get("/order/stats", orderDetail);

export default route;
