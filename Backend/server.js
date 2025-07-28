import express from 'express';
import dotenv from 'dotenv';
import passport from 'passport';
import session from 'express-session';
import cors from 'cors';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { connectDB } from './db.js'; 
import authUser from './Routes/Auth.js';
import dataUser from './Routes/Data.js';
import cookieParser from 'cookie-parser';
import Razorpay from 'razorpay';

dotenv.config(); 
const app = express();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: [process.env.FRONT_END,'https://estate-frontend-ten.vercel.app','https://estate-frontend-gdnic4lae-satyam-karns-projects.vercel.app','https://estate-frontend-6vfhnw188-satyam-karns-projects.vercel.app'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));
app.use('/auth',authUser);
app.use('/data',dataUser);

app.use(session({
  secret: 'uH9a#5E$3pY!8&xW2dVw*7R1aQmL0zXrF9Z8uSkqhsdhe',  
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_SECRET,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.VITE_BACKEND_API}/auth/google/callback`,
}, (accessToken, refreshToken, profile, done) => {
  console.log(profile);  
  return done(null, profile);
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.get('/', (req, res) => {
  res.send('Welcome to the Estate Backend API!');
});

app.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email'], 
}));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),  
  (req, res) => {
    res.redirect('http://localhost:5173/prop');  
  }
);

app.get('/profile', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).send('Unauthorized');
  }
  res.send(req.user); 
});

app.post("/create-order", async (req, res) => {
  const { amount, currency } = req.body;

  try {
    const order = await razorpay.orders.create({
      amount: amount * 100,  
      currency: currency || "INR",
    });

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const startServer = async () => {
  try {
    console.log('Attempting to connect to the database...');
    await connectDB();
    console.log('Connected to DB successfully!');

    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to connect to DB:', err.message);
    process.exit(1);
  }
};

startServer();

export default app;
