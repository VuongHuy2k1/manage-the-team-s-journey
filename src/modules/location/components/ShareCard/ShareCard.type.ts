export interface ShareCardProps {
  sharing: boolean;
  /** "cập nhật 2 phút trước" */
  updatedText?: string;
  busy: boolean;
  errorText?: string;
  sharingCount: number;
  onToggle: () => void;
}
