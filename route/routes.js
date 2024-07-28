import express from 'express';
import multer from "multer";
import {registerUser, loginUser, getUser, updateUser, logoutUser, updateUserProfilePicture, getTotalUsers, getTotalNormalUsers, getAllUsers} from '../controllers/userController.js';
import { registerOrganizer, getOrganizer, updateOrganizer, removeOrganizer, getNumberOfOrganizers, getAllOrganizerDetails, verifyOrganizer } from '../controllers/organizerController.js';
import { createEvent, getAllEvents, getOrganizerEvents, getNumberOfEvents, getEvent, updateEvent, deleteEvent } from '../controllers/eventController.js';
import { registerBusiness, getBusiness, getUserBusiness,updateBusiness, deleteBusiness, getAllBusinesses, getNumberOfBusiness, uploadBusinessLogo, getAllOwnerDetails, verifyOwner } from '../controllers/businessController.js';
import { addProduct, getBusinessProducts, getNumberOfProducts, getAllProducts, updateProduct, deleteProduct, getProduct } from '../controllers/productController.js';
import {addlostCards, getUserFoundItems, uploadItemImage, updateFoundItem, deleteItem, getAllFoundItems, claimFoundCard, getNumberOfFoundItems, getAllFoundItemsDetail} from '../controllers/lostandfoundController.js'
import { getUserNotifications } from '../controllers/notificationController.js';

import Auth from '../middleware/auth.js';

// handles files upload
const upload = multer({storage: multer.memoryStorage()});

const router = express.Router();


router.get('/', (req, res) => {
  res.status(201).json("Home GET Request");
});

/* ADMINSTRATIVE ROUTES */
//Main dashbaord
router.get("/users/all", getTotalUsers);
router.get("/users/count", getTotalNormalUsers);
router.get("/organizers/count", getNumberOfOrganizers);
router.get("/users", getAllUsers);
router.get("/foundItems/count", getNumberOfFoundItems);


//Events
router.get("/organizers", getAllOrganizerDetails);
router.get("/events/count", getNumberOfEvents);

//Businesses
router.get("/business", getAllOwnerDetails);
router.get("/business/count", getNumberOfBusiness);
router.get("/products/count", getNumberOfProducts);

//Lost and found
router.get("/foundItems/all", getAllFoundItemsDetail);


/* SPECIFIC ROUTES */
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
router.post("/business/verify", Auth, verifyOwner);


// Product route
router.post("/products/add", Auth, upload.single('productImage'), addProduct);
router.get("/products/business", Auth, getBusinessProducts);
router.get("/products/all", getAllProducts);
router.get("/products/:id", getProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);


// Events route
router.get("/events/all", getAllEvents);
router.get("/events/organizer", Auth, getOrganizerEvents);
router.post("/events/add", Auth, upload.single('eventImage'),createEvent);
router.get("/events/:id", getEvent);
router.put("/events/:id", updateEvent);
router.delete("/events/:id", deleteEvent);


// Lost and found routes
router.post("/founditems/card", Auth, addlostCards);
router.get("/founditems/user", Auth, getUserFoundItems);
router.post("/founditems/upload-picture", upload.single('template'), uploadItemImage);
router.put("/founditems/:id", updateFoundItem);
router.delete("/founditems/:id", deleteItem);
router.get("/founditems", getAllFoundItems);
router.post("/founditems/claimcard/:id", Auth, claimFoundCard);


//Notifications
router.get("/notifications/user",Auth, getUserNotifications);

export default router;
