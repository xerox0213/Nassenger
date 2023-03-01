import { PropsWithChildren, useEffect } from 'react';
import { createContext, useState } from 'react';
import { auth, provider } from '../../firebase-config';
import {
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from 'firebase/auth';
import { useDispatch } from 'react-redux';

const AuthenticationContext = createContext<{
  user: object | null;
  signIn: object;
} | null>(null);

type DispatchType = { type: 'notification/addNotification'; payload: string };

function AuthenticationContextProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<object | null>(null);
  // Permet d'afficher les children uniquement lorsque l'obserateur aura été exécuté au montage (empêche le flash)
  const [loadData, setLoadData] = useState<boolean>(true);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       setUser(user);
  //     } else {
  //       setUser(null);
  //     }
  //     setLoadData(true);
  //   });

  //   return unsubscribe;
  // }, []);

  const signIn = async () => {
    try {
      // On ouvre une pop-up et on attend qu'il s'identifie
      const result = await signInWithPopup(auth, provider);
      // Une fois identifié on récupère l'utilisateur
      const credential = GoogleAuthProvider.credentialFromResult(result);
      // Narrowing car credential peut-être null
      if (credential) {
        const token = credential.accessToken;
      }
      const user = result.user;
      setUser(user);
    } catch (error) {
      dispatch<DispatchType>({
        type: 'notification/addNotification',
        payload: "Vous n'avez pas terminé l'étape de connexion",
      });
    }
  };

  return (
    <AuthenticationContext.Provider value={{ user, signIn }}>
      {loadData && children}
    </AuthenticationContext.Provider>
  );
}

export { AuthenticationContext, AuthenticationContextProvider };
