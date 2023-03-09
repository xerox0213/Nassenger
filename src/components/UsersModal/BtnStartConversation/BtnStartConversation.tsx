import styles from './BtnStartConverstion.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { useContext } from 'react';
import { AuthenticationContext } from '../../../context/authentication';
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  arrayUnion,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { db } from '../../../../firebase-config';
import { useState } from 'react';
import Loader from '../../Loader/Loader';
import { AuthenticationTypeApp } from '../../../context/authentication';
import { SetterType } from '../../../pages/app';

type Props = {
  closeModal: () => void;
  setSelectedConversationID: SetterType<string>;
  userSelected: string;
};

function BtnStartConversation({ closeModal, setSelectedConversationID, userSelected }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const context = useContext(AuthenticationContext) as AuthenticationTypeApp;

  const handleClick = async () => {
    // 1) Récupérer le uid du destinataire (se trouve dans le state redux)
    // 2) Récupérer notre uid qui se trouve dans le contexte
    // 3) Créer une conversation et ajouter l'id de cette conversation dans la propriété conversations des 2 users
    try {
      setIsLoading(true);
      const uidSender: string = context.user.uid;
      const uidRecipients = [userSelected];
      for (let i = 0; i < uidRecipients.length; i++) {
        const uidRecipient = uidRecipients[i];
        const idConversation = await createConversation([uidSender, uidRecipient]);
        await addConversationIDToUsers(uidSender, uidRecipient, idConversation);
      }
      setIsLoading(false);
      closeModal();
    } catch (error) {
      console.log(error);
    }
  };

  const createConversation = async (users: string[]) => {
    try {
      // On regarde d'abord si une conversation n'a pas déjà été créé
      const { status, id } = await checkConvAlreadyExists(users);
      if (status) {
        console.log(id);
        setSelectedConversationID(id);
        closeModal();
        return Promise.reject(new Error('Erreur -> Conversation déjà créé'));
      } else {
        const docRef = await addDoc(collection(db, 'conversations'), {
          messages: [],
          users,
        });
        const idConversation = docRef.id;
        return idConversation;
      }
    } catch (error) {
      return Promise.reject(new Error('Erreur -> Création de la conversation'));
    }
  };

  const addConversationIDToUsers = async (
    sender: string,
    recipient: string,
    idConversation: string
  ) => {
    try {
      // Ajout de l'id dans la propriété conversation du document de l'expéditeur
      const docRefSender = doc(db, 'users', sender);
      await updateDoc(docRefSender, {
        conversations: arrayUnion(idConversation),
      });
      // Ajout de l'id dans la propriété conversation du document du destinataire
      const docRefRecipient = doc(db, 'users', recipient);
      await updateDoc(docRefRecipient, {
        conversations: arrayUnion(idConversation),
      });
    } catch (error) {
      return Promise.reject(new Error('Erreur -> Ajout id de la conversation aux users'));
    }
  };

  const checkConvAlreadyExists = async (users: any) => {
    const q = query(collection(db, 'conversations'), where('users', '==', users));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.docs.length) {
      return { status: false, id: null };
    } else {
      console.log(querySnapshot.docs);
      return { status: true, id: querySnapshot.docs[0].id };
    }
  };

  return (
    <button
      onClick={handleClick}
      className={userSelected ? `${styles.btn}` : `${styles.btn} ${styles.blocked}`}
    >
      {isLoading ? <Loader /> : 'Commencer une conversation'}
    </button>
  );
}

export default BtnStartConversation;
