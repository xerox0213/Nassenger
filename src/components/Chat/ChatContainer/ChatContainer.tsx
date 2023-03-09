import styles from './ChatContainer.module.css';
import ChatHeader from '../ChatHeader/ChatHeader';
import ChatContent from '../ChatContent/ChatContent';
import Input from '../ChatInput/ChatInput';
import { memo } from 'react';
import { Conversation } from '../../../modules/getConversations';
import { SetterType } from '../../../pages/app';

type Props = {
  selectedConversation: Conversation;
  setConversations: SetterType<Conversation[]>;
  selectedConversationID: string;
};

function ChatContainer({ selectedConversation, setConversations, selectedConversationID }: Props) {
  return (
    <div className={styles.chat}>
      <ChatHeader recipientData={selectedConversation.recipientData} />
      <ChatContent
        key={selectedConversationID}
        setConversations={setConversations}
        selectedConversation={selectedConversation}
      />
      <Input setConversations={setConversations} id={selectedConversation.id} />
    </div>
  );
}

export default memo(ChatContainer);
