'use client';

import { useState } from 'react';
import { formatWhen } from '@/core/utils/time.utils';
import { Avatar, Badge, Button, MoneyText, Spinner, useDisclosure, useUiLocked, celebrate, notify } from '@/modules/ui-core';
import { RoundHeader } from '../../components/RoundHeader/RoundHeader';
import { useFundRounds } from '../../hooks/useFundRounds.hook';
import { CreateRoundSheet } from '../CreateRoundSheet/CreateRoundSheet';
import styles from './FundRounds.module.scss';

/** Thu quỹ theo từng lần: lần đầu, nộp bổ sung… mỗi lần một bảng đã nộp riêng */
export function FundRounds() {
  const f = useFundRounds();
  const createSheet = useDisclosure();
  /** Ô đang gửi lên máy chủ: khoá lại tới khi xong để không bấm liên tục */
  const [busy, setBusy] = useState<Record<string, boolean>>({});
  const locked = useUiLocked();
  const run = async (key: string, task: () => Promise<unknown>) => {
    if (busy[key]) return;
    setBusy((b) => ({ ...b, [key]: true }));
    try {
      await task();
    } finally {
      setBusy((b) => {
        const next = { ...b };
        delete next[key];
        return next;
      });
    }
  };

  return (
    <section className={styles.card} aria-label="Thu quỹ">
      <div className={styles.head}>
        <div className={styles.titles}>
          <span className={styles.title}>Thu quỹ</span>
          <span className={styles.sub}>
            {f.rounds.length} lần · đã thu <MoneyText value={f.totalCollected} weight={600} />
          </span>
        </div>
        {f.isLeader && (
          <Button size="sm" variant="primary" icon="plus" onClick={createSheet.open}>Lần nộp mới</Button>
        )}
      </div>

      <ul className={styles.rounds}>
        {[...f.rounds].reverse().map((r) => {
          const expanded = f.openId === r.round.id;
          return (
            <li key={r.round.id} className={styles.round}>
              <RoundHeader
                title={r.round.title}
                amount={r.round.amount}
                paidCount={r.paidCount}
                total={r.rows.length}
                collected={r.collected}
                expected={r.expected}
                note={r.round.note}
                expanded={expanded}
                onToggle={() => f.toggleOpen(r.round.id)}
              />
              {expanded && (
                <>
                  <ul className={styles.list}>
                    {r.rows.map((row) => (
                      <li key={row.member.id} className={styles.row}>
                        <Avatar name={row.member.name} color={row.member.color} src={row.member.avatar} size={30} />
                        <span className={styles.name}>
                          {row.member.name}
                          {row.paid && row.at && <span className={styles.when}>{formatWhen(row.at)}</span>}
                        </span>
                        <MoneyText value={row.amount} format="k" weight={500} tone={row.paid ? 'default' : 'muted'} />
                        {f.isLeader ? (
                          <label className={styles.check} aria-busy={busy[`${r.round.id}:${row.member.id}`] || undefined}>
                            {busy[`${r.round.id}:${row.member.id}`] && <Spinner size={14} />}
                            <input
                              type="checkbox"
                              checked={row.paid}
                              disabled={locked}
                              onChange={(e) => {
                                const paid = e.target.checked;
                                void run(`${r.round.id}:${row.member.id}`, async () => {
                                  const ok = await f.toggle(r.round.id, row.member.id, paid);
                                  if (ok && paid) {
                                    celebrate({ count: 14 });
                                    notify(`${row.member.name} đã nộp ${r.round.title}`);
                                  }
                                });
                              }}
                            />
                            <span className={styles.srOnly}>{row.member.name} đã nộp {r.round.title}</span>
                          </label>
                        ) : (
                          <Badge kind={row.paid ? 'ok' : 'warn'}>{row.paid ? 'Đã nộp' : 'Chưa'}</Badge>
                        )}
                      </li>
                    ))}
                  </ul>
                  {f.isLeader && (
                    <p className={styles.foot}>
                      Tick khi đã nhận tiền, số dư quỹ tự cộng.
                      {r.canDelete && (
                        <button type="button" className={styles.delete} disabled={locked} onClick={() => void run(`del:${r.round.id}`, () => f.remove(r.round.id))}>
                          {busy[`del:${r.round.id}`] ? 'Đang xoá…' : 'Xoá lần nộp này'}
                        </button>
                      )}
                    </p>
                  )}
                </>
              )}
            </li>
          );
        })}
      </ul>

      <CreateRoundSheet open={createSheet.isOpen} onClose={createSheet.close} onCreate={f.create} suggestion={f.suggestion} memberCount={f.latest?.rows.length ?? 0} />
    </section>
  );
}
