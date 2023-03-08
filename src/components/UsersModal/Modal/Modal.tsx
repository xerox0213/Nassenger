import styles from './Modal.module.css';
import { IoMdClose } from 'react-icons/io';
import { SetModalType } from '../../../pages/app';
import UserItem from '../UserItem/UserItem';
import { db } from '../../../../firebase-config';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useQuery } from '@tanstack/react-query';
import Loader from '../../Loader/Loader';
import BtnStartConversation from '../BtnStartConversation/BtnStartConversation';
import { AuthenticationContext } from '../../../context/authentication';
import { useContext } from 'react';

type Props = {
  setModal: SetModalType;
};

async function getUsers(uid: any) {
  const q = query(collection(db, 'users'), where('uid', '!=', uid));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs;
}

function Modal({ setModal }: Props) {
  const context = useContext(AuthenticationContext);
  const { data, isLoading, isError } = useQuery({
    queryKey: ['users'],
    queryFn: () => getUsers(context?.user.uid),
    refetchOnWindowFocus: false,
  });

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
          {isLoading ? (
            <Loader />
          ) : (
            data?.map((doc) => {
              const { fullName, pictureProfile, uid } = doc.data();
              return (
                <UserItem key={uid} fullName={fullName} uid={uid} pictureProfile={pictureProfile} />
              );
            })
          )}
        </div>
        <div className={styles.footer}>
          <BtnStartConversation closeModal={closeModal} />
        </div>
      </div>
    </div>
  );
}

export default Modal;
