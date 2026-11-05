'use client';

import { useState } from 'react';
import { Button, Icon } from '@/modules/ui-core';
import styles from './InAppBrowserNotice.module.scss';

export function InAppBrowserNotice() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };
  return (
    <div className={styles.box} role="note">
      <Icon name="arrow-up-right" size={20} className={styles.icon} />
      <div className={styles.text}>
        <b>Hãy mở bằng Chrome hoặc Safari</b>
        <span>Google không cho đăng nhập trong trình duyệt của Zalo/Messenger. Bấm ⋯ ở góc trên → “Mở bằng trình duyệt”, hoặc chép link rồi dán vào Chrome/Safari.</span>
        <Button size="sm" icon={copied ? 'check' : 'copy'} onClick={copy}>{copied ? 'Đã chép link' : 'Chép link'}</Button>
      </div>
    </div>
  );
}
