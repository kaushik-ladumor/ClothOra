import Razorpay from 'razorpay';
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.error('❌ Razorpay credentials missing in environment variables');
  throw new Error('Razorpay credentials not configured');
}

// ✅ Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

console.log('✓ Razorpay initialized with key:', process.env.RAZORPAY_KEY_ID);

export default razorpay;