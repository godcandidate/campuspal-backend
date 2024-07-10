import { arrayUnion, arrayRemove, query,doc, setDoc, updateDoc, getDoc, getDocs, collection, deleteDoc, where} from "firebase/firestore";
import db from "../firestore.js";
import {uploadFile} from "./assetController.js";

//Register business
export async function registerBusiness(req, res){
    try {
        // Get user data and id
        const {userId} = req.user;
        const {name, description, items, category} = req.body;

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
            category: category,
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

//Delete user business details
export async function deleteBusiness(req, res){
    try {
        const businessId = req.params.id;

        if (!eventIdID) {
          return res.status(400).send({ error: 'Missing event ID' });
        }

        const businessRef = doc(db, "business", businessId);
        const docSnapshot = await getDoc(businessRef);
      
        //get event image path
        const businessData = docSnapshot.data();
        const businessImage = businessData.imagePath;
          
        //Get event image reference from firebase storage
        const imageRef = ref(storage, businessImage);
 
        //Deleting objects from storage
        await deleteObject(imageRef);
        await deleteDoc(docSnapshot.ref);

         //Remove owner role from user roles
         const userRef = doc(db, "users", businessId);
         const removedRole = "owner";
         await updateDoc(userRef, {
         roles: arrayRemove(removedRole)
         });
      
        res.status(200).send({msg: "Business deleted successfully"});
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: "Business update on firebase failed" });
    }
}

// Get all business
export async function getAllBusinesses(req, res) {
    try {
      let eventRef = collection(db, "business");
    
      let q = collection(db, "business");
  
      
      // Extract query parameters from request
      const { name, category, startdate } = req.query;
  
      // Exact matches
      if (name) {
        q = query(eventRef, where("name", "==", name));
      }
      if (category) {
        q = query(eventRef, where("category", "==", category));
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
      console.error("Error retrieving business:", error); 
      res.status(500).send({ error: "Businesses retrieval failed" });
    }
  }