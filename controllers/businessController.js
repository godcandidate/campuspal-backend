import { arrayUnion, arrayRemove, query,doc, setDoc, updateDoc, getDoc, getDocs, collection, deleteDoc, where} from "firebase/firestore";
import db from "../firestore.js";
import {uploadFile, deleteFile} from "./assetController.js";

//Register business
export async function registerBusiness(req, res){
  try {
      // Get user data and id
      const {userId} = req.user;
      const {name, description, address, contact} = req.body;

      // update user to business owner role
      const userRef = doc(db, "users", userId);
      const newRole = "owner";
      await updateDoc(userRef, {
          "roles": arrayUnion(newRole)
        });

      const businessData = {
          name: name,
          description: description,
          address: address,
          contact: contact
      };
      
      // add user to business firestore
      await setDoc(doc(db, "business", userId),businessData);
      return res.status(200).send({ msg: "User business signed up successfully" });

  } catch (error) {
      console.log(error);
      return res.status(500).send({ error: "Signing user business failed on firebase failed" });
  }  
}

//Get user business details
export async function getUserBusiness(req, res){
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
      
        // Get user data and  user id 
        const userData = req.body;
        const { userId} = req.user;
       
        const userRef = doc(db, "business", userId);
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
          const { userId} = req.user;

          // Get business by userId
          const businessRef = doc(db, "business", userId);
          const docSnapshot = await getDoc(businessRef);

            // Check for business logo and delete 
          const businessData = docSnapshot.data();
         
          if (businessData.imagePath){
            await deleteFile(req, res, businessData.imagePath);
          }

          // delete business
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
      const businessData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      res.status(200).send({businessData});
    } catch (error) {
      console.error("Error retrieving business:", error); 
      res.status(500).send({ error: "Businesses retrieval failed" });
    }
  }

// Get business details
export async function getBusiness(req, res){
    try {
  
        // Get user data and id 
        const businessId = req.params.id;
        
        const userRef = doc(db, "business", businessId);
        const userSnap = await getDoc(userRef);
  
          // Organizer exists
          if (userSnap.exists()) {
              return res.status(200).send(userSnap.data());
          }
        
          return res.status(404).send({msg:"Business not found"});
        
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: "Event retrieval failed on firebase failed" });
    }
}

// Get total number of business
export async function getNumberOfBusiness(req, res) {
    try {
      // Get the number of documents in the "events" collection
      const querySnapshot = await getDocs(collection(db, "business"));
      const businessCount = querySnapshot.size;
  
      res.status(200).send({
        total_businesses: businessCount
      });
    } catch (error) {
      res.status(500).send({ error: "Business retrieval failed" });
    }
  }

// Upload business logo
export async function uploadBusinessLogo(req, res) {
  try {
    const { userId} = req.user;
    const firebasePath = "business-logos";

    // Get business
    const businessRef = doc(db, "business", userId);

    // Check if a logo already exists and delete 
    const docSnapshot = await getDoc(businessRef);
    const businessData = docSnapshot.data();

    if (businessData.imagePath){
      await deleteFile(req, res, businessData.imagePath);
    }
    
    // Upload business logo
    const fileData = await uploadFile(req, res, firebasePath);

    if (!fileData) {
      res.status(403).send({ error: "No logo details" });
    }

    //Logo details
    const imageData = {
      imagePath: fileData.filePath,
      imageURL:fileData.fileURL
    };
    
    // update business on firestore
    await updateDoc(businessRef, imageData);

    res.status(200).send({ msg: "Business logo updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Uploading new business logo failed on firebase" });
  }
}

// Get all owner details
export async function getAllOwnerDetails(req, res) {
  try {
      const businessRef = collection(db, "business");
      const businessSnapshots = await getDocs(businessRef);
      const business = [];
  
      for (const businessSnapshot of businessSnapshots.docs) {
          const businessId = businessSnapshot.id;

          //Get user ref
          const userRef = doc(db, "users", businessId);
          const userSnap = await getDoc(userRef);

          //Get product ref
          let productRef = collection(db, "products");
          const q = query(productRef, where("businessID", "==", businessId));
          const querySnapshot = await getDocs(q);

          if (!userSnap.exists) {
              continue; // Skip if user not found
          }
      
          // Get name, organization name and number of events
          const userName = userSnap.data().name;
          const businessName = businessSnapshot.data().name;
          const productCount = querySnapshot.size;
      
          business.push({ owner: userName, name: businessName, productCount });
      }
      
      return res.status(200).send({ businesses : business});
      
  } catch (error) {
      console.log(error);
      return res.status(500).send({ error: "Getting owner details failed on firebase"});
      
  } 
}

// Verify business owner
export async function verifyOwner(req, res){
  try{
      const role = 'owner';

      // Get user id
      const {userId} = req.user;
      
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      const userRoles = userSnap.data().roles;

      // check if user role
      const isOwner = userRoles.includes(role);

      if(isOwner){
          res.status(200).send({ msg: "Access granted" });
      }
      else{
          res.status(403).send({ msg: "Access denied, user not a business owner" });
      }

  }
  catch (error) {
      console.log(error);
      res.status(500).send({ error: "Verification failed on firebase" });
  }
}