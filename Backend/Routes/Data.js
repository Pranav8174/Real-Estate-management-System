import express from 'express';
const router=express.Router();
import { getDb } from '../db.js';



router.use(express.json());

router.get('/cards',async (req,res)=>{
   try {
    console.log('GET /data/cards route hit');
     
       const data=await getDb('cards').find().toArray();
       if (!data || data.length === 0) {
        return res.status(404).json({ message: 'No data found in the database' });
    }
       return res.status(200).json({data:data});
   } catch (error) {
       console.log(error);
       res.status(500).json({"Internal Server Error ":error});
   }
});

router.post('/addProperty',  async (req, res) => {
    try {
      const { title, location, price,image, description } = req.body;
     
      if (!title || !location || !price || !image || !description) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
  
      const db = getDb('cards');
      const newProperty = {
        title,
        location,
        price,
        desc:description,
        img: image, 
        createdAt: new Date()
      };
  
      const result = await db.insertOne(newProperty);
  
      if (result.insertedId) {
        const insertedProperty = await db.findOne({ _id: result.insertedId });
        return res.status(201).json({
          message: 'Property added successfully',
          property: insertedProperty
        });
      } else {
        return res.status(500).json({ message: 'Failed to insert property' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
export default router;