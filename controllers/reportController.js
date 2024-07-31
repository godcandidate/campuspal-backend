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