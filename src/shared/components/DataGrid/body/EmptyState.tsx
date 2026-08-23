import styles from "../styles/overlay.module.css";

const EmptyState = ({ message }: { message: string }) => (
  <div className={styles.empty}>{message}</div>
);

export default EmptyState;
