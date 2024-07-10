import express from 'express';
import multer from "multer";
import {registerUser, loginUser, getUser, updateUser, logoutUser, updateUserProfilePicture, getTotalUsers, getTotalNormalUsers} from '../controllers/userController.js';
import { registerOrganizer, getOrganizer, updateOrganizer, removeOrganizer, getNumberOfOrganizers } from '../controllers/organizerController.js';
import { createEvent, getAllEvents, getOrganizerEvents, getNumberOfEvents, getEvent, updateEvent, deleteEvent } from '../controllers/eventController.js';
import { registerBusiness, getBusiness, updateBusiness, deleteBusiness } from '../controllers/ownerController.js';
import Auth from '../middleware/auth.js';

// handles files upload
const upload = multer({storage: multer.memoryStorage()});

const router = express.Router();


router.get('/', (req, res) => {
  res.status(201).json("Home GET Request");
});

// Administrative routes
router.get("/users/all", getTotalUsers);
router.get("/users/count", getTotalNormalUsers);
router.get("/events/count", getNumberOfEvents);
router.get("/organizers/count", getNumberOfOrganizers);

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
router.post("/organizers/remove", Auth,  removeOrganizer);

//Business route
router.post("/business/register", Auth, upload.single('businessPoster'), registerBusiness);
router.get("/business/profile", Auth, getBusiness);
router.put("/business/:id", Auth, updateBusiness);
router.delete("/business/:id", deleteBusiness);

// Events route
router.get("/events/all", getAllEvents);
router.get("/events/:id", getEvent);
router.put("/events/:id", updateEvent);
router.delete("/events/:id", deleteEvent);
router.post("/events/add", Auth, upload.single('eventImage'),createEvent);

router.get("/events/organizer", Auth, getOrganizerEvents);


export default router;
