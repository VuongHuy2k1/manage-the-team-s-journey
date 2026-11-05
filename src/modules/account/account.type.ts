export type EntryRole = 'member' | 'leader';

/** Các bước ở màn vào web */
export type EntryStep =
  | 'unconfigured'
  | 'loading'
  | 'role'
  | 'login'
  | 'profile'
  | 'passcode'
  | 'removed'
  | 'done';

export interface ProfileDraft {
  name: string;
  avatar: string | null;
}
