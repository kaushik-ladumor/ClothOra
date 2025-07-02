import express from "express";
import authenticate from "../middleware/authMiddleware.js";
import {
  addCart,
  clearCart,
  getCart,
  removeCart,
  totalDetail,
} from "../controllers/cartController.js";

const router = express.Router();

// Get Cart
router.get("/", authenticate, getCart);

// Add to Cart
router.post("/add", authenticate, addCart);

// Remove from Cart
router.delete("/remove/:productId", authenticate, removeCart);

// Clear Cart
router.delete("/clear", authenticate, clearCart);

// Get Cart Total
router.get("/total", authenticate, totalDetail);

export default router;
