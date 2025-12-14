import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "./firebase";
import { AudioFile, AudioUpload } from "@/types/audio";

const COLLECTION_NAME = "audios";

// Upload audio file to Firebase Storage
export const uploadAudioFile = async (file: File): Promise<string> => {
  const timestamp = Date.now();
  const fileName = `${timestamp}_${file.name}`;
  const storageRef = ref(storage, `audios/${fileName}`);

  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);

  return downloadURL;
};

// Create new audio submission (pending approval)
export const createAudioSubmission = async (
  uploadData: AudioUpload,
  userId?: string
): Promise<string> => {
  const fileUrl = await uploadAudioFile(uploadData.file);

  const audioData = {
    title: uploadData.title,
    author: uploadData.author || "",
    tags: uploadData.tags,
    fileUrl,
    fileName: uploadData.file.name,
    fileSize: uploadData.file.size,
    status: "pending",
    uploadedBy: userId || "anonymous",
    uploadedAt: Timestamp.now(),
  };

  const docRef = await addDoc(collection(db, COLLECTION_NAME), audioData);
  return docRef.id;
};

// Get all approved audios
export const getApprovedAudios = async (): Promise<AudioFile[]> => {
  const q = query(
    collection(db, COLLECTION_NAME),
    where("status", "==", "approved")
  );

  const querySnapshot = await getDocs(q);
  const audios = querySnapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
        uploadedAt: doc.data().uploadedAt?.toDate(),
        approvedAt: doc.data().approvedAt?.toDate(),
      } as AudioFile)
  );
  
  // Ordenar no cliente por enquanto
  return audios.sort((a, b) => {
    const dateA = a.approvedAt?.getTime() || 0;
    const dateB = b.approvedAt?.getTime() || 0;
    return dateB - dateA;
  });
};

// Get pending audios (for admin)
export const getPendingAudios = async (): Promise<AudioFile[]> => {
  const q = query(
    collection(db, COLLECTION_NAME),
    where("status", "==", "pending")
  );

  const querySnapshot = await getDocs(q);
  const audios = querySnapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
        uploadedAt: doc.data().uploadedAt?.toDate(),
        approvedAt: doc.data().approvedAt?.toDate(),
      } as AudioFile)
  );
  
  // Ordenar no cliente por enquanto
  return audios.sort((a, b) => {
    const dateA = a.uploadedAt?.getTime() || 0;
    const dateB = b.uploadedAt?.getTime() || 0;
    return dateB - dateA;
  });
};

// Approve audio
export const approveAudio = async (
  audioId: string,
  adminUserId: string
): Promise<void> => {
  const audioRef = doc(db, COLLECTION_NAME, audioId);
  await updateDoc(audioRef, {
    status: "approved",
    approvedBy: adminUserId,
    approvedAt: Timestamp.now(),
  });
};

// Reject audio
export const rejectAudio = async (
  audioId: string,
  adminUserId: string
): Promise<void> => {
  const audioRef = doc(db, COLLECTION_NAME, audioId);
  await updateDoc(audioRef, {
    status: "rejected",
    approvedBy: adminUserId,
    approvedAt: Timestamp.now(),
  });
};

// Delete audio
export const deleteAudio = async (audioId: string): Promise<void> => {
  const audioRef = doc(db, COLLECTION_NAME, audioId);
  await deleteDoc(audioRef);
};
