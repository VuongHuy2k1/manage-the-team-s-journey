'use client';

import { ROUTES } from '@/core/config/routes.config';
import { AppHeader, Button, FormField, Icon, Input } from '@/modules/ui-core';
import { ResetOption } from '../../components/ResetOption/ResetOption';
import { RESET_CONFIRM_WORD, useResetData } from '../../hooks/useResetData.hook';
import styles from './ResetDataScreen.module.scss';

/** Nhóm trưởng dọn dữ liệu chạy thử trước khi cả nhóm dùng thật */
export function ResetDataScreen() {
  const r = useResetData();

  if (!r.isLeader) {
    return (
      <>
        <AppHeader variant="plain" backHref={ROUTES.account} title="Dọn dữ liệu thử" />
        <main className={styles.main}>
          <p className={styles.note}>Chỉ nhóm trưởng mới dùng được chức năng này.</p>
        </main>
      </>
    );
  }

  return (
    <>
      <AppHeader variant="plain" backHref={ROUTES.account} title="Dọn dữ liệu thử" eyebrow="Chuẩn bị dùng thật" />
      <main className={styles.main}>
        {r.done && (
          <div className={styles.success} role="status">
            <Icon name="check-circle" size={20} />
            <span>Đã dọn xong. Cả nhóm sẽ thấy dữ liệu mới ngay.</span>
          </div>
        )}

        <p className={styles.note}>
          Chọn những gì cần xoá. <b>Lịch trình hiện tại, khoản dự tính, thông tin MoMo và danh sách thành viên được giữ nguyên.</b> Không hoàn tác được.
        </p>

        <div className={styles.options}>
          <ResetOption
            id="reset-history"
            title="Lịch sử thay đổi lịch trình"
            description="Xoá các phiên bản cũ và yêu cầu đổi lịch. Lịch hiện tại trở thành v1."
            count={r.counts.history}
            checked={r.options.history}
            onChange={(v) => r.toggle('history', v)}
          />
          <ResetOption
            id="reset-ledger"
            title="Lịch sử giao dịch quỹ"
            description="Xoá toàn bộ các dòng cộng / trừ tiền trong lịch sử quỹ."
            count={r.counts.ledger}
            checked={r.options.ledger}
            onChange={(v) => r.toggle('ledger', v)}
          />
          <ResetOption
            id="reset-spending"
            title="Hoàn thành & khoản chi"
            description="Bỏ đánh dấu hoàn thành các mốc, xoá khoản chi ngoài lịch. Khoản dự tính trở về “chưa chi”."
            count={r.counts.spending}
            checked={r.options.spending}
            onChange={(v) => r.toggle('spending', v)}
          />
          <ResetOption
            id="reset-fund"
            title="Thu quỹ & số dư"
            description="Bỏ tick đã nộp ở mọi lần thu (giữ mức nộp), đưa số dư quỹ về 0đ."
            count={r.counts.fund}
            checked={r.options.fund}
            onChange={(v) => r.toggle('fund', v)}
          />
        </div>

        <FormField label={`Gõ ${RESET_CONFIRM_WORD} để xác nhận`} htmlFor="reset-confirm">
          <Input
            id="reset-confirm"
            value={r.confirmText}
            onChange={(e) => r.setConfirmText(e.target.value)}
            autoCapitalize="characters"
            autoComplete="off"
            placeholder={RESET_CONFIRM_WORD}
            mono
          />
        </FormField>

        <Button size="lg" variant="danger" icon="trash" block disabled={!r.canSubmit} onClick={r.submit} loadingText="Đang dọn dữ liệu…">
          Xoá dữ liệu đã chọn
        </Button>
        <p className={styles.hint}>Bản nháp riêng của các thành viên khác không bị xoá; họ có thể tự huỷ trong trang Bản nháp.</p>
      </main>
    </>
  );
}
