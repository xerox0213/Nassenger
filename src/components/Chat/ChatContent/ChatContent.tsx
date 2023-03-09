import styles from './ChatContent.module.css';
import RightMessage from '../../Message/RightMessage/RightMessage';
import LeftMessage from '../../Message/LeftMessage/LeftMessage';
import { Conversation, Message } from '../../../modules/getConversations';
import { useContext, useState, useRef, useEffect } from 'react';
import { AuthenticationTypeApp, AuthenticationContext } from '../../../context/authentication';
import { Waypoint } from 'react-waypoint';
import { SetterType } from '../../../pages/app';
import { collection, doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../firebase-config';

type Props = {
  selectedConversation: Conversation;
  setConversations: SetterType<Conversation[]>;
};

function ChatContent({ selectedConversation, setConversations }: Props) {
  // Pour ne pas surcharger toutes les conversations en données et donc optimiser les perfs
  // Car si trop de données s'accumulent les montages et update des composants prennent du temps
  const [previousMessages, setPreviousMessages] = useState<Message[]>([]);
  const [n, setN] = useState<number>(1);
  const [limit, setLimit] = useState(false);
  const context = useContext(AuthenticationContext) as AuthenticationTypeApp;
  const ref = useRef<number>(selectedConversation.messages.length + previousMessages.length);
  const allMessages = selectedConversation.messages.concat(previousMessages);

  async function retrieveTenPreviousMessages(id: string) {
    const docRef = doc(db, 'conversations', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const conversationData = docSnap.data() as Conversation;
      const messages = conversationData.messages;
      const decalage = selectedConversation.messages.length + previousMessages.length - ref.current;
      const tenPreviousMessages = messages.slice(-10 * (n + 1) - decalage, -10 * n - decalage);

      if (tenPreviousMessages && tenPreviousMessages.length !== 0) {
        ref.current += tenPreviousMessages.length;
        setPreviousMessages((previousMessages) => {
          let newPreviousMessages = previousMessages.concat(tenPreviousMessages.reverse());
          return newPreviousMessages;
        });
        setN((n) => n + 1);
      } else {
        setLimit(true);
      }
    } else {
      // doc.data() will be undefined in this case
      console.log('No such document!');
    }
  }

  return (
    <div
      className={allMessages.length ? `${styles.content} ${styles.columnReverse}` : styles.content}
    >
      {allMessages.length !== 0 ? (
        allMessages.map((message: Message) => {
          if (message.uid === context.user.uid) {
            return <RightMessage key={message.id} text={message.text} />;
          } else {
            return <LeftMessage key={message.id} text={message.text} />;
          }
        })
      ) : (
        <p className={styles.info}>Démarrez la discussion en envoyant un message.</p>
      )}
      {!limit && <Waypoint onEnter={() => retrieveTenPreviousMessages(selectedConversation.id)} />}
    </div>
  );
}

export default ChatContent;
