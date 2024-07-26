import { arrayUnion, arrayRemove, query,doc, setDoc, addDoc, updateDoc, getDoc, getDocs, collection, deleteDoc, where} from "firebase/firestore";
import db from "../firestore.js";

// Notify claimaint and finder when there is a match
export async function cardMatchNotifier(req, res, item, founderID){
    try {
        // Get user data and id
        const {userId} = req.user;

        //Messages
        const usmessage = `Your claim for item [item name] has been matched! 
        Please contact the finder on, 
        ${item.contact}, to arrange for the return of your item.`;

        const fdmessage = `"Your found item, ${item.name}, has been claimed! 
        You will be contacted soon by claimant`;

        // User message
        const user_message = 
            {
                "title": "Item Match found", // or other types like new_item, claim_made, etc.
                "recipientId": userId,
                "message": usmessage,
                "createdAt": new Date().toISOString(),
                "isRead": false
              }
        // User message
        const finder_message = 
            {
                "title": "Item Claim Made", // or other types like new_item, claim_made, etc.
                "recipientId": item.finderID,
                "message": fdmessage,
                "createdAt": new Date().toISOString(),
                "isRead": false
              }


        // add notifications to notifications firestore
        await addDoc(collection(db, "notifications"), user_message);
        await addDoc(collection(db, "notifications"), finder_message);
    
        return;
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: "Sending notifications failed on firebase" });
     }  
  }

// Get all user notifications
export async function getUserNotifications(req, res){
    try {
        // Get business data and id
        const {userId} = req.user;
        let notificationRef = collection(db, "notifications");

        // Query for products where creator field matches userId
        const q = query(notificationRef, where("recipientId", "==", userId));
      
        const notificationSnap = await getDocs(q);
       
        // Check if user has products
        if (!notificationSnap.docs) {
            return res.status(404).send({ error: "No notifications" });   
        }

        const notifications = notificationSnap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

        return res.status(200).send(notifications);
        
        
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: "Retrieving user notifications from firebase failed" });
    }  
}


