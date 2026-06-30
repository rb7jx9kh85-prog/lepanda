import { doc, getDoc } from 'firebase/firestore';
import { db, RESTAURANT_ID } from '@/lib/firebase';

export async function getClosedDates(): Promise<string[]> {
  const ref = doc(db, 'restaurants', RESTAURANT_ID, 'closed_dates', 'config');
  const snap = await getDoc(ref);
  if (!snap.exists()) return [];
  const data = snap.data();
  return Array.isArray(data.dates) ? data.dates : [];
}
