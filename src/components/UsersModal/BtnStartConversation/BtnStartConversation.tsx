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

type Props = {
  closeModal: () => void;
};

function BtnStartConversation({ closeModal }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const userSelection = useSelector((state: RootState) => state.userSelection);
  const context = useContext(AuthenticationContext) as AuthenticationTypeApp;
  const dispatch = useDispatch();

  const handleClick = async () => {
    // 1) Récupérer le uid du destinataire (se trouve dans le state redux)
    // 2) Récupérer notre uid qui se trouve dans le contexte
    // 3) Créer une conversation et ajouter l'id de cette conversation dans la propriété conversations des 2 users
    try {
      setIsLoading(true);
      const uidSender: string = context.user.uid;
      const uidRecipients = userSelection;
      for (let i = 0; i < uidRecipients.length; i++) {
        const uidRecipient = uidRecipients[i];
        const idConversation = await createConversation([uidSender, uidRecipient]);
        await addConversationIDToUsers(uidSender, uidRecipient, idConversation);
      }
      setIsLoading(false);
      closeModal();
      dispatch({
        type: 'userSelection/emptyUserSelection',
      });
    } catch (error) {
      console.log(error);
    }
  };

  const createConversation = async (users: string[]) => {
    try {
      // On regarde d'abord si une conversation n'a pas déjà été créé
      const alreadyAdded = await checkConvAlreadyExists(users);
      if (alreadyAdded) {
        return Promise.reject(new Error('Erreur -> Conversation déjà créé'));
      }
      const docRef = await addDoc(collection(db, 'conversations'), {
        messages: [],
        users,
      });
      const idConversation = docRef.id;
      return idConversation;
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
      return false;
    } else {
      return true;
    }
  };

  return (
    <button
      onClick={handleClick}
      className={userSelection.length ? `${styles.btn}` : `${styles.btn} ${styles.blocked}`}
    >
      {isLoading ? <Loader /> : 'Commencer une conversation'}
    </button>
  );
}

export default BtnStartConversation;
