import { collection, collectionGroup, addDoc, doc, setDoc, updateDoc, getDoc, getDocs, query, where , limit} from "firebase/firestore";

import {uploadFile} from "./assetController.js";
import db from "../firestore.js";

// Create an event
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

// Get all  events
export async function getAllEvents(req, res){
  try {
    const querySnapshot = await getDocs(collection(db, "events"));

    // Extract data and IDs in a single step using destructuring and map
    const eventsData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    
    res.status(200).send({
      count: eventsData.length,
      data: eventsData,
    });
    
  } catch (error) {
    res.status(500).send({error:"Events retireval failed"});
  }
}

// Get user created events
export async function getOrganizerEvents(req, res){
  try {

      const { userId } = req.user;
      
      // query to filter by creator (userId)
      const q = query(collection(db, "events"), where("creator", "==", userId));

      // Get matching events
      const querySnapshot = await getDocs(q);

      // Extract data and IDs in a single step using destructuring and map
      const eventData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      res.status(200).send({
        msg : "Organizer events retrieved Successfully",
        count: eventData.length,
        data: eventData,
      });
    
  } catch (error) {
    console.log(error);
    res.status(500).send({error:"Event retireval failed"});
  }

}

// Get total number of events uploaded
export async function getNumberOfEvents(req, res) {
  try {
    // Get the number of documents in the "events" collection
    const querySnapshot = await getDocs(collection(db, "events"));
    const eventCount = querySnapshot.size;

    res.status(200).send({
      total_events: eventCount,
    });
  } catch (error) {
    res.status(500).send({ error: "Events retrieval failed" });
  }
}



