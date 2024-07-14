import {query,doc, addDoc, updateDoc, getDoc, getDocs, collection, deleteDoc, where} from "firebase/firestore";
import db from "../firestore.js";
import {uploadFile, deleteFile} from "./assetController.js";

//Register business
export async function addProduct(req, res){
  try {
      
      const {userId} = req.user;
      const firebasePath = "product-images";

        // Checking if business exists
        const businessRef = doc(db, "business", userId);
        const docSnapshot = await getDoc(businessRef);

        if (!docSnapshot.exists()){
            res.status(404).send({ error: "User is not registered as business owner" });
        }

        // Upload product image
        const fileData = await uploadFile(req, res, firebasePath);

        // Get product details
        const {name, price, description, category} = req.body;
        const productData = {
            name: name,
            description: description,
            category: category,
            price: price,
            businessID: userId,
            imagePath: fileData.filePath,
            imageURL:fileData.fileURL
        };

        // add product on firestore
        await addDoc(collection(db, "products"), productData);
        return res.status(200).send({ msg: "Product added successfully" });

  } catch (error) {
      console.log(error);
      return res.status(500).send({ error: "Adding product failed on firebase failed" });
  }  
}