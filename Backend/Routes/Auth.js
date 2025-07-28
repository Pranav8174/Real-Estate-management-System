import express from 'express';  
import jwt from 'jsonwebtoken';
import { getDb } from '../db.js';  
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
dotenv.config();

const router = express.Router();
router.use(cookieParser());
const JWT_SECRET = 'a3v5$7Y!z*2Dh@1jL%4O*8t@dU8PqL0oM9W9kZgR*3JvX!2KpCq5H3';


const otpStorage = {}; 

const generateToken = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: '1h' });

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendOtpEmail = async (email, otp) => {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP for Verification',
        text: `Your OTP is: ${otp}`,
    });
};

router.post('/signup', async (req, res) => {
    try {
        const { email, password } = req.body;
        const profiles = await getDb('profiles');
        const user = await profiles.findOne({ email });
        if (user) return res.status(400).json({ msg: "User Already Exists !!! " });

        const hashpassword = await bcrypt.hash(password, 10);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        otpStorage[email] = { otp, password: hashpassword };

        await sendOtpEmail(email, otp);

        res.status(200).json({ msg: 'OTP has been sent to your email. Please verify to proceed.' });
    } catch (error) {
        console.log("error : ", error);
        return res.status(500).json({ msg: 'User Not Registered !!!' });
    }
});

router.post('/verifyOTP', async (req, res) => {
    try {
        const { email, otp,password,isSignup } = req.body;
        if (!otpStorage[email] || otpStorage[email].otp !== otp) {
            return res.status(400).send('Invalid or Expired OTP');
        }

        
        if(isSignup){
            const profiles = await getDb('profiles');
            const hashpassword = await bcrypt.hash(password, 10);
        await profiles.insertOne({ email, password:hashpassword });
    }
        delete otpStorage[email];


        const token = generateToken(email);
        res.cookie('auth_token', token, { httpOnly: false, maxAge: 3600000, secure: false, path: '/' }); 
        res.cookie('email', email, { httpOnly: false, maxAge: 3600000, secure: false, path: '/' }); 
        return res.status(200).json({ msg: 'OTP Verified! User Registered Successfully.', token });
    } catch (error) {
        console.log("error : ", error);
        return res.status(500).json({ msg: 'Error during OTP verification.' });
    }
});

router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        const profiles = await getDb('profiles');
        const user = await profiles.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'User Not Registered !!!' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid Password !!!' });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        otpStorage[email] = { otp };

        await sendOtpEmail(email, otp);

        return res.status(200).json({ msg: 'OTP has been sent to your email. Please verify to proceed.' });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ msg: 'User not logged in' });
    }
});

router.post('/verifyOTP', async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!otpStorage[email] || otpStorage[email].otp !== otp) {
            return res.status(400).send('Invalid or Expired OTP');
        }
        delete otpStorage[email];

        const token = generateToken(email);
        res.cookie('auth_token', token, { httpOnly: true, maxAge: 3600000, secure: true }); 
        return res.status(200).json({ msg: 'OTP Verified! Login Successful.', token });
    } catch (error) {
        console.log(error);
        return res.status(500).send('Error during OTP verification.');
    }
});

export default router;
