import { collection, collectionGroup, addDoc, doc, setDoc, updateDoc, getDoc, getDocs, query, where , limit} from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, signOut } from "firebase/auth";
import db from "../firestore.js";
import 'dotenv/config';

const auth = getAuth();


// Register user
export async function  registerUser(req, res){
    try {
        const { password, ...userData} = req.body;
        
        //check if user email exists
        const q = query(collection(db, "users"), where("email", "==", userData.email, limit(1)));     
        const userSnapshot = await getDocs(q);
      
        if (!userSnapshot.empty) {
            return res.status(400).send({ msg: "Email already exists" });
        }

        const userCredential = await createUserWithEmailAndPassword(auth, userData.email, password);
        const user = userCredential.user;
        await setDoc(doc(db, "users", user.uid), userData);

        //user id
        console.log('User signed up successfully:', user.uid);

        // send verification email
        await sendEmailVerification(user);
       
        return res.status(200).send({ msg: "User registered successfully", 
            verify: "Check email for verification code"}
        );
        
        
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: "User not registered" });
    }
};
