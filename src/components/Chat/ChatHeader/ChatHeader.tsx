import styles from './ChatHeader.module.css';
import { Recipient } from '../../../modules/getConversations';

type Props = {
  recipientData: Recipient;
};

function TchatHeader({ recipientData }: Props) {
  return (
    <div className={styles.header}>
      <div className={styles.leftHeader}>
        <img src={recipientData.pictureProfile} alt="Photo de profil de l'utilisateur" />
        <p>{recipientData.fullName}</p>
      </div>
    </div>
  );
}

export default TchatHeader;
