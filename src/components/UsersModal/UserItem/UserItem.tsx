import styles from './UserItem.module.css';
import { useRef, useState } from 'react';
import { Dispatch, SetStateAction } from 'react';
import { useDispatch } from 'react-redux';

type Props = {
  fullName: string;
  pictureProfile: string;
  uid: string;
};

function UserItem({ fullName, pictureProfile, uid }: Props) {
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const ref = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();

  const handleClick = () => {
    const input = ref.current as HTMLInputElement;
    const checked = input.checked;
    input.checked = !checked;
    console.log();
    if (!checked) {
      dispatch({
        type: 'userSelection/addUser',
        payload: uid,
      });
    } else {
      dispatch({
        type: 'userSelection/removeUser',
        payload: uid,
      });
    }
    setIsSelected(!checked);
  };

  return (
    <div onClick={handleClick} className={styles.userItem}>
      <input ref={ref} type='checkbox' />
      <img src={pictureProfile} alt="Photo de profil d'un utilisateur" />
      <p>{fullName}</p>
    </div>
  );
}

export default UserItem;
