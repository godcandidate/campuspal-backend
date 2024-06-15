import { collection, collectionGroup, addDoc, doc, setDoc, updateDoc, getDoc, getDocs, query, where , limit} from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, signOut } from "firebase/auth";
import jwt from 'jsonwebtoken';

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

// User login
export async function loginUser(req, res){
    try {
        const {email, password} = req.body;
    
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;


        // Create a Access token
        const accesstoken = jwt.sign(
            {
                userId: user.uid
            },
            process.env.JWT_ACCESS_TOKEN,
            { expiresIn: "1h" }
        );

        // Create a Access token
        const refreshtoken = jwt.sign(
            {
                userId: user.uid
            },
            process.env.JWT_REFRESH_TOKEN,
            { expiresIn: "24h" }
        );
       
       
        return res.status(200).send({ msg: "User logged in successfully", email,
        accesstoken});
        
        
    } catch (error) {
        return res.status(500).send({ error: "Login failed, invalid user details" });
    }

};

// Get user profile
export async function getUser(req, res){
    try {
        // Get user data and id
        const {userId} = req.user;
        const userRef = doc(db, "users", userId);

        const userSnap = await getDoc(userRef);

        // User exists
        if (userSnap.exists()) {
            return res.status(200).send(userSnap.data());
        }
        return res.status(404).send({ error: "User does not exists" });
        
        
        
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: "Retrieving user detail from firebase failed" });
    }  
}

// Update user profile
export async function updateUser(req, res){
    try {

        // Get user data and id 
        const userData = req.body;
        const {userId} = req.user;
        
        const userRef = doc(db, "users", userId);
        
        await updateDoc(userRef, 
                userData);
        return res.status(200).send({ msg: "User details updated successfully", userData  });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: "User update on firebase failed" });
    }
}
// User logout
export async function logoutUser(req, res) {
    try {
  
      return res.status(200).send({ msg: "User logged out successfully" });
    } catch (error) {

      return res.status(500).send({ error: "Logout failed" });
    }
  }

// User logout
export async function refreshtoken(req, res, next ) {
    try {
        const refreshToken = req.body;
        if (!refreshToken) {
        return res.status(403).send({ msg: "No refresh token" });
      }
  
      await signOut(auth); // Wait for signOut to complete
  
      return res.status(200).send({ msg: "User logged out successfully" });
    } catch (error) {
      console.error('Logout error:', error);
      return res.status(500).send({ error: "Logout failed" });
    }
  }
