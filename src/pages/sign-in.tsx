import { MouseEvent, useContext, useState } from 'react';
import { BsGithub } from 'react-icons/bs';
import { Link, Navigate } from 'react-router-dom';
import Logo from '../assets/nassenger_logo.png';
import { AuthenticationContext } from '../context/authentication';
import styles from '../../styles/sign-in.module.css';
import Preview from '../assets/sign-in_preview.png';
import SignInBtn from '../components/SignInBtn/SignInBtn';

function SignIn() {
  const context = useContext(AuthenticationContext);

  if (!context?.user) {
    return (
      <section>
        <nav className={styles.navbar}>
          <Link to='/sign-in'>
            <img style={{ width: 50 }} src={Logo} alt='Logo Nassenger' />
            Nassenger
          </Link>
          <Link
            className={styles.linkToGithub}
            to={'https://github.com/xerox0213'}
          >
            <BsGithub />
            Mon github
          </Link>
        </nav>
        <div className={styles.content}>
          <div className={styles.contentImg}>
            <img
              src={Preview}
              alt="Image de présentation de l'application Nassenger"
            />
          </div>
          <div className={styles.contentText}>
            <h1>Pour utiliser l'application, connectez-vous :</h1>
            <SignInBtn />
          </div>
        </div>
      </section>
    );
  } else {
    return <Navigate to='/app' />;
  }
}

export default SignIn;
