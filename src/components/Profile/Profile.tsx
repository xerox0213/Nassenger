import { useContext } from 'react';
import { AuthenticationContext } from '../../context/authentication';
import { Link } from 'react-router-dom';
import Logo from '../../assets/nassenger_logo.png';
import styles from './Profile.module.css';
import { AiFillEdit } from 'react-icons/ai';
import { SetModalType } from '../../pages/app';
import { BiLogOut } from 'react-icons/bi';
import { BsPersonFill } from 'react-icons/bs';

type Props = {
  setModal: SetModalType;
};

function Profile({ setModal }: Props) {
  const context = useContext(AuthenticationContext);
  const openModal = () => setModal(true);
  return (
    <div className={styles.profile}>
      <Link to='/app'>
        <img src={Logo} alt='Logo Nassenger' />
        Nassenger
      </Link>

      <div className={styles.profilePicture}>
        <img
          src={`${context?.user?.photoURL}`}
          alt='Photo de profil utilisateur '
        />

        <div className={styles.menu}>
          <button>
            <BsPersonFill />
            Profil
          </button>
          <button
            onClick={() => {
              context?.logOut();
            }}
          >
            <BiLogOut />
            Log Out
          </button>
        </div>
        <button className={styles.btnOpenModal} onClick={openModal}>
          <AiFillEdit />
        </button>
      </div>
    </div>
  );
}

export default Profile;
