import { collection, collectionGroup, addDoc, doc, setDoc, updateDoc, getDoc, getDocs, query, where , limit} from "firebase/firestore";

import {uploadFile} from "./assetController.js";
import db from "../firestore.js";


export async function createEvent(req, res) {
    try {
      const { userId, userRoles} = req.user;

      // check if user is an organizer
      const isOrganizer = userRoles.includes('organizer');
      if (!isOrganizer){
            return res.status(403).send({ error:"Access denied, user not an organizer"});
        }

      const firebasePath = "event-pictures";
  
      // Upload the event image
      const fileData = await uploadFile(req, res, firebasePath);
  
      if (!fileData) {
        res.status(403).send({ error: "No event image details" });
      }

      //Event details
      const eventData = {
        creator: userId,
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        location: req.body.location,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        contact: req.body.contact,
        is_active: true,
        imagePath: fileData.filePath,
        imageURL:fileData.fileURL
      };
      
      // add event on firestore
      await addDoc(collection(db, "events"), eventData);

      res.status(200).send({ msg: "Event created successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Creating new event failed on firebase" });
    }
  }

