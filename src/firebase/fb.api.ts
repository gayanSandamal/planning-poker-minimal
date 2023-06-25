import { useFirestore } from "vuefire";
import { doc, collection, addDoc, setDoc } from "firebase/firestore";

export const GAME_COLLECTION = "games";
export const db = useFirestore();

export class Base {
  private _collection;
  constructor(collection: string) {
    this._collection = collection;
  }
  async addDoc(data: object) {
    return await addDoc(collection(db, this._collection), data);
  }
  async setDoc(document: string, data: object) {
    const cityRef = doc(db, this._collection, document);
    return await setDoc(cityRef, data, { merge: true });
  }
}
