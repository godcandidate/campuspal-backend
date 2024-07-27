import { collection, collectionGroup, addDoc, doc, setDoc, updateDoc, getDoc, getDocs, query, where, deleteDoc, limit} from "firebase/firestore";

import {uploadFile, deleteFile} from "./assetController.js";
import db from "../firestore.js";

// Create an event
export async function createEvent(req, res) {
    try {
      const { userId} = req.user;
  
      // Upload the event image
      const fileData = await uploadFile(req, res, firebasePath);
  
      if (!fileData) {
        res.status(400).send({ error: "No event image details" });
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
export async function getAllEvents(req, res) {
  try {
    let eventRef = collection(db, "events");
  
    let q = collection(db, "events");

    
    // Extract query parameters from request
    const { name, category, startdate } = req.query;

    // Exact matches
    if (name) {
      q = query(eventRef, where("name", "==", name));
    }
    if (category) {
      q = query(eventRef, where("category", "==", category));
    }
    if (startdate) {
      // Handle start date filtering (assuming a "date" field)
      const startDate = new Date(startdate); // Parse start date string
      q = query(eventRef, where("category", "==", category));
      //query = query.where("date", ">=", startDate); // Greater than or equal to
    }

    // Execute the query
    const querySnapshot = await getDocs(q);

    // Extract data and IDs
    const eventsData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).send({eventsData});
  } catch (error) {
    console.error("Error retrieving events:", error); 
    res.status(500).send({ error: "Events retrieval failed" });
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

      if (eventData.length === 0) {
        return res.status(404).send({ msg: "No organizer events found" });
      }
      
      res.status(200).send({eventData});
    
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

// view  all details of an event
export async function getEvent(req, res){
  try {

      // Get user data and id 
      const eventId = req.params.id;
      
      const userRef = doc(db, "events", eventId);
      const userSnap = await getDoc(userRef);

      // Event details
      const event = userSnap.data();
      const organizerId = event.creator;

      //Organizer details
      const organizerRef = doc(db, "organizers", organizerId);
      const organizerSnap = await getDoc(organizerRef);
      const organizer = organizerSnap.data();
      
      return res.status(200).send({...event, ...organizer});
      
  } catch (error) {
      console.log(error);
      return res.status(500).send({ error: "Event retrieval failed on firebase failed" });
  }
}

//update an event
export async function updateEvent(req, res){
  try {

      // Get user data and id 
      const userData = req.body;
      const eventId = req.params.id;
     
      const userRef = doc(db, "events", eventId);
      await updateDoc(userRef, userData);

      return res.status(200).send({ msg: "Event details updated successfully"});
  } catch (error) {
      console.log(error);
      return res.status(500).send({ error: "Event update on firebase failed" });
  }
}

// delete an event
export async function deleteEvent(req, res){
  const eventId = req.params.id;

  if (!eventId) {
    return res.status(400).send({ error: 'Missing event ID' });
  }

  try {

    const eventRef = doc(db, "events", eventId);
    const docSnapshot = await getDoc(eventRef);

    //get event image path
    const eventData = docSnapshot.data();
    const firebasePath = eventData.imagePath;
  
    // delete the event image from storage
    await deleteFile(req, res, firebasePath);
    
    // delete event from firestore
    await deleteDoc(docSnapshot.ref);

    res.status(200).send({msg: "Event deleted successfully"});
    
  } catch (error) {
    console.log(error);
    res.status(500).send({error:"Event deletion failed"});
  }
}