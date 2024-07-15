import {query,doc, addDoc, updateDoc, getDoc, getDocs, collection, deleteDoc, where} from "firebase/firestore";
import db from "../firestore.js";
import {uploadFile, deleteFile} from "./assetController.js";

//Add a product
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

//Get business products
export async function getBusinessProducts(req, res){
    try {
        // Get business data and id
        const {userId} = req.user;
        let productRef = collection(db, "products");

        // Query for products where creator field matches userId
        const q = query(productRef, where("businessID", "==", userId));
      
        const productSnap = await getDocs(q);
       
        // Check if user has products
        if (!productSnap.docs) {
            return res.status(404).send({ error: "No Business products" });   
        }

        const products = productSnap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

        return res.status(200).send(products);
        
        
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: "Retrieving business products from firebase failed" });
    }  
}

//Get all products
export async function getAllProducts(req, res) {
    try {
      let eventRef = collection(db, "products");
    
      let q = collection(db, "products");
  
      
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
      const products = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      res.status(200).send({products});
    } catch (error) {
      console.error("Retrieving products:", error); 
      res.status(500).send({ error: "Products retrieval failed on firebase" });
    }
  }

//update a product
export async function updateProduct(req, res){
    try {
  
        // Get user data and id 
        const productData = req.body;
        const productId = req.params.id;
       
        const userRef = doc(db, "products", productId);
        await updateDoc(userRef, productData);
  
        return res.status(200).send({ msg: "Product details updated successfully"});
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: "Product update on firebase failed" });
    }
  }

// delete a product
export async function deleteProduct(req, res){
    const productId = req.params.id;
  
    if (!productId) {
      return res.status(400).send({ error: 'Missing event ID' });
    }
  
    try {
      const productRef = doc(db, "products", productId);
      const docSnapshot = await getDoc(productRef);
  
      //get product image path
      const productData = docSnapshot.data();
      const firebasePath = productData.imagePath;
    
      // delete the event image from storage
      await deleteFile(req, res, firebasePath);
      
      // delete event from firestore
      await deleteDoc(docSnapshot.ref);
  
      res.status(200).send({msg: "Product deleted successfully"});
      
    } catch (error) {
      console.log(error);
      res.status(500).send({error:"Product deletion failed on firebase"});
    }
  }
  