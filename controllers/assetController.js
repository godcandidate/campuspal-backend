import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "../firestore.js";

export async function uploadFile(req, res, firebasePath) {
  try {
    // Check if file is uploaded
    if (!req.file) {
      return res.status(400).send({ error: "No file uploaded" });
    }

    const uploadedFile = req.file;

    // Upload file to Firebase Storage
    const filePath = firebasePath + "/" + uploadedFile.originalname;
    const fileStorageRef = ref(storage, filePath);
    const uploadTask = uploadBytesResumable(fileStorageRef, uploadedFile.buffer);

    // Handle progress and errors during upload
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("File uploading... " + Math.floor(progress) + "% done");
      },
      (error) => {
        console.error("Error uploading file:", error);
        return res.status(501).send({ error: "Failed uploading file to Firebase Storage" });
      }
    );

    // Await the completion of file upload before proceeding
    await uploadTask;

    // Get download URL after successful upload
    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

    //Get and Return the uploaded file data
    const fileData = {
      filePath: filePath,
      fileURL: downloadURL
    };

    return fileData;

  } catch (error) {
    res.status(500).send({ error: "Uploading file failed on firebase" });
  }
}