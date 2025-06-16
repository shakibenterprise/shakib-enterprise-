// firebase.js

// ✅ Firebase মডিউল ইম্পোর্ট করুন
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  enableIndexedDbPersistence
} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

// ✅ Firebase কনফিগারেশন
const firebaseConfig = {
  apiKey: "AIzaSyACFf60qa7Udvz9Xn8GN6vu9V_BkQzdovk",
  authDomain: "shakib-enterprise-6df83.firebaseapp.com",
  projectId: "shakib-enterprise-6df83",
  storageBucket: "shakib-enterprise-6df83.appspot.com",
  messagingSenderId: "957943781117",
  appId: "1:957943781117:web:af41a45c8a202fdb52d094"
};

// ✅ Firebase ইনিশিয়ালাইজ করুন
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ✅ Firestore Offline Mode চালু করুন
enableIndexedDbPersistence(db)
  .then(() => {
    console.log("Offline mode enabled ✅");
  })
  .catch((err) => {
    console.error("Offline mode error ❌", err);
  });

/**
 * 🔥 **Fetch Function (রিয়েল-টাইম ডাটা ফেচ করবে)**
 * @param {string} collectionName - কলেকশনের নাম
 * @param {string|null} docId - নির্দিষ্ট ডকুমেন্ট ID (null হলে কালেকশন থেকে সব ডাটা আনবে)
 * @param {function} callback - ফেচ হওয়া ডাটা প্রসেস করার ফাংশন
 */
export function fetchData(collectionName, docId, callback) {
  if (docId) {
    // যদি নির্দিষ্ট ডকুমেন্ট ফেচ করতে হয়
    const ref = doc(db, collectionName, docId);
    onSnapshot(ref, { includeMetadataChanges: true }, (snapshot) => {
      if (typeof snapshot.exists === 'function' && snapshot.exists()) {
        const data = { id: snapshot.id, ...snapshot.data() };
        callback(data);
      } else {
        console.log("⚠️ No document data found");
      }
    });
  } else {
    // যদি কালেকশন থেকে সব ডাটা ফেচ করতে হয়
    const ref = collection(db, collectionName);
    onSnapshot(ref, { includeMetadataChanges: true }, (snapshot) => {
      if (snapshot.docs) {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(data);
      } else {
        console.log("⚠️ No collection data found");
      }
    });
  }
}

/**
 * 🔥 **Save Function (ডাটা Firestore-এ সংরক্ষণ করবে)**
 * @param {string} collectionName - কলেকশনের নাম
 * @param {string} docId - নির্দিষ্ট ডকুমেন্ট ID
 * @param {object} data - সংরক্ষণযোগ্য ডাটা
 */
export function saveData(collectionName, docId, data) {
  return setDoc(doc(db, collectionName, docId), data, { merge: true })
    .then(() => console.log("✅ Data saved successfully"))
    .catch((error) => console.error("❌ Error saving data:", error));
}

/**
 * 🔥 **Delete Function (ডাটা Firestore থেকে ডিলিট করবে)**
 * @param {string} collectionName - কলেকশনের নাম
 * @param {string} docId - ডিলিট করার ডকুমেন্ট ID
 */
export function deleteData(collectionName, docId) {
  return deleteDoc(doc(db, collectionName, docId))
    .then(() => console.log(`🗑️ ${docId} deleted from ${collectionName}`))
    .catch((error) => console.error("❌ Error deleting data:", error));
}

// ✅ Firebase Authentication
export const auth = getAuth(app);
export { db };
