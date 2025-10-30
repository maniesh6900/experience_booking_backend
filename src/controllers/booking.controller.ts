import type { Request, Response } from 'express';
import { client } from '../prisma/index.js';


export const createBooking = async (req: Request, res: Response) => {
  try {
    const { fullName, email, experienceId, date, timeSlot, promoCode } = req.body;
    
    // Validate input
    
    
    // Check if experience exists
    const experience = await client.experience.findFirst({
      where : {
        id : experienceId,
      }
    });
    if (!experience) {
      return res.status(404).json({ error: 'Experience not found' });
    }
    
    // Check if slot is available
    const existingBooking = await client.booking.findFirst({
      where: { experience: { id: experienceId }, date, timeSlot },
    });
    
    if (existingBooking) {
      return res.status(409).json({ error: 'This slot is already booked' });
    }
    
    // Calculate total price
    let totalPrice = experience.price;
    if (promoCode) {
      // In a real app, we'd validate the promo code here
      // For simplicity, we'll apply a fixed discount
      if (promoCode === 'SAVE10') {
        totalPrice = totalPrice * 0.9; // 10% off
      } else if (promoCode === 'FLAT100') {
        totalPrice = Math.max(0, totalPrice - 100); // $100 off
      }
    }
    
    // Create booking
    const booking = await client.booking.create({
      data : {
        fullName,
        email,
        date,
        timeSlot,
        totalPrice : totalPrice.toString(),
        promoCode: promoCode || null,
        experienceId,
      },
    });
        
    res.status(201).json({
      success: true,
      bookingId: booking.id,
      message: 'Booking confirmed!',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
};