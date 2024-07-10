import { arrayUnion, arrayRemove, doc, setDoc, updateDoc, getDoc, getDocs, collection, deleteDoc} from "firebase/firestore";
import db from "../firestore.js";
import {uploadFile} from "./assetController.js";

//Register business
export async function registerBusiness(req, res){
    try {
        // Get user data and id
        const {userId} = req.user;
        const {name, description, items} = req.body;

        const firebasePath = "business-posters";
  
        // Upload the event image
        const fileData = await uploadFile(req, res, firebasePath);
        if (!fileData) {
            res.status(403).send({ error: "No business poster details" });
        }

        const userRef = doc(db, "users", userId);

        // update user to organizer role
        const newRole = "owner";
        await updateDoc(userRef, {
            "roles": arrayUnion(newRole)
          });

        const businessData = {
            name: name,
            description: description,
            items: items,
            imagePath: fileData.filePath,
            imageURL:fileData.fileURL
        };
        
        // add user to organizers firestore
        await setDoc(doc(db, "business", userId),businessData);
        return res.status(200).send({ msg: "User business signed up successfully" });

    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: "Signing user business failed on firebase failed" });
    }  
}

//Get user business details
export async function getBusiness(req, res){
    try {
        // Get business data and id
        const {userId} = req.user;
        const userRef = doc(db, "business", userId);

        const userSnap = await getDoc(userRef);
     
        // Business exists
        if (userSnap.exists()) {
            const data = {
                businessId: userSnap.id,
                ...userSnap.data()
            }
            return res.status(200).send(data);
        }
        return res.status(404).send({ error: "Business does not exists" }); 
        
    } catch (error) {
        return res.status(500).send({ error: "Retrieving business details from firebase failed" });
    }  
}

//Update user business details
export async function updateBusiness(req, res){
    try {
  
        // Get user data and id 
        const userData = req.body;
        const businessId = req.params.id;
       
        const userRef = doc(db, "business", businessId);
        await updateDoc(userRef, userData);
  
        return res.status(200).send({ msg: "Business details updated successfully"});
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: "Business update on firebase failed" });
    }
  }