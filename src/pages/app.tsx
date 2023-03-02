import styles from '../../styles/app.module.css';
import Profile from '../components/Profile/Profile';
import Conversations from '../components/Conversations/Conversations';
import Modal from '../components/Modal/Modal';
import { useState, useContext } from 'react';
import { Dispatch, SetStateAction } from 'react';
import { AuthenticationContext } from '../context/authentication';
import { Navigate } from 'react-router-dom';

export type SetModalType = Dispatch<SetStateAction<boolean>>;

function App() {
  const [modal, setModal] = useState<boolean>(false);
  const context = useContext(AuthenticationContext);
  if (context?.user) {
    return (
      <div className={styles.app}>
        {modal && <Modal setModal={setModal} />}
        <Profile setModal={setModal} />
        <Conversations />
      </div>
    );
  } else {
    return <Navigate to='/sign-in' />;
  }
}

export default App;
