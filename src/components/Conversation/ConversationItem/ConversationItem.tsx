import styles from './ConversationItem.module.css';
import { Conversation } from '../../../modules/getConversations';
import { SetterType } from '../../../pages/app';
import useObserveConversation from '../../../hooks/useObserveConversation';

type Props = {
  conversation: Conversation;
  setSelectedConversationID: SetterType<string>;
  setConversations: SetterType<Conversation[]>;
  selectedConversationID: string;
  setActiveConversation: SetterType<string>;
  activeConversation: string;
};
const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

function ConversationItem({
  conversation,
  setSelectedConversationID,
  setConversations,
  selectedConversationID,
}: Props) {
  const [seen, setSeen] = useObserveConversation(
    conversation,
    setConversations,
    selectedConversationID
  );
  const { recipientData } = conversation;
  // Le dernier élément est le premier élément puisqu'on reverse le tableau dans getConversations
  const lastMessage = conversation.messages[0];
  let text;
  let time;
  let day;
  if (lastMessage) {
    const timestamp = lastMessage.timestamp;
    const currentDay = days[new Date(lastMessage.timestamp).getDay()];
    text = lastMessage.text.length > 10 ? lastMessage.text.slice(0, 10) + '...' : lastMessage.text;
    day = days[new Date(lastMessage.timestamp).getDay()];
    day = day === currentDay ? '' : day;
    time = new Date(timestamp).toLocaleTimeString('fr-FR').slice(0, 5);
  }

  return (
    <div
      onClick={() => {
        setSeen(true);
        setSelectedConversationID(conversation.id);
      }}
      className={
        seen && selectedConversationID !== conversation.id
          ? styles.conversationItem
          : `${styles.conversationItem} ${styles.active}`
      }
    >
      <div className={styles.imgConversationItem}>
        <img src={`${recipientData.pictureProfile}`} alt="Photo de profil d'une conversation" />
      </div>
      <div className={styles.dataConversationItem}>
        <h3>{recipientData.fullName}</h3>
        <p>{lastMessage ? `${text} ● ${day} ${time}` : 'Aucun message récent'}</p>
      </div>
    </div>
  );
}

export default ConversationItem;
