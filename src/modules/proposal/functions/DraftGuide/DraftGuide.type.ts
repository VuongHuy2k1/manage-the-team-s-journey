export interface DraftGuideProps {
  open: boolean;
  dontShow: boolean;
  onDontShowChange: (value: boolean) => void;
  onClose: () => void;
}
