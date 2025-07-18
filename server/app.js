import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import passport from 'passport';
import path from "path";

import connectDB from './config/db.js';
import initializePassport from './config/passport.js';
import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoute.js'

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

// Connect to MongoDB
connectDB();

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Enable CORS for frontend access
app.use(cors({
  origin: [
    'http://localhost:5173', // React frontend (local development)
    'https://cloth-ora-l6i8.vercel.app', // Your Vercel deployment
    'https://cloth-d821kfjmu-kaushik-ladumors-projects.vercel.app' // The URL from the error
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON payloads
app.use(express.json());

// Initialize Passport.js
initializePassport(passport);
app.use(passport.initialize());

// Base route
app.get('/', (req, res) => {
  res.send('Welcome to home page');
});

// API Routes
app.use('/product', productRoutes);
app.use('/auth', authRoutes);
app.use('/profile', userRoutes);
app.use('/cart', cartRoutes);
app.use('/order', orderRoutes);
app.use('/admin', adminRoutes);

// Start server
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
