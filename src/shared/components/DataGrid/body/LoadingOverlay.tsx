import styles from "../styles/overlay.module.css";

/** Overlay che body khi tải lần đầu */
const LoadingOverlay = () => (
  <div className={styles.overlay} role="status" aria-label="Đang tải dữ liệu">
    <div className={styles.spinner} />
  </div>
);

export default LoadingOverlay;
