import type { Request, Response } from 'express';
import { client } from '../prisma/index.js';


// Get all experiences
export const getExperiences = async (req: Request, res: Response) => {
  try {
    const experiences = await client.experience.findMany();
    res.json(experiences);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch experiences' });
  }
};

// Get experience details with available slots
export const getExperienceDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if(!id) {
      return res.status(400).json({ error: 'Experience ID is required' });
    }
    const experience = await client.experience.findFirst({
      where: { 
        id: id },
    });
    
    if (!experience) {
      return res.status(404).json({ error: 'Experience not found' });
    }

    // Generate available dates (next 30 days)
    const today = new Date();
    const availableDates = [];
    for (let i = 1; i <= 30; i+=1) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Format as YYYY-MM-DD
      const dateString = date.toISOString().split('T')[0];
      
      // Check if this date has available slots
      const existingBookings = await client.booking.findMany({
        where: { 
          experienceId: id,
        },
      });
      if(existingBookings.length === 0) {
        availableDates.push({
          date: dateString,
          isAvailable: true,
        });
        continue;
      }
      
      // Assume 5 slots per day (10AM, 12PM, 2PM, 4PM, 6PM)
      const allSlots = ['10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM', '6:00 PM'];
      const bookedSlots = existingBookings?.map((b : any) => b.timeSlot);
      const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));
      
      if (availableSlots.length > 0) {
        availableDates.push({
          date: dateString,
          availableSlots,
          isAvailable: true,
        });
      }
    }
    
    res.json({
      ...experience,
      availableDates,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch experience details' });
  }
};