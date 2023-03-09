import { FormEvent } from 'react';
import styles from './ChatInput.module.css';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../../../firebase-config';
import { useContext } from 'react';
import { AuthenticationContext, AuthenticationTypeApp } from '../../../context/authentication';
import { Message, Conversation } from '../../../modules/getConversations';
import { SetterType } from '../../../pages/app';
import { IoSend } from 'react-icons/io5';
import { v4 as uuidv4 } from 'uuid';

async function sendMessage(message: Message, id: string) {
  const docRef = doc(db, 'conversations', id);
  await updateDoc(docRef, {
    messages: arrayUnion(message),
  });
}

type Props = {
  id: string;
  setConversations: SetterType<Conversation[]>;
};

function ChatInput({ id, setConversations }: Props) {
  const context = useContext(AuthenticationContext) as AuthenticationTypeApp;
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.children[0] as HTMLInputElement;
    if (input.value) {
      const message = {
        text: input.value,
        uid: context.user.uid,
        id: uuidv4(),
        timestamp: Date.now(),
      };

      form.reset();

      setConversations((currentAllConv: Conversation[]) => {
        // On fait deep copy -> Objet et/ou tableau imbriqué ça cause des bugs
        const copyCurrentAllConv = JSON.parse(JSON.stringify(currentAllConv)) as Conversation[];
        const conv = copyCurrentAllConv.find((elem) => elem.id === id) as Conversation;
        // Puisque c'est un objet (référence) la valeur rajouté dans conv se trouvera dans copyCurrentAllConv
        conv.messages.unshift(message);
        // On trie les conversations en fonction de l'heure à laquelle a été envoyé le dernier message
        copyCurrentAllConv.sort((a, b) => {
          return b.messages[0].timestamp - a.messages[0].timestamp;
        });
        return copyCurrentAllConv;
      });
      await sendMessage(message, id);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input type='text' placeholder='Message...' />
      <button>
        <IoSend />
      </button>
    </form>
  );
}

export default ChatInput;
