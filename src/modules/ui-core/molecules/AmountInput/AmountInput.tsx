import { Input } from '../../atoms/Input/Input';
import { formatMoneyInput, parseMoney } from '../../utils/money.utils';
import { SegmentedControl } from '../SegmentedControl/SegmentedControl';
import styles from './AmountInput.module.scss';
import type { AmountInputProps, AmountUnit } from './AmountInput.type';

const UNIT_OPTIONS: { value: AmountUnit; label: string }[] = [
  { value: 'person', label: '/ người' },
  { value: 'group', label: 'Cả nhóm' },
];

export function AmountInput({ id, value, unit, onValueChange, onUnitChange, large, placeholder = '0' }: AmountInputProps) {
  return (
    <div className={styles.row}>
      <Input
        id={id}
        mono
        large={large}
        inputMode="numeric"
        placeholder={placeholder}
        value={formatMoneyInput(value)}
        onChange={(e) => onValueChange(parseMoney(e.target.value))}
      />
      <SegmentedControl options={UNIT_OPTIONS} value={unit} onChange={onUnitChange} ariaLabel="Cách tính chi phí" />
    </div>
  );
}
