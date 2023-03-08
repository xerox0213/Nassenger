import { db } from '../../firebase-config';
import { doc, DocumentData, getDoc } from 'firebase/firestore';

export type Message = {
  uid: string;
  text: string;
  id: string;
  timestamp: number;
};

export type Document = {
  messages: Message[];
  users: string[];
};

export type User = {
  fullName: string;
  pictureProfile: string;
  uid: string;
  conversations: string[];
};

export type Recipient = {
  fullName: string;
  pictureProfile: string;
};

export type Conversation = {
  messages: Message[];
  recipientData: Recipient;
  id: string;
};

export async function getConversations(IDs: string[], uid: string) {
  // 1. Récupérer les documents conversations
  const documents = await getDocuments(IDs);
  // 2. Récupérer les informations de tous les destinataires
  const recipientsData = await getRecipientData(documents, uid);
  // 3. Restructurer les conversations pour qu'elles soient utilisables en React
  const conversations: Conversation[] = documents.map((document, index) => {
    const { messages } = document;
    const recipientData = recipientsData[index];
    return { messages, recipientData, id: IDs[index] };
  });

  return conversations;
}

async function getDocuments(IDs: string[]) {
  const documents: Document[] = [];
  // On récupère chaque document via le tableau d'IDs
  for (let i = 0; i < IDs.length; i++) {
    // On récupère un ID
    const ID: string = IDs[i];
    // On récupère le document via son ID
    const docRef = doc(db, 'conversations', ID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      // On récupère les données
      const documentData = docSnap.data() as Document;
      // On garde uniquement les 10 derniers messages
      const messages = documentData.messages.slice(-10).reverse();
      documentData.messages = messages;
      documents.push(documentData);
    } else {
      console.log("Document n'existe pas");
      return [];
    }
  }
  return documents;
}

async function getRecipientData(documents: Document[], uid: string) {
  const recipientsUids = documents.map((document) => {
    const recipientUid = document.users.find((elem) => elem !== uid)!;
    return recipientUid;
  });
  const recipientsData: Recipient[] = [];
  for (let i = 0; i < recipientsUids.length; i++) {
    const recipientUid = recipientsUids[i];
    const docRef = doc(db, 'users', recipientUid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { fullName, pictureProfile } = docSnap.data() as User;
      recipientsData.push({ fullName, pictureProfile });
    } else {
      console.log("Document n'existe pas");
    }
  }
  return recipientsData;
}
