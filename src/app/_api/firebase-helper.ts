import {
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { firstValueFrom } from 'rxjs';

export async function docExists(
  doc: AngularFirestoreDocument<any>
): Promise<boolean> {
  const snapshot = await doc.ref.get();
  return snapshot.exists;
}

export async function docsExists(
  ref: AngularFirestoreCollection<any>
): Promise<boolean> {
  const snapshot = await firstValueFrom(ref.get());
  return !snapshot.empty;
}
