import type { Fund } from '@/modules/fund/fund.type';
import type { Block } from '@/modules/schedule/schedule.type';
import type { TripDoc, TripState } from '../store/trip.store';

export const MEMBER_COLORS = ['#FFA31A', '#7FB2FF', '#5DDBB4', '#FFC9A3', '#C9B8FF', '#FFE08A', '#A8D8FF', '#F7B2C4', '#B8E07A', '#9EE0D0', '#FFB38A', '#D4C2FF'];

/** Màu cố định theo uid để mỗi người luôn một màu */
export function colorForId(id: string): string {
  let hash = 0;
  for (const ch of id) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return MEMBER_COLORS[hash % MEMBER_COLORS.length];
}

const p = (amount: number) => ({ amount, unit: 'person' as const });
const g = (amount: number) => ({ amount, unit: 'group' as const });
const HOUSE = '[Địa chỉ nhà thuê]';
const BUS_STATION = 'Bến xe liên tỉnh Đà Lạt';

export const SEED_SCHEDULE: Block[] = [
  { id: 'b-bus', day: 0, time: '', title: 'Xe khứ hồi An Sương ⇄ Đà Lạt', category: 'move', address: 'Bến xe An Sương', estimate: p(600000) },
  { id: 'b-house', day: 0, time: '', title: 'Thuê nhà 2 đêm', category: 'rest', address: HOUSE, estimate: g(4500000) },

  { id: 'b-101', day: 1, time: '07:00', title: 'Tới bến xe, taxi về nhà gửi đồ', category: 'move', address: BUS_STATION, mapQuery: BUS_STATION, estimate: p(30000) },
  { id: 'b-102', day: 1, time: '08:00', title: 'Bánh căn Nhà Chung', category: 'food', address: 'Nhà Chung, Đà Lạt', mapQuery: 'Bánh căn Nhà Chung Đà Lạt', note: 'Bánh căn chấm xíu mại', estimate: p(50000) },
  { id: 'b-103', day: 1, time: '09:00', title: 'Cafe view Hồ Xuân Hương', category: 'food', address: 'Hồ Xuân Hương, Đà Lạt', estimate: p(60000) },
  { id: 'b-104', day: 1, time: '10:30', title: 'Vườn hoa thành phố', category: 'place', address: 'Trần Quốc Toản, Đà Lạt', mapQuery: 'Vườn hoa thành phố Đà Lạt', estimate: null },
  { id: 'b-105', day: 1, time: '12:00', title: 'Ăn trưa cơm niêu', category: 'food', address: '[Địa chỉ quán cơm niêu]', mapQuery: 'Cơm niêu Đà Lạt', estimate: p(100000) },
  { id: 'b-106', day: 1, time: '13:30', title: 'Nhận phòng, ngủ trưa', category: 'rest', address: HOUSE, estimate: null, costLabel: 'Đã tính tiền nhà' },
  { id: 'b-107', day: 1, time: '16:30', title: 'Quảng trường Lâm Viên', category: 'place', address: 'Trần Quốc Toản, Đà Lạt', mapQuery: 'Quảng trường Lâm Viên Đà Lạt', note: 'Đón hoàng hôn', estimate: p(0) },
  { id: 'b-108', day: 1, time: '18:30', title: 'Lẩu gà lá é', category: 'food', address: '[Địa chỉ quán lẩu]', mapQuery: 'Lẩu gà lá é Đà Lạt', note: 'Gọi đặt bàn trước cho 9 người', estimate: p(200000) },
  { id: 'b-109', day: 1, time: '20:00', title: 'Chợ đêm Đà Lạt', category: 'food', address: 'Nguyễn Thị Minh Khai, Đà Lạt', mapQuery: 'Chợ đêm Đà Lạt', note: 'Bánh tráng nướng, sữa đậu nành nóng', estimate: p(100000) },

  { id: 'b-201', day: 2, time: '08:30', title: 'Bánh mì xíu mại', category: 'food', address: '[Địa chỉ quán]', mapQuery: 'Bánh mì xíu mại Đà Lạt', estimate: p(50000) },
  { id: 'b-202', day: 2, time: '09:30', title: 'Cáp treo Robin Hill (1 chiều)', category: 'place', address: 'Đồi Robin, Đống Đa, Đà Lạt', mapQuery: 'Cáp treo Đà Lạt đồi Robin', note: 'Taxi tới ga cáp treo', estimate: p(80000) },
  { id: 'b-203', day: 2, time: '10:15', title: 'Thiền viện Trúc Lâm', category: 'place', address: 'Hồ Tuyền Lâm, Đà Lạt', mapQuery: 'Thiền viện Trúc Lâm Đà Lạt', estimate: p(0) },
  { id: 'b-204', day: 2, time: '11:15', title: 'Cafe ven hồ Tuyền Lâm', category: 'food', address: 'Hồ Tuyền Lâm, Đà Lạt', note: 'Gọi taxi đón về', estimate: p(60000) },
  { id: 'b-205', day: 2, time: '12:30', title: 'Ăn trưa, về nhà nghỉ', category: 'rest', address: HOUSE, estimate: p(100000) },
  { id: 'b-206', day: 2, time: '15:30', title: 'Ga Đà Lạt', category: 'place', address: 'Quang Trung, Đà Lạt', mapQuery: 'Ga Đà Lạt', estimate: null },
  { id: 'b-207', day: 2, time: '16:30', title: 'Biệt thự Hằng Nga (Crazy House)', category: 'place', address: 'Huỳnh Thúc Kháng, Đà Lạt', mapQuery: 'Crazy House Đà Lạt', estimate: null },
  { id: 'b-208', day: 2, time: '18:30', title: 'Nem nướng, bánh ướt lòng gà', category: 'food', address: '[Địa chỉ quán]', mapQuery: 'Bánh ướt lòng gà Đà Lạt', estimate: p(120000) },
  { id: 'b-209', day: 2, time: '20:00', title: 'Cafe acoustic', category: 'food', address: '[Địa chỉ quán]', mapQuery: 'Cafe acoustic Đà Lạt', estimate: p(80000) },

  { id: 'b-301', day: 3, time: '08:30', title: 'Ăn sáng gần nhà', category: 'food', address: HOUSE, estimate: p(50000) },
  { id: 'b-302', day: 3, time: '09:15', title: 'Langbiang – đỉnh Rada', category: 'place', address: 'Khu du lịch Langbiang, Lạc Dương', mapQuery: 'Khu du lịch Langbiang', note: 'Vé cổng + jeep khứ hồi, hẹn taxi đón về', estimate: p(150000) },
  { id: 'b-303', day: 3, time: '11:30', title: 'Trả phòng, gửi hành lý', category: 'rest', address: HOUSE, estimate: null, costLabel: 'Đã tính tiền nhà' },
  { id: 'b-304', day: 3, time: '12:15', title: 'Mì Quảng gà / bún bò', category: 'food', address: '[Địa chỉ quán]', estimate: p(70000) },
  { id: 'b-305', day: 3, time: '14:00', title: 'Dinh Bảo Đại', category: 'place', address: 'Triệu Việt Vương, Đà Lạt', mapQuery: 'Dinh Bảo Đại Đà Lạt', estimate: null },
  { id: 'b-306', day: 3, time: '15:30', title: 'Cafe view đồi', category: 'food', address: '[Địa chỉ quán]', estimate: p(60000) },
  { id: 'b-307', day: 3, time: '17:00', title: 'Chợ Đà Lạt mua đặc sản', category: 'place', address: 'Nguyễn Thị Minh Khai, Đà Lạt', mapQuery: 'Chợ Đà Lạt', estimate: null, costLabel: 'Tự túc' },
  { id: 'b-308', day: 3, time: '18:30', title: 'Lẩu bò', category: 'food', address: '[Địa chỉ quán]', mapQuery: 'Lẩu bò Đà Lạt', estimate: p(200000) },
  { id: 'b-309', day: 3, time: '20:00', title: 'Lấy đồ, ra bến xe', category: 'move', address: BUS_STATION, mapQuery: BUS_STATION, note: 'Có mặt trước 20:45, xe chạy 21:00', estimate: p(30000) },
];

/** Link quỹ nhóm MoMo (nhóm trưởng sửa được trong app) */
export const DEFAULT_MOMO_FUND_LINK = 'https://quy.momo.vn/v2/AXn5HpzCnC?cover=a9c4';

const SEED_FUND: Fund = {
  balance: 0,
  balanceUpdatedAt: null,
  balanceUpdatedBy: null,
  target: 3000000,
  contributions: {},
  momo: { accountName: '', phone: '', note: 'DALAT + tên bạn', qrDataUrl: null, fundLink: DEFAULT_MOMO_FUND_LINK },
};

/** Dữ liệu chuyến đi ban đầu, nhóm trưởng đầu tiên tạo khi vào lần đầu */
export function createSeedTripDoc(creatorId: string, at: string): TripDoc {
  return {
    schemaVersion: 1,
    schedule: SEED_SCHEDULE,
    versions: [
      { number: 1, type: 'create', at, title: 'Tạo lịch 3 ngày 2 đêm', proposedBy: creatorId, decidedBy: creatorId, changes: [], schedule: SEED_SCHEDULE },
    ],
    requests: [],
    completions: {},
    pendingCompletions: [],
    fund: SEED_FUND,
  };
}

/** Trạng thái rỗng trước khi tải xong dữ liệu */
export function createEmptyState(): TripState {
  return {
    schemaVersion: 1,
    members: [],
    removedMembers: [],
    leaderIds: [],
    currentMemberId: '',
    schedule: [],
    versions: [],
    drafts: {},
    requests: [],
    completions: {},
    pendingCompletions: [],
    fund: SEED_FUND,
  };
}
