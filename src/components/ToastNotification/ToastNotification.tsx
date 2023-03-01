import styles from './ToastNotification.module.css';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { useEffect } from 'react';

function ToastNotification() {
  const state = useSelector((state: RootState) => state.notification);
  const dispatch = useDispatch();
  useEffect(() => {
    if (state) {
      console.log('2');
      const removeNotification = () =>
        dispatch({ type: 'notification/removeNotification', payload: '' });
      setTimeout(removeNotification, 3000);
    }
  }, [state]);

  if (!state) {
    return <></>;
  } else {
    return <div className={styles.toastNotification}>{state}</div>;
  }
}

export default ToastNotification;
