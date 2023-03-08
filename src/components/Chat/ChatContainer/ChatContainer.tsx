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
};

function ChatContainer({ selectedConversation, setConversations }: Props) {
  return (
    <div className={styles.tchat}>
      <ChatHeader recipientData={selectedConversation.recipientData} />
      <ChatContent messages={selectedConversation.messages} />
      <Input setConversations={setConversations} id={selectedConversation.id} />
    </div>
  );
}

export default memo(ChatContainer);
