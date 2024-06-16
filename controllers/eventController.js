import { collection, arrayUnion, addDoc, doc, setDoc, updateDoc, getDoc, getDocs, query, where , limit} from "firebase/firestore";
import db from "../firestore.js";


// Register as an organizer
export async function registerOrganizer(req, res){
    try {
        // Get user data and id
        const {userId} = req.user;
        const {name, description} = req.body;

        const userRef = doc(db, "users", userId);

        // update user to organizer role
        const newRole = "organizer";
        await updateDoc(userRef, {
            "roles": arrayUnion(newRole)
          });

        const organizerData = {
            name: name,
            description: description
        };
        
        // add user to organizers firestore
        await setDoc(doc(db, "organizers", userId),organizerData);
        return res.status(200).send({ msg: "User signed up as organizer successfully" });

    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: "Signing user up as an organizer to firebase failed" });
    }  
}

// Get user profile
export async function getOrganizer(req, res){
    try {
        // Get organizer data and id
        const {userId} = req.user;
        const userRef = doc(db, "organizers", userId);

        const userSnap = await getDoc(userRef);

        // Organizer exists
        if (userSnap.exists()) {
            return res.status(200).send(userSnap.data());
        }
        return res.status(404).send({ error: "Organizer does not exists" }); 
        
    } catch (error) {
        return res.status(500).send({ error: "Retrieving organizer details from firebase failed" });
    }  
}

//update organizer details
// Update user profile
export async function updateOrganizer(req, res){
    try {

        // Get user data and id 
        const userData = req.body;
        const {userId} = req.user;
        
        const userRef = doc(db, "organizers", userId);
        
        await updateDoc(userRef, 
                userData);
        return res.status(200).send({ msg: "Organizer details updated successfully", userData  });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: "Organizer update on firebase failed" });
    }
}