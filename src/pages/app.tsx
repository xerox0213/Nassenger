import styles from '../../styles/app.module.css';
import SidebarContainer from '../components/Sidebar/SidebarContainer/SidebarContainer';
import ConversationsContainer from '../components/Conversation/ConversationsContainer/ConversationsContainer';
import Modal from '../components/UsersModal/Modal/Modal';
import { useState, useContext, useMemo } from 'react';
import { Dispatch, SetStateAction } from 'react';
import { AuthenticationContext } from '../context/authentication';
import { Navigate } from 'react-router-dom';
import ChatContainer from '../components/Chat/ChatContainer/ChatContainer';
import { Conversation } from '../modules/getConversations';

export type SetModalType = Dispatch<SetStateAction<boolean>>;
export type SetterType<T> = Dispatch<SetStateAction<T>>;

function App() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationID, setSelectedConversationID] = useState<string | null>(null);
  const [menu, setMenu] = useState<boolean>(false);
  const [modal, setModal] = useState<boolean>(false);
  const context = useContext(AuthenticationContext);

  // ==== A améliorer ====
  // Reprendre la conversation si -> plus la conversation sélectionné ou si longueur tableau message conversation a changé
  const indexConv = conversations.findIndex((elem) => elem.id === selectedConversationID);
  const length = indexConv !== -1 ? conversations[indexConv].messages.length : null;
  const selectedConversation = useMemo(() => {
    if (selectedConversationID) {
      const conversation = conversations[indexConv];
      return conversation;
    } else {
      return null;
    }
  }, [selectedConversationID, length]);

  if (context?.user) {
    return (
      <div className={styles.app}>
        {modal && <Modal setModal={setModal} />}
        <SidebarContainer menu={menu} setMenu={setMenu} setModal={setModal} />
        <ConversationsContainer
          conversations={conversations}
          setConversations={setConversations}
          setSelectedConversationID={setSelectedConversationID}
          selectedConversationID={selectedConversationID}
        />
        {selectedConversation ? (
          <ChatContainer
            selectedConversation={selectedConversation}
            setConversations={setConversations}
          />
        ) : (
          <p className={styles.alert}>Sélectionnez une conversation pour commencer à chatter</p>
        )}
      </div>
    );
  } else {
    return <Navigate to='/sign-in' />;
  }
}

export default App;
