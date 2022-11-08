import {
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  DocumentData,
  QuerySnapshot
} from '@angular/fire/compat/firestore';
import { firstValueFrom } from 'rxjs';

export async function docExists(
  doc: AngularFirestoreDocument<any>
): Promise<boolean> {
  const snapshot = await doc.ref.get();
  return snapshot.exists;
}

export async function docsExists(
  collection: AngularFirestoreCollection<any>
): Promise<boolean> {
  const snapshot = await firstValueFrom(collection.get());
  return !snapshot.empty;
}

export async function queryWithLargeArray<TDocument = any, TArray = any>(
  array: TArray[],
  queryFunc: (splittedArray: TArray[]) => Promise<QuerySnapshot<DocumentData>>
) {
  const rows: TDocument[] = [];
  for (let i = 0; i < array.length; i += 10) {
    const splitted = array.slice(i, i + 10);
    const snapshot = await queryFunc(splitted);
    snapshot.docs.forEach((doc) => rows.push(doc.data() as TDocument));
  }

  return rows;
}
