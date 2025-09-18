// import { initializeApp } from "firebase/app";
// import { getStorage, ref, getDownloadURL } from "firebase/storage";

// var firebaseConfig = {
//   apiKey: "AIzaSyB1JES7FtWNBoz9obp-5Z6HifP5XCsUsOI",
//   authDomain: "gambar-78b2b.firebaseapp.com",
//   projectId: "gambar-78b2b",
//   storageBucket: "gambar-78b2b.appspot.com",
//   messagingSenderId: "694976070405",
//   appId: "1:694976070405:web:eef580e9823e39e64dad6c",
//   measurementId: "G-YX2KKT4KRH"
// };

// const app = initializeApp(firebaseConfig);
// const storage = getStorage(app);

// export { storage };
// export default app;

// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";

// TODO: ganti dengan konfigurasi Firebase proyek kamu
const firebaseConfig = {
  apiKey: "AIzaSyB1JES7FtWNBoz9obp-5Z6HifP5XCsUsOI",
  authDomain: "gambar-78b2b.firebaseapp.com",
  projectId: "gambar-78b2b",
  storageBucket: "gambar-78b2b.appspot.com",
  messagingSenderId: "694976070405",
  appId: "1:694976070405:web:eef580e9823e39e64dad6c",
  measurementId: "G-YX2KKT4KRH",
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Storage
const storage = getStorage(app);

/**
 * Upload file ke Firebase Storage
 * @param path path di storage, misal "products/image.png"
 * @param file File
 */
export const uploadFile = async (path: string, file: File) => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(snapshot.ref);
    return url;
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
};

/**
 * Ambil URL gambar dari Firebase Storage
 * @param path path file di storage, misal "products/image.png"
 */
export const getImageURL = async (path: string): Promise<string> => {
  try {
    const storageRef = ref(storage, path);
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    console.error("Get image failed:", error);
    return ""; // kembalikan string kosong jika gagal
  }
};

export default app;
