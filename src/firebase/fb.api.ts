import { useFirestore } from "vuefire";
import {
  doc,
  collection,
  addDoc,
  setDoc,
  runTransaction,
} from "firebase/firestore";
import type { Member } from "@/interfaces/types";

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

/**
 * Read-modify-write the game's `users` array atomically.
 *
 * Writing a locally cached copy of `users` loses concurrent changes (two
 * players voting at once → one vote disappears). A transaction re-reads the
 * latest server copy and retries if someone else wrote in between.
 */
export async function updateGameUsers(
  gameId: string,
  update: (users: Member[]) => Member[],
  extra: Record<string, unknown> = {}
): Promise<void> {
  const ref = doc(db, GAME_COLLECTION, gameId);
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists()) throw new Error("Game not found");
    const current = snap.data().users;
    const users: Member[] = Array.isArray(current) ? current : [];
    tx.update(ref, { ...extra, users: update(users) });
  });
}

export function joinGame(gameId: string, member: Member): Promise<void> {
  return updateGameUsers(gameId, (users) => {
    if (users.some((u) => u.id === member.id)) return users;
    // First player in becomes the admin; decided on the server copy, not a stale local one.
    return [...users, { ...member, admin: users.length === 0 }];
  });
}

export function castVote(
  gameId: string,
  userId: string,
  vote: string
): Promise<void> {
  return updateGameUsers(gameId, (users) =>
    users.map((u) => (u.id === userId ? { ...u, vote } : u))
  );
}

export function resetRound(gameId: string): Promise<void> {
  return updateGameUsers(
    gameId,
    (users) => users.map((u) => ({ ...u, vote: "" })),
    { reveal: false }
  );
}
