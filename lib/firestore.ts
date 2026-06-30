import { collection, getDocs } from 'firebase/firestore';
import { db, RESTAURANT_ID } from '@/lib/firebase';

export async function getClosedDates(): Promise<string[]> {
  const snap = await getDocs(collection(db, 'restaurants', RESTAURANT_ID, 'fermetures'));
  return snap.docs.map((doc) => doc.data().date as string).filter(Boolean);
}
