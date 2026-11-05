'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { cx } from '../../utils/classNames.utils';
import { Icon } from '../Icon/Icon';
import { Spinner } from '../Spinner/Spinner';
import { useUiLocked } from '../../hooks/useUiLocked.hook';
import { isUiLocked, lockUi } from '../../utils/uiLock.utils';
import styles from './Button.module.scss';
import type { ButtonProps } from './Button.type';

function isPromise(value: unknown): value is Promise<unknown> {
  return typeof (value as Promise<unknown> | undefined)?.then === 'function';
}

export function Button({
  variant = 'secondary',
  size = 'md',
  block = false,
  icon,
  href,
  children,
  className,
  type = 'button',
  loading = false,
  loadingText,
  onClick,
  disabled,
  ...rest
}: ButtonProps) {
  const [running, setRunning] = useState(false);
  const lock = useRef(false);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const uiLocked = useUiLocked();
  const busy = loading || running;
  /** Đang gửi ở chỗ khác thì các nút còn lại tạm khoá để tránh bấm liên tục */
  const blocked = uiLocked && !busy;
  const classes = cx(styles.button, styles[variant], styles[size], block && styles.block, !children && styles.iconOnly, busy && styles.busy, className);
  const iconSize = size === 'sm' ? 16 : 18;
  const label = busy && loadingText ? loadingText : children;
  const content = (
    <>
      {busy ? <Spinner size={iconSize - 2} /> : icon && <Icon name={icon} size={iconSize} />}
      {label && <span>{label}</span>}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={classes}
        aria-label={rest['aria-label']}
        aria-disabled={blocked || undefined}
        onClick={(event) => {
          if (isUiLocked()) event.preventDefault();
        }}
      >
        {content}
      </Link>
    );
  }

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (busy || lock.current) return;
    const result = onClick?.(event);
    if (!isPromise(result)) return;
    lock.current = true;
    setRunning(true);
    const unlock = lockUi();
    result.finally(() => {
      unlock();
      lock.current = false;
      if (mounted.current) setRunning(false);
    });
  };

  return (
    <button type={type} className={classes} disabled={disabled || busy || blocked} aria-busy={busy || undefined} onClick={handleClick} {...rest}>
      {content}
    </button>
  );
}
