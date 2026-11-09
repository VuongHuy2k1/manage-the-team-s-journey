import { LANDMARK_NAMES, LOADER_SVG } from './tripLoader.art';
import styles from './TripLoader.module.scss';
import type { TripLoaderProps } from './TripLoader.type';

/** Màn chờ: xe của nhóm chạy vòng quanh trái đất qua các địa danh Đà Lạt */
export function TripLoader({ label, size = 300, fullscreen = false }: TripLoaderProps) {
  return (
    <div className={fullscreen ? styles.screen : styles.inline} role="status" aria-live="polite">
      <div className={styles.art} style={{ width: size, height: size }} dangerouslySetInnerHTML={{ __html: LOADER_SVG }} />
      <div className={styles.texts}>
        <span className={styles.title}>
          Cả nhóm đang lên đường<span className={styles.dots}><span>.</span><span>.</span><span>.</span></span>
        </span>
        <div className="tl-lm-names" aria-hidden="true">
          {LANDMARK_NAMES.map((name, i) => (
            <span key={name} className={`tl-lm-name tl-n${i} ${styles.landmark}`}>{name}</span>
          ))}
        </div>
        {label && <span className={styles.label}>{label}</span>}
      </div>
    </div>
  );
}
