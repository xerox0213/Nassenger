import { getConversations, User } from '../modules/getConversations';
import { AuthenticationContext, AuthenticationTypeApp } from '../context/authentication';
import { useContext, useEffect, useState } from 'react';
import { db } from '../../firebase-config';
import { doc, onSnapshot } from 'firebase/firestore';
import { SetterType } from '../pages/app';
import { Conversation } from '../modules/getConversations';

type Param = SetterType<Conversation[]>;

function useFetchConversations(setConversations: Param): boolean {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const context = useContext(AuthenticationContext) as AuthenticationTypeApp;

  useEffect(() => {
    let unsub;
    try {
      const docRef = doc(db, 'users', context.user.uid);
      unsub = onSnapshot(docRef, async (doc) => {
        const userData = doc.data() as User;
        const IDs: string[] = userData.conversations;
        if (IDs.length !== 0) {
          let allConversations = await getConversations(IDs, context.user.uid);
          // On trie les conversations en fonction de l'heure à laquelle a été envoyé le dernier message
          allConversations.sort((a, b) => {
            if (a.messages.length && b.messages.length) {
              return b.messages[0].timestamp - a.messages[0].timestamp;
            } else {
              return 0;
            }
          });
          setIsLoading(false);
          setConversations(allConversations);
        }
      });
    } catch (error) {
      console.log('Erreur -> Récupérer les données dans useEffect pour composant Conversations');
    }
    return unsub;
  }, []);

  return isLoading;
}

export default useFetchConversations;
