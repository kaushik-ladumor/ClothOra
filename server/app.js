import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import passport from 'passport';
import path from 'path';

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

// ✅ Connect to MongoDB
connectDB();

// ✅ Serve uploaded images
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// ✅ Setup CORS
const allowedOrigins = [
  'http://localhost:5173',
  'https://cloth-ora-l6i8.vercel.app',
  'https://cloth-d821kfjmu-kaushik-ladumors-projects.vercel.app'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
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

// ✅ Handle preflight requests (important for CORS)
app.options('*', cors(corsOptions));

// ✅ Parse JSON payloads
app.use(express.json());

// ✅ Initialize Passport.js
initializePassport(passport);
app.use(passport.initialize());

// ✅ Test Route
app.get('/', (req, res) => {
  res.send('Welcome to ClothOra API');
});

// ✅ API Routes
app.use('/product', productRoutes);
app.use('/auth', authRoutes);
app.use('/profile', userRoutes);
app.use('/cart', cartRoutes);
app.use('/order', orderRoutes);
app.use('/admin', adminRoutes);

// ✅ Start server
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
