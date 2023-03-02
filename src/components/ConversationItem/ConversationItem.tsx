import styles from './ConversationItem.module.css';
import { useContext } from 'react';
import { AuthenticationContext } from '../../context/authentication';

function ConversationItem() {
  const context = useContext(AuthenticationContext);
  return (
    <div className={styles.conversationItem}>
      <div className={styles.imgConversationItem}>
        <img
          src={`${context?.user?.photoURL}`}
          alt="Photo de profil d'une conversation"
        />
      </div>
      <div className={styles.dataConversationItem}>
        <h3>Nasreddine Boutouil</h3>
        <p>Aucun message récent</p>
      </div>
    </div>
  );
}

export default ConversationItem;
