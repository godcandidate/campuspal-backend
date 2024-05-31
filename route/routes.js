import express from 'express';


const router = express.Router();


router.get('/', (req, res) => {
  res.status(201).json("Home GET Request");
});

export default router;
