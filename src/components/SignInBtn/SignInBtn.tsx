import { FcGoogle } from 'react-icons/fc';
import { useContext, useState, useEffect } from 'react';
import { AuthenticationContext } from '../../context/authentication';
import styles from './SignInBtn.module.css';

function SignInBtn() {
  const context = useContext(AuthenticationContext);

  return (
    <button
      className={
        context?.loadingSignIn
          ? `${styles.blocked} ${styles.btn}`
          : `${styles.btn}`
      }
      onClick={context?.signIn}
    >
      <FcGoogle style={{ fontSize: 24 }} />
      Connexion avec Google
    </button>
  );
}

export default SignInBtn;
