import { ReactNode, useEffect, createContext, useState } from 'react';
import { auth, provider } from '../../firebase-config';
import {
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from 'firebase/auth';
import firebase from 'firebase/auth';
import { useDispatch } from 'react-redux';

type AuthenticationType = {
  user: firebase.User | null;
  signIn: () => void;
  loadingSignIn: boolean;
};

type DispatchType = { type: 'notification/addNotification'; payload: string };

type Props = {
  children: ReactNode;
};

const AuthenticationContext = createContext<AuthenticationType | null>(null);

function AuthenticationContextProvider({ children }: Props) {
  // Etat qui stocke les information de l'utilisateur connecté
  const [user, setUser] = useState<firebase.User | null>(null);
  // Etat utilisé par composant SignInBtn pour pouvoir bloquer tout interaction avec lui (empêche le spam)
  const [loadingSignIn, setLoadingSignIn] = useState<boolean>(false);
  // Etata qui permet d'afficher les children uniquement lorsque l'obserateur aura été exécuté au montage (empêche le flash)
  const [loadData, setLoadData] = useState<boolean>(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setLoadData(true);
    });

    return unsubscribe;
  }, []);

  const signIn = async () => {
    // Remarque : apparement même si on modifie l'état du composant, il va se re-render mais la fonction continue de s'exécuter
    // Pourquoi je dis ça ? Parce qu'elle est asynchrone et on attend donc une action de l'utilisateur qui peut prendre du temps.
    // Du coup on penserait que l'état se change uniquement quand toute la fonction a été exécuté sauf que non ! L'état se change
    // provoque un re-render une nouvelle fonction signIn est recréer mais l'ancienne est toujours dans un état d'exécution !
    try {
      // Passage de l'état à true pour que le bouton de connexin se bloque
      setLoadingSignIn(true);
      // On ouvre une pop-up et on attend qu'il s'identifie
      const result = await signInWithPopup(auth, provider);
      // Une fois identifié on récupère l'utilisateur
      const user = result.user;
      setUser(user);
    } catch (error) {
      console.log(error);
      dispatch<DispatchType>({
        type: 'notification/addNotification',
        payload: "Vous n'avez pas terminé l'étape de connexion",
      });
      setLoadingSignIn(false);
    }
  };

  return (
    <AuthenticationContext.Provider value={{ user, signIn, loadingSignIn }}>
      {loadData && children}
    </AuthenticationContext.Provider>
  );
}

export { AuthenticationContext, AuthenticationContextProvider };
