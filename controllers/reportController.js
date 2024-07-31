import { collection, collectionGroup, addDoc, doc, setDoc, updateDoc, getDoc, getDocs, query, where, deleteDoc, limit} from "firebase/firestore";


import {uploadFile, deleteFile} from "./assetController.js";
import db from "../firestore.js";

// Create an event
export async function createReport(req, res) {
    try {
      const { userId} = req.user;

      const { objectId, type, message, date} = req.body;

      //Report
      const report = {
        objectId,
        type,
        message,
        date,
        reporterId: userId
      }

      // add event on firestore
      await addDoc(collection(db, "reports"), report);

      res.status(200).send({ msg: "Report created successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Creating new report failed on firebase" });
    }
  }

// Get all reports
export async function getAllReports(req, res) {
    try {
      let eventRef = collection(db, "reports");
    
      let q = collection(db, "reports");
  
      
      // Extract query parameters from request
      const { type} = req.query;
  
      // Exact matches
      if (type) {
        q = query(eventRef, where("type", "==", type));
      }

  
      // Execute the query
      const querySnapshot = await getDocs(q);
  
      // Extract data and IDs
      const reportsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      res.status(200).send({reportsData});
    } catch (error) {
      console.error("Error retrieving reports:", error); 
      res.status(500).send({ error: "Reports retrieval failed" });
    }
  }