import BtnSignIn from '@pages/SignIn/components/BtnSignIn/BtnSignIn';
import Navbar from '@pages/SignIn/components/Navbar/Navbar';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '@context/AuthContext';
import { useContext } from 'react';

function SignIn() {
  const user = useContext(AuthContext);

  if (!user) {
    return (
      <div>
        <Navbar />
        <BtnSignIn />
      </div>
    );
  } else {
    return <Navigate to={'/'} />;
  }
}

export default SignIn;
