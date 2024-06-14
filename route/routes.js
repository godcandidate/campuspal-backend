import express from 'express';
import multer from "multer";
import {registerUser, loginUser, getUser, updateUser, logoutUser} from '../controllers/userController.js';
import {uploadUserPicture} from '../controllers/assetController.js';

import Auth from '../middleware/auth.js';
import auths from '../middleware/auths.js';

// handles files upload
const upload = multer({storage: multer.memoryStorage()});

const router = express.Router();


router.get('/', (req, res) => {
  res.status(201).json("Home GET Request");
});

// User routes
router.post("/users/register", registerUser);
router.post("/users/login", loginUser);
router.get("/users/profile", auths, getUser);
router.put("/users/update", Auth, updateUser);
router.post("/users/logout", logoutUser);


//Asset routes
router.post("/users/upload-picture", Auth, upload.single('profilePicture'), uploadUserPicture);


export default router;
