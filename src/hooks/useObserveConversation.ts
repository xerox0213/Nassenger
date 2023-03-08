import { db } from '../../firebase-config';
import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useContext, useState } from 'react';
import { Conversation, Document } from '../modules/getConversations';
import { AuthenticationContext, AuthenticationTypeApp } from '../context/authentication';
import { SetterType } from '../pages/app';
import Sound from '../assets/ring_notification.mp3';

const audio = new Audio(Sound);
type P1 = Conversation;
type P2 = SetterType<Conversation[]>;
type P3 = string | null;
type Return = [boolean, SetterType<boolean>];

function useObserveConversation(
  conversation: P1,
  setConversations: P2,
  selectedConversationID: P3
): Return {
  const [seen, setSeen] = useState<boolean>(true);
  const context = useContext(AuthenticationContext) as AuthenticationTypeApp;

  useEffect(() => {
    let unsub;
    try {
      const docRef = doc(db, 'conversations', conversation.id);
      unsub = onSnapshot(docRef, async (doc) => {
        const conversationData = doc.data() as Document;
        const lastMessage = conversationData.messages[conversationData.messages.length - 1];
        // // Modifier l'état conversations pour afficher le dernier message
        if (
          lastMessage.uid !== context.user.uid &&
          lastMessage.id !== conversation.messages[0].id
        ) {
          setConversations((currentState) => {
            const copyCurrentState = JSON.parse(JSON.stringify(currentState));
            // Trouver l'indice de la conversation
            const indexConv = copyCurrentState.findIndex(
              (elem: any) => elem.id === conversation.id
            );
            // Ajouter le message à la conversation
            copyCurrentState[indexConv].messages.unshift(lastMessage);
            // On trie les conversations en fonction de l'heure à laquelle a été envoyé le dernier message
            copyCurrentState.sort((a: any, b: any) => {
              return b.messages[0].timestamp - a.messages[0].timestamp;
            });
            return copyCurrentState;
          });
          if (!selectedConversationID || selectedConversationID !== conversation.id) {
            audio.play();
            setSeen(false);
          } else {
            setSeen(true);
          }
        }
      });
    } catch (error) {
      console.log('Erreur -> Récupérer les données dans useEffect pour composant Conversations');
    }
    return unsub;
  }, [selectedConversationID]);
  return [seen, setSeen];
}

export default useObserveConversation;
