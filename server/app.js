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
import adminRoutes from './routes/adminRoute.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

// Connect to MongoDB
connectDB();

// Static files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// CORS
const allowedOrigins = [
  'http://localhost:5173',
  'https://cloth-ora-app.vercel.app',
  'https://cloth-ora-app-git-main-kaushik-ladumors-projects.vercel.app',
  'https://cloth-ora-971q1ps8t-kaushik-ladumors-projects.vercel.app'

];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Passport
initializePassport(passport);
app.use(passport.initialize());

// Routes
app.get('/', (req, res) => {
  res.send('Home Route');
});

// API Routes - Add error handling for route registration
try {
  app.use('/product', productRoutes);
  app.use('/auth', authRoutes);
  app.use('/profile', userRoutes);
  app.use('/cart', cartRoutes);
  app.use('/order', orderRoutes);
  app.use('/admin', adminRoutes);
} catch (err) {
  console.error('Route registration failed:', err);
  process.exit(1);
}

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
