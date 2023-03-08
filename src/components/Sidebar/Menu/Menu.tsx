import { BiLogOut } from 'react-icons/bi';
import { BsPersonFill } from 'react-icons/bs';
import styles from './Menu.module.css';
import { useContext } from 'react';
import { AuthenticationContext, AuthenticationTypeApp } from '../../../context/authentication';

function Menu() {
  const context = useContext(AuthenticationContext) as AuthenticationTypeApp;
  return (
    <div className={styles.menu}>
      <button>
        <BsPersonFill />
        Profil
      </button>
      <button
        onClick={() => {
          context.logOut();
        }}
      >
        <BiLogOut />
        Déconnexion
      </button>
    </div>
  );
}

export default Menu;
