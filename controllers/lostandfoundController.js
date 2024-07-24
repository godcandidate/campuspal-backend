import { arrayUnion, arrayRemove, query,doc, setDoc, addDoc, updateDoc, getDoc, getDocs, collection, deleteDoc, where} from "firebase/firestore";
import db from "../firestore.js";
import {uploadFile, deleteFile} from "./assetController.js";


//Adding a lost item card
export async function addlostCards(req, res){
    try {
        // Get user data and id
        const {userId} = req.user;
        const {type, category, index_number, name, dateOfBirth, ref_number} = req.body;
    
        // check the type
        let sdata = {};
        if (type == "studentID"){
            sdata = {
                index_number: index_number,
                ref_number: ref_number
            }
        }
        else if (type == "otherID"){
            sdata = {
                name: name,
                dateOfBirth: dateOfBirth
            }
        }
        else{
            return res.status(403).send({ error: "Access denied, can only use studentID or otherID as a type" });
        }
        // Item details
        const itemData = {
            founder: userId,
            ...sdata,
            category: category,
            type: type,
            is_active : true
            //imagePath: fileData.filePath,
            //imageURL:fileData.fileURL
        };
        
        // add item to lostitems firestore
        await addDoc(collection(db, "foundItems"), itemData);
        return res.status(200).send({ msg: "Found item added up successfully" });
  
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: "Adding found item failed on firebase failed" });
     }  
  }

//Get all lost items uploaded by user
export async function getUserFoundItems(req, res){
    try {
        // Get user id
        const {userId} = req.user;

        //Retrieve user found items if any
        const itemRef = collection(db, "foundItems");
        const q = query(itemRef, where("founder", "==", userId));
        const querySnapshot = await getDocs(q);

        //check if user has a history of lost items
        const itemCount = querySnapshot.size;
        if(itemCount === 0){
            return res.status(404).send({msg: "user has not upload any found item" }); 
        }
     
        // Extract data and IDs
        const itemData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        return res.status(200).send({itemData }); 
        
    } catch (error) {
        return res.status(500).send({ error: "Retrieving business details from firebase failed" });
    } 
}

// update a lost item
export async function updateFoundItem(req, res){
    try {
  
        // Get user data and id 
        const itemData = req.body;
        const itemId = req.params.id;
        console.log("id: ",itemId);
       
        const itemRef = doc(db, "foundItems", itemId);
        await updateDoc(itemRef, itemData);
  
        return res.status(200).send({ msg: "Item details updated successfully"});
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: "Item update on firebase failed" });
    }
}

// Add image card
export async function uploadItemImage(req, res){
    try {
  
        const firebasePath = "template-images"
        // Upload the event image
      const fileData = await uploadFile(req, res, firebasePath);
  
      if (!fileData) {
        res.status(400).send({ error: "No event image details" });
      }
      return res.status(200).send({fileData});

    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: "Item uploading image on firebase failed" });
    }
}
