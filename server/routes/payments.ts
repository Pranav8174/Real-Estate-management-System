import { Request, Response } from 'express';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.Razorpay_key_id, // Corrected fallback key_id
  key_secret: process.env.Razorpay_key_secret,
});

console.log(process.env.Razorpay_key_id);
console.log(process.env.Razorpay_key_secret);

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { amount, currency } = req.body;
    if (!amount) {
      return res.status(400).json({ message: 'Amount is required' });
    }
    const order = await razorpay.orders.create({
      amount: amount, // amount in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    });
    res.json(order);
  } catch (error: any) {
    console.error("Razorpay error:", error); // Add this line
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};