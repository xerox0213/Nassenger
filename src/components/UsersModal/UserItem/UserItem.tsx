import styles from './UserItem.module.css';
import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { SetterType } from '../../../pages/app';

type Props = {
  fullName: string;
  pictureProfile: string;
  uid: string;
  setUserSelected: SetterType<string | null>;
};

function UserItem({ fullName, pictureProfile, uid, setUserSelected }: Props) {
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const ref = useRef<HTMLInputElement>(null);
  const handleClick = () => {
    const input = ref.current as HTMLInputElement;
    const checked = input.checked;
    input.checked = !checked;
    if (!checked) {
      setUserSelected(uid);
    } else {
      setUserSelected(null);
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
