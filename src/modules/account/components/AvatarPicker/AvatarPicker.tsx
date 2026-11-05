import { Avatar, Icon } from '@/modules/ui-core';
import styles from './AvatarPicker.module.scss';
import type { AvatarPickerProps } from './AvatarPicker.type';

export function AvatarPicker({ id, name, color, src, onPick, onRemove, disabled }: AvatarPickerProps) {
  return (
    <div className={styles.wrap}>
      <div className={styles.avatar}>
        <Avatar name={name || '?'} color={color} src={src} size={88} />
        <label htmlFor={id} className={styles.camera} aria-label="Chọn ảnh đại diện">
          <Icon name="camera" size={18} />
        </label>
      </div>
      <div className={styles.actions}>
        <label htmlFor={id} className={styles.link}>{src ? 'Đổi ảnh' : 'Thêm ảnh đại diện'}</label>
        {src && onRemove && (
          <button type="button" className={styles.remove} onClick={onRemove} disabled={disabled}>
            Gỡ ảnh
          </button>
        )}
      </div>
      <input
        id={id}
        type="file"
        accept="image/*"
        className={styles.file}
        disabled={disabled}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onPick(file);
          e.target.value = '';
        }}
      />
    </div>
  );
}
