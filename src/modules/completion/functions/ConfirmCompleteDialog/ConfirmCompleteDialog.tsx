'use client';

import { memberName, RoleTag } from '@/modules/member';
import { indexMembers } from '@/modules/member/utils/role.utils';
import {
  AmountInput,
  Avatar,
  Button,
  ConfirmDialog,
  FormField,
  MoneyText,
  SegmentedControl,
  StatRow,
  cx,
} from '@/modules/ui-core';
import type { PayMethod } from '../../completion.type';
import { useCompleteBlock } from '../../hooks/useCompleteBlock.hook';
import { PAY_METHOD_LABEL, varianceText } from '../../utils/variance.utils';
import styles from './ConfirmCompleteDialog.module.scss';
import type { ConfirmCompleteDialogProps } from './ConfirmCompleteDialog.type';

const PAY_OPTIONS = (Object.keys(PAY_METHOD_LABEL) as PayMethod[]).map((value) => ({ value, label: PAY_METHOD_LABEL[value] }));

export function ConfirmCompleteDialog({ block, onClose, onDone }: ConfirmCompleteDialogProps) {
  const c = useCompleteBlock(block);
  if (!block) return null;

  const byId = indexMembers(c.members);
  const diff = c.variance.diff;

  const handleConfirm = async () => {
    const ok = await c.confirm();
    if (!ok) return;
    onDone?.({ block, confirmed: true });
    onClose();
  };
  const handleRequest = async () => {
    const ok = await c.request();
    if (!ok) return;
    onDone?.({ block, confirmed: false });
    onClose();
  };

  return (
    <ConfirmDialog
      open
      onClose={onClose}
      icon="check"
      iconTone="success"
      title="Xác nhận hoàn thành?"
      subtitle={
        <>
          {block.time && <span className={styles.mono}>{block.time} · </span>}
          {block.title}
        </>
      }
      actions={
        c.isLeader ? (
          <>
            <Button size="lg" onClick={onClose}>Để sau</Button>
            <Button size="lg" variant="success" onClick={handleConfirm} loadingText="Đang lưu…">
              {c.fromFund ? 'Xác nhận & trừ quỹ' : 'Xác nhận hoàn thành'}
            </Button>
          </>
        ) : (
          <>
            <Button size="lg" onClick={onClose}>Để sau</Button>
            <Button size="lg" variant="success" onClick={handleRequest} disabled={Boolean(c.pending)} loadingText="Đang gửi…">
              {c.pending ? 'Đã gửi nhóm trưởng' : 'Gửi nhóm trưởng xác nhận'}
            </Button>
          </>
        )
      }
    >
      <div className={styles.estimate}>
        <StatRow label="Dự tính / người" value={c.estPerPerson === null ? 'Chưa có giá' : <MoneyText value={c.estPerPerson} />} />
        <StatRow label={`Cả nhóm ${c.memberCount} người`} value={c.estGroup === null ? '—' : <MoneyText value={c.estGroup} />} />
      </div>

      {c.pending && (
        <p className={styles.pending}>
          {memberName(byId, c.pending.requestedBy)} đã báo xong mốc này, đang chờ nhóm trưởng nhập số tiền.
        </p>
      )}

      {c.isLeader ? (
        <>
          <FormField label="Chi phí thực tế" htmlFor="actual-amount" aside={<RoleTag label="Nhóm trưởng nhập" tone="soft" />}
            hint={
              <>
                = <MoneyText value={c.actualPerPerson} /> mỗi người ·{' '}
                <b className={cx(diff !== null && diff > 0 && styles.over, diff !== null && diff < 0 && styles.under)}>{varianceText(c.variance)}</b>
              </>
            }
          >
            <AmountInput id="actual-amount" value={c.amount} unit={c.unit} onValueChange={c.setAmount} onUnitChange={c.setUnit} large />
          </FormField>

          <FormField label="Trả bằng">
            <SegmentedControl options={PAY_OPTIONS} value={c.payMethod} onChange={c.setPayMethod} ariaLabel="Trả bằng" wrap />
          </FormField>

          {c.payMethod === 'advance' && (
            <FormField label="Ai ứng trước?">
              <div className={styles.people}>
                {c.members.map((m) => (
                  <button key={m.id} type="button" className={styles.person} aria-pressed={c.paidBy === m.id} onClick={() => c.setPaidBy(m.id)}>
                    <Avatar name={m.name} color={m.color} src={m.avatar} size={36} selected={c.paidBy === m.id} />
                    <span>{m.name.split(' ').pop()}</span>
                  </button>
                ))}
              </div>
            </FormField>
          )}

          {c.fromFund && (
            <div className={styles.fund}>
              <StatRow label="Quỹ hiện có" value={<MoneyText value={c.fundBefore} weight={500} />} />
              <StatRow label="Trừ mốc này" value={<MoneyText value={-c.actualTotal} signed tone="danger" weight={500} />} />
              <StatRow label="Quỹ còn lại" value={<MoneyText value={c.fundAfter} tone={c.fundAfter < 0 ? 'danger' : 'default'} />} strong divider />
            </div>
          )}
        </>
      ) : (
        <p className={styles.note}>Nhóm trưởng sẽ nhập số tiền thực tế và trừ quỹ khi xác nhận.</p>
      )}
    </ConfirmDialog>
  );
}
