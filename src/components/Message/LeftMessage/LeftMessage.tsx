import styles from './LeftMessage.module.css';

type Props = {
  text: string;
};
function LeftMessage({ text }: Props) {
  return <div className={styles.leftMessage}>{text}</div>;
}

export default LeftMessage;
