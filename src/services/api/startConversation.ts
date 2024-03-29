import { db } from '@services/configuration/firebase-config';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  FieldValue,
  serverTimestamp,
} from 'firebase/firestore';

export async function startConversation(currentUserID: string, selectedUsersID: string[]) {
  try {
    const allParticipants = [currentUserID, ...selectedUsersID].sort();
    let q = null;

    if (allParticipants.length === 2) {
      q = query(collection(db, 'Conversations'), where('participants', '==', allParticipants));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        throw { message: 'Conversation existe déjà', id: querySnapshot.docs[0].id };
      }
    }

    type Data = {
      lastUpdated: FieldValue;
      participants: string[];
      seen: string[];
      groupInfo: null | { admins: string[] };
    };

    const data: Data = {
      lastUpdated: serverTimestamp(),
      participants: allParticipants,
      seen: [],
      groupInfo:
        allParticipants.length > 2
          ? {
              admins: [currentUserID],
            }
          : null,
    };

    await addDoc(collection(db, 'Conversations'), data);

    return 'Conversation a été créé';
  } catch (error) {
    return Promise.reject(error);
  }
}
