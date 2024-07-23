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