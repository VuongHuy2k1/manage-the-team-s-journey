import { TRIP_ID } from './firebase.client';

/** Cấu trúc dữ liệu trên Firestore */
export const PATHS = {
  trip: () => `trips/${TRIP_ID}`,
  members: () => `trips/${TRIP_ID}/members`,
  member: (uid: string) => `trips/${TRIP_ID}/members/${uid}`,
  leader: (uid: string) => `trips/${TRIP_ID}/leaders/${uid}`,
  draft: (uid: string) => `trips/${TRIP_ID}/drafts/${uid}`,
  locations: () => `trips/${TRIP_ID}/locations`,
  location: (uid: string) => `trips/${TRIP_ID}/locations/${uid}`,
};
