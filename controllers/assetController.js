import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage"
import { storage } from "../firestore.js";
import { doc, collection, addDoc, getDocs, getDoc, deleteDoc, query, where, updateDoc} from "firebase/firestore";
import db from "../firestore.js";


// upload user profile pictuer
export async function uploadUserPicture(req, res) {
    try {
      const { userId } = req.user;
  
      // Check if profile image is uploaded
      if (!req.file) {
        return res.status(400).send({ error: 'No image file uploaded' });
      }

      const uploadedImage = req.file;
  
  
      // Upload image to firebase
      const imagePath = 'profile-pictures/' + uploadedImage.originalname;
      const imageStorageRef = ref(storage, imagePath);
      const imageVideoTask = uploadBytesResumable(imageStorageRef, uploadedImage.buffer);
  
      // Handle progress and errors during video upload
      imageVideoTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Image uploading ... ' + Math.floor(progress) + '% done');
        },
        (error) => {
          console.error('Error uploading image:', error);
          return res.status(501).send({ error: "Failed uploading image to firebase storage" });
        }
      );
  
      // Await the completion of image upload before proceeding
      await imageVideoTask;
  
      // Get image download URL after successful upload
      const imagedownloadURL = await getDownloadURL(imageVideoTask.snapshot.ref);
  
      
      // Update user details with image url and path
      const imageData = {
        imagePath: imagePath,
        imageURL: imagedownloadURL
      }

      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, imageData);
  
      
  
      return res.status(200).send({ msg: "Profile image uploaded successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ error: "Image upload failed" });
    }
  }