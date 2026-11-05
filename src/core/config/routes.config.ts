export const ROUTES = {
  schedule: '/lich-trinh',
  draft: '/ban-nhap',
  compare: '/so-sanh',
  requests: '/yeu-cau',
  history: '/lich-su',
  completed: '/da-xong',
  fund: '/quy',
  fundHistory: '/lich-su-quy',
  estimate: '/du-tinh',
  actual: '/thuc-chi',
  enter: '/vao',
  account: '/tai-khoan',
  members: '/thanh-vien',
  location: '/vi-tri',
  reset: '/don-du-lieu',
} as const;

export type RouteKey = keyof typeof ROUTES;
