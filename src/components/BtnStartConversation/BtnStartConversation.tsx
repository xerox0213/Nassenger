import styles from './BtnStartConverstion.module.css';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';

function BtnStartConversation() {
  const state = useSelector((state: RootState) => state.userSelection);
  const handleClick = () => {
    // 1) Récupérer le uid du destinataire (se trouve dans le state redux)
    // 2) Récupérer notre uid qui se trouve dans le contexte
    // 3) Ajouter l'id de la conversation chez les 2 users à l'aide des UID récupérer
  };
  return (
    <button
      onClick={handleClick}
      className={
        state.length ? `${styles.btn}` : `${styles.btn} ${styles.blocked}`
      }
    >
      Commencer une conversation
    </button>
  );
}

export default BtnStartConversation;
