import styles from './ChatContent.module.css';
import RightMessage from '../../Message/RightMessage/RightMessage';
import LeftMessage from '../../Message/LeftMessage/LeftMessage';
import { Message } from '../../../modules/getConversations';
import { useContext } from 'react';
import { AuthenticationTypeApp, AuthenticationContext } from '../../../context/authentication';

type Props = {
  messages: Message[];
};

function ChatContent({ messages }: Props) {
  const context = useContext(AuthenticationContext) as AuthenticationTypeApp;
  return (
    <div className={styles.content}>
      {messages.map((message: Message) => {
        if (message.uid === context.user.uid) {
          return <RightMessage key={message.id} text={message.text} />;
        } else {
          return <LeftMessage key={message.id} text={message.text} />;
        }
      })}
    </div>
  );
}

export default ChatContent;
