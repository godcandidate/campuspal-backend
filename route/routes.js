import express from 'express';
import multer from "multer";
import {registerUser, loginUser, getUser, updateUser, logoutUser, updateUserProfilePicture} from '../controllers/userController.js';
import { registerOrganizer, getOrganizer, updateOrganizer, removeOrganizer } from '../controllers/organizerController.js';

import Auth from '../middleware/auth.js';

// handles files upload
const upload = multer({storage: multer.memoryStorage()});

const router = express.Router();


router.get('/', (req, res) => {
  res.status(201).json("Home GET Request");
});

// User routes
router.post("/users/register", registerUser);
router.post("/users/login", loginUser);
router.get("/users/profile", Auth, getUser);
router.put("/users/update", Auth, updateUser);
router.post("/users/logout", logoutUser);


//Asset routes
router.post("/users/upload-picture", Auth, upload.single('profilePicture'), updateUserProfilePicture);


//Organizers route
router.post("/organizers/register", Auth, registerOrganizer);
router.get("/organizers/profile", Auth, getOrganizer);
router.put("/organizers/update", Auth, updateOrganizer);
router.post("/organizers/remove", Auth, removeOrganizer);

// Events route


export default router;
