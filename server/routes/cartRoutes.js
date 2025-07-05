import express from "express";
import authenticate from "../middleware/authMiddleware.js";
import {
  addCart,
  clearCart,
  getCart,
  removeCart,
  totalDetail,
} from "../controllers/cartController.js";
import wrapAsync from "../utils/wrapAsync.js";

const router = express.Router();

// Get Cart
router.get("/", authenticate, wrapAsync(getCart));

// Add to Cart
router.post("/add", authenticate, wrapAsync(addCart));

// Remove from Cart
router.delete("/remove/:productId", authenticate, wrapAsync(removeCart));

// Clear Cart
router.delete("/clear", authenticate, wrapAsync(clearCart));

// Get Cart Total
router.get("/total", authenticate, wrapAsync(totalDetail));

export default router;
