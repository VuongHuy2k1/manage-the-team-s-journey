import type { ProfileDraft } from '../../account.type';

export interface ProfileFormProps {
  /** Điền sẵn từ Google */
  initialName: string;
  initialAvatar: string | null;
  email: string;
  busy: boolean;
  error?: string;
  onSubmit: (profile: ProfileDraft) => void;
}
