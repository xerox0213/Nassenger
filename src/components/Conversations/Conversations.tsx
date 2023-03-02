import styles from './Conversations.module.css';
import ConversationItem from '../ConversationItem/ConversationItem';

function Conversations() {
  return (
    <div className={styles.conversations}>
      <ConversationItem />
    </div>
  );
}

export default Conversations;
