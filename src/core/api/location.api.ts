import { collection, doc, onSnapshot, setDoc, type Unsubscribe } from 'firebase/firestore';
import type { SharedLocation } from '@/modules/location/location.type';
import { getFirebase } from '../firebase/firebase.client';
import { PATHS } from '../firebase/firebase.paths';
import { nowISO } from '../utils/id.utils';

export interface Position {
  lat: number;
  lng: number;
  accuracy: number;
}

export async function publishMyLocation(uid: string, pos: Position): Promise<void> {
  const fb = getFirebase();
  if (!fb) return;
  await setDoc(doc(fb.db, PATHS.location(uid)), { ...pos, sharing: true, updatedAt: nowISO() });
}

export async function setSharing(uid: string, sharing: boolean): Promise<void> {
  const fb = getFirebase();
  if (!fb) return;
  await setDoc(doc(fb.db, PATHS.location(uid)), { sharing, updatedAt: nowISO() }, { merge: true });
}

export function subscribeLocations(onChange: (items: SharedLocation[]) => void): Unsubscribe {
  const fb = getFirebase();
  if (!fb) return () => undefined;
  return onSnapshot(
    collection(fb.db, PATHS.locations()),
    (snap) => onChange(snap.docs.map((d) => ({ uid: d.id, ...(d.data() as Omit<SharedLocation, 'uid'>) }))),
    () => onChange([]),
  );
}
