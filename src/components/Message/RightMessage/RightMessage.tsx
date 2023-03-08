import styles from './RightMessage.module.css';

function RightMessage({ text }) {
  return <div className={styles.rightMessage}>{text}</div>;
}

export default RightMessage;
