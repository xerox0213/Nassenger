import { MouseEvent, useContext } from 'react';
import { AuthenticationContext } from '../../context/authentication';
import { Link } from 'react-router-dom';
import Logo from '../../assets/nassenger_logo.png';
import styles from './Profile.module.css';
import { AiFillEdit } from 'react-icons/ai';
import { SetModalType } from '../../pages/app';
import { BiLogOut } from 'react-icons/bi';
import { BsPersonFill } from 'react-icons/bs';

type Props = {
  menu: boolean;
  setModal: SetModalType;
  setMenu: SetModalType;
};

function Profile({ menu, setMenu, setModal }: Props) {
  const context = useContext(AuthenticationContext);
  const openModal = () => setModal(true);
  return (
    <div className={styles.profile}>
      <Link to='/app'>
        <img src={Logo} alt='Logo Nassenger' />
        Nassenger
      </Link>

      <div className={styles.container}>
        <img
          onClick={(e: MouseEvent) => {
            e.stopPropagation();
            setMenu((v) => !v);
          }}
          src={`${context?.user?.photoURL}`}
          alt='Photo de profil utilisateur '
          className={styles.picture}
        />

        <button className={styles.btnOpenModal} onClick={openModal}>
          <AiFillEdit />
        </button>

        {menu && (
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
        )}
      </div>
    </div>
  );
}

export default Profile;
