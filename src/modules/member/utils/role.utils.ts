import type { Member } from '../member.type';

export function indexMembers(members: Member[]): Record<string, Member> {
  return Object.fromEntries(members.map((m) => [m.id, m]));
}

export function memberName(members: Record<string, Member>, id: string | undefined | null, fallback = 'Ai đó'): string {
  return (id && members[id]?.name) || fallback;
}

/** Tên ngắn để hiển thị gọn: "Nhân Nguyễn" → "Nhân" */
export function shortName(name: string): string {
  return /\d/.test(name) ? name : (name.trim().split(/\s+/)[0] ?? name);
}
