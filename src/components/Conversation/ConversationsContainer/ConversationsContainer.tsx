import styles from './ConversationsContainer.module.css';
import useFetchConversations from '../../../hooks/useFetchConversations';
import ConversationItem from '../ConversationItem/ConversationItem';
import Loader from '../../Loader/Loader';
import { Conversation } from '../../../modules/getConversations';
import { SetterType } from '../../../pages/app';
import { memo, useState } from 'react';

type Props = {
  conversations: Conversation[];
  setSelectedConversationID: SetterType<string | null>;
  setConversations: SetterType<Conversation[]>;
  selectedConversationID: string | null;
};

function ConversationsContainer({
  conversations,
  setConversations,
  setSelectedConversationID,
  selectedConversationID,
}: Props) {
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const isLoading = useFetchConversations(setConversations);
  return (
    <div className={styles.conversations}>
      {isLoading ? (
        <Loader />
      ) : (
        conversations.map((conversation) => (
          <ConversationItem
            key={conversation.id}
            conversation={conversation}
            setSelectedConversationID={setSelectedConversationID as SetterType<string>}
            setConversations={setConversations}
            selectedConversationID={selectedConversationID as string}
            activeConversation={activeConversation as string}
            setActiveConversation={setActiveConversation as SetterType<string>}
          />
        ))
      )}
    </div>
  );
}

export default memo(ConversationsContainer);
