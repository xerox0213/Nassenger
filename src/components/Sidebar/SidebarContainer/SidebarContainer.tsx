import { MouseEvent, useContext } from 'react';
import { AuthenticationContext } from '../../../context/authentication';
import { Link } from 'react-router-dom';
import Logo from '../../../assets/nassenger_logo.png';
import styles from './SidebarContainer.module.css';
import { AiFillEdit } from 'react-icons/ai';
import { SetterType } from '../../../pages/app';
import Menu from '../Menu/Menu';
type Props = {
  menu: boolean;
  setModal: SetterType<boolean>;
  setMenu: SetterType<boolean>;
};

function Sidebar({ menu, setMenu, setModal }: Props) {
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

        {menu && <Menu />}
      </div>
    </div>
  );
}

export default Sidebar;
