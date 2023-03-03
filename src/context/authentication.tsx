import { ReactNode, useEffect, createContext, useState } from 'react';
import { auth, provider, db } from '../../firebase-config';
import { signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
import firebase from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { doc, getDoc, setDoc } from 'firebase/firestore';

type AuthenticationType = {
  user: firebase.User | null;
  signIn: () => void;
  loadingSignIn: boolean;
  logOut: () => void;
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
  const [loadData, setLoadData] = useState<boolean>(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log(user);
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
      // Une fois identifié on récupère l'utilisateur et on lui créé une DB
      const user = result.user;
      await createUserInDB(user);
      setLoadingSignIn(false);
    } catch (error) {
      console.log(error);
      dispatch<DispatchType>({
        type: 'notification/addNotification',
        payload: "Vous n'avez pas terminé l'étape de connexion",
      });
      setLoadingSignIn(false);
    }
  };

  const createUserInDB = async (user: firebase.User) => {
    try {
      // Vérification si l'user n'est pas déjà dans la collection users
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      // Si il existe déjà on fait rien sinon on l'inscrit dans la DB
      if (docSnap.exists()) {
        console.log('Utilisateur déjà inscrit');
      } else {
        console.log('Utilisateur pas encore inscrit');
        await setDoc(doc(db, 'users', user.uid), {
          fullName: user.displayName,
          uid: user.uid,
          pictureProfile: user.photoURL,
          conversations: [],
        });
        console.log("Inscription de l'utilisateur");
      }
    } catch (error) {
      return Promise.reject(new Error("Une erreur s'est produite"));
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      dispatch<DispatchType>({
        type: 'notification/addNotification',
        payload: "Une erreur s'est produite",
      });
    }
  };
  return (
    <AuthenticationContext.Provider
      value={{ user, signIn, loadingSignIn, logOut }}
    >
      {loadData && children}
    </AuthenticationContext.Provider>
  );
}

export { AuthenticationContext, AuthenticationContextProvider };
