import styles from './Conversations.module.css';
import ConversationItem from '../ConversationItem/ConversationItem';
import { useQuery } from '@tanstack/react-query';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase-config';

async function getCurrentUserConversations() {
  // Mettre le uid à la place de SF
  const docRef = doc(db, 'users', 'SF');
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const { conversations } = docSnap.data();
    return conversations;
  } else {
    // doc.data() will be undefined in this case
    console.log('No such document!');
  }
}

function Conversations() {
  return (
    <div className={styles.conversations}>
      <ConversationItem />
    </div>
  );
}

export default Conversations;
