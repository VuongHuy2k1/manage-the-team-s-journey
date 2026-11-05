export type CompareMode = 'changes' | 'side';

export interface CompareViewProps {
  mode: CompareMode;
  onModeChange: (mode: CompareMode) => void;
}
