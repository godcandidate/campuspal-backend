import express from 'express';
import multer from "multer";
import {registerUser, loginUser, getUser, updateUser, logoutUser, updateUserProfilePicture, getTotalUsers, getTotalNormalUsers, getAllUsers} from '../controllers/userController.js';
import { registerOrganizer, getOrganizer, updateOrganizer, removeOrganizer, getNumberOfOrganizers, getAllOrganizerDetails, verifyOrganizer } from '../controllers/organizerController.js';
import { createEvent, getAllEvents, getOrganizerEvents, getNumberOfEvents, getEvent, updateEvent, deleteEvent } from '../controllers/eventController.js';
import { registerBusiness, getBusiness, getUserBusiness,updateBusiness, deleteBusiness, getAllBusinesses, getNumberOfBusiness, uploadBusinessLogo, getAllOwnerDetails } from '../controllers/businessController.js';
import { addProduct, getBusinessProducts, getAllProducts, updateProduct, deleteProduct } from '../controllers/productController.js';
import {addlostCards} from '../controllers/lostandfoundController.js'
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
router.get("/business/count", getNumberOfBusiness);
router.get("/users", getAllUsers);
router.get("/organizers", getAllOrganizerDetails);
router.get("/business", getAllOwnerDetails);


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
router.post("/organizers/verify", Auth,  verifyOrganizer);

//Business route
router.post("/business/register", Auth, registerBusiness);
router.get("/business/profile", Auth, getUserBusiness);
router.post("/business/logo", Auth, upload.single('businessLogo'), uploadBusinessLogo);
router.get("/business/all", getAllBusinesses);
router.get("/business/:id", getBusiness);
router.put("/business/update", Auth, updateBusiness);
router.delete("/business/delete", Auth, deleteBusiness);


// Product route
router.post("/products/add", Auth, upload.single('productImage'), addProduct);
router.get("/products/business", Auth, getBusinessProducts);
router.get("/products/all", getAllProducts);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);


// Events route
router.get("/events/all", getAllEvents);
router.get("/events/:id", getEvent);
router.put("/events/:id", updateEvent);
router.delete("/events/:id", deleteEvent);
router.post("/events/add", Auth, upload.single('eventImage'),createEvent);
router.get("/events/organizer", Auth, getOrganizerEvents);

// Lost and found routes
router.get("/founditem/cards", getAllEvents);

export default router;
