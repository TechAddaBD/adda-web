import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "./firebaseConfig";

/**
 * Check-in info save kore Firestore e
 * @param {Object} data - User input
 * @param {string} data.name - User's name
 * @param {string} data.message - User's message
 * @param {number} data.latitude - Latitude
 * @param {number} data.longitude - Longitude
 */
export const addCheckIn = async ({ name, message, latitude, longitude }) => {
  try {
    const docRef = await addDoc(collection(db, "checkins"), {
      name,
      message,
      latitude,
      longitude,
      createdAt: Timestamp.now(),
    });
    console.log("✅ Check-in added with ID: ", docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("❌ Error adding check-in: ", error);
    return { success: false, error };
  }
};
