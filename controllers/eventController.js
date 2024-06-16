import { collection, arrayUnion, addDoc, doc, setDoc, updateDoc, getDoc, getDocs, query, where , limit} from "firebase/firestore";
import db from "../firestore.js";


// Get user profile
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
          })

        // add user to organizers firestore
        await addDoc(collection(db, "organizers"), {
            userId : userId,
            name: name,
            description: description
        });
       
        return res.status(200).send({ msg: "User signed up as organizer successfully" });

    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: "Signing user up as an organizer to firebase failed" });
    }  
}