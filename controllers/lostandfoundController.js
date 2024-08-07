import { arrayUnion, arrayRemove, query,doc, setDoc, addDoc, updateDoc, getDoc, getDocs, collection, deleteDoc, where} from "firebase/firestore";
import db from "../firestore.js";
import {uploadFile, deleteFile} from "./assetController.js";
import { cardMatchNotifier } from "./notificationController.js";


//Adding a lost item card
export async function addlostCards(req, res){
    try {
        // Get user data and id
        const {userId} = req.user;
        const {type, category, index_number, name, dateOfBirth, ref_number, cpntact} = req.body;
    
        let imagePath;
        let imageURL;
        // check the type
        let sdata = {};
        if (type == "studentID"){
            sdata = {
                index_number: index_number,
                ref_number: ref_number,
                imagePath: "template-images/studentId.jpg",
                imageURL: "https://firebasestorage.googleapis.com/v0/b/cloudfunction-68be4.appspot.com/o/template-images%2FstudentId.jpg?alt=media&token=b7b6cd40-4a23-407d-b731-d1e757c1cffd"
            }
        }
        else if (type == "otherID"){
            sdata = {
                name: name,
                dateOfBirth: dateOfBirth,
                imagePath: "template-images/idcard.jpg",
                imageURL: "https://firebasestorage.googleapis.com/v0/b/cloudfunction-68be4.appspot.com/o/template-images%2Fidcard.jpg?alt=media&token=e9ce68e1-14e4-4da4-8f16-b6eb3d925b76"
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
            contact: contact,
            is_active : true,
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

// delete a found item
export async function deleteItem(req, res){
    const itemId = req.params.id;
  
    if (!itemId) {
      return res.status(400).send({ error: 'Missing item ID' });
    }
  
    try {
      const itemRef = doc(db, "foundItems", itemId);
      const docSnapshot = await getDoc(itemRef);
  

      // delete event from firestore
      await deleteDoc(docSnapshot.ref);
  
      res.status(200).send({msg: "Item deleted successfully"});
      
    } catch (error) {
      console.log(error);
      res.status(500).send({error:"Item deletion failed on firebase"});
    }
  }

//Get all founditems
export async function getAllFoundItems(req, res) {
    try {
      let eventRef = collection(db, "foundItems");
    
      let q = collection(db, "foundItems");
  
      
      // Extract query parameters from request
      const { name, category} = req.query;
  
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
      const items = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      res.status(200).send({items});
    } catch (error) {
      console.error("Retrieving items:", error); 
      res.status(500).send({ error: "Items retrieval failed on firebase" });
    }
  }

//Claim a found item
export async function claimFoundCard(req, res){
  const itemId = req.params.id;
  
    if (!itemId) {
      return res.status(400).send({ error: 'Missing item ID' });
    }
  
    try {

      const {ref_number, dateOfBirth} = req.body;
      
      //Get item data
      const itemRef = doc(db, "foundItems", itemId);
      const docSnapshot = await getDoc(itemRef);

      const item = docSnapshot.data();
      let name;
      let istrue;
        // Item type
        if (item.type === "studentID" & item.ref_number === ref_number) {
            istrue = true;
            name = item.index_number;
        }
        else if (item.type === "otherID" & item.dateOfBirth === dateOfBirth){
            istrue = true;
            name = item.name;
        }
        else{
            istrue = false;
        }

        const items = {
          name: name,
          contact: item.contact,
          finderID: item.founder
        }
        if (istrue) {
          
          // send notification
          const notifierPromise = cardMatchNotifier(req, res, items);
          res.status(200).send({ msg: "Item matched, check your notifications" });
          
          await notifierPromise;
        } else {
          res.status(404).send({ msg: "Item does not match" });
        }
  
    
    } catch (error) {
      console.log(error);
      res.status(500).send({error:"Item deletion failed on firebase"});
    }
}

//Number of found items
export async function getNumberOfFoundItems(req, res){
  try {
    
      const querySnapshot = await getDocs(collection(db, "foundItems"));
      const itemsCount = querySnapshot.size;
  
      res.status(200).send({
        total_items: itemsCount
      });

  } catch (error) {
      console.log(error);
    res.status(500).send({ error: "Number of found items retrieval failed" });
  }
}

//Get founditems details
export async function getAllFoundItemsDetail(req, res) {
    try {
        const itemRef = collection(db, "foundItems");
        const itemSnapshots = await getDocs(itemRef);
        const items = [];
    
        for (const itemSnapshot of itemSnapshots.docs) {
            const userId = itemSnapshot.data().founder;

            //Get user ref
            const userRef = doc(db, "users", userId);
            const userSnap = await getDoc(userRef);


            if (!userSnap.exists) {
                continue; // Skip if user not found
            }
        
            // Get finder name, category, type, unique name, isclaimed
            const userName = userSnap.data().name;
            const uniqueData = itemSnapshot.data().name || itemSnapshot.data().index_number ;
            const category = itemSnapshot.data().category;
            const type = itemSnapshot.data().type;
            const claimed = itemSnapshot.data().is_active;
        
            items.push({ finder: userName, uniqueData, category, type, claimed });
        }
        
        return res.status(200).send({ items});
        
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: "Getting found items details failed on firebase"});
        
    } 
  }
