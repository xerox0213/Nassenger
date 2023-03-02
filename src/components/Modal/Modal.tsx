import styles from './Modal.module.css';
import { IoMdClose } from 'react-icons/io';
import { SetModalType } from '../../pages/app';

type Props = {
  setModal: SetModalType;
};

function Modal({ setModal }: Props) {
  const closeModal = () => setModal(false);
  return (
    <div className={styles.modal}>
      <div onClick={closeModal} className={styles.backgroundModal}></div>
      <div className={styles.contentModal}>
        <div className={styles.header}>
          <h2>Nouvelle conversation</h2>
          <button onClick={closeModal}>
            <IoMdClose />
          </button>
        </div>
        <div className={styles.content}>
          <p>Nasreddine</p>
        </div>
        <div className={styles.footer}>
          <button>Commencer une conversation</button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
