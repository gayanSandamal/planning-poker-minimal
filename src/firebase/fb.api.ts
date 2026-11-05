import { useFirestore } from "vuefire";
import {
  doc,
  collection,
  addDoc,
  setDoc,
  updateDoc,
  runTransaction,
  arrayUnion,
  arrayRemove,
  FieldPath,
  type DocumentData,
  type UpdateData,
} from "firebase/firestore";
import { nanoid } from "nanoid";
import type { Game, Member, ReactionKind, Story } from "@/interfaces/types";

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
  extra:
    | Record<string, unknown>
    | ((game: Record<string, unknown>) => Record<string, unknown>) = {}
): Promise<void> {
  const ref = doc(db, GAME_COLLECTION, gameId);
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists()) throw new Error("Game not found");
    const data = snap.data();
    const users: Member[] = Array.isArray(data.users) ? data.users : [];
    const more = typeof extra === "function" ? extra(data) : extra;
    tx.update(ref, { ...more, users: update(users) });
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
    // Only touch `reactions` when there are some to clear.
    (game) =>
      "reactions" in game ? { reveal: false, reactions: {} } : { reveal: false }
  );
}

/**
 * Add or remove one cheer. Uses arrayUnion/arrayRemove on a single field
 * path, so simultaneous reactions from different players never collide.
 */
export function setReaction(
  gameId: string,
  targetId: string,
  kind: ReactionKind,
  reactorId: string,
  on: boolean
): Promise<void> {
  return updateDoc(
    doc(db, GAME_COLLECTION, gameId),
    new FieldPath("reactions", targetId, kind),
    on ? arrayUnion(reactorId) : arrayRemove(reactorId)
  );
}

/**
 * Start a fresh game with the same name and deck, and point the old game at
 * it so everyone still in the old game can follow with one click.
 */
export async function startNextGame(
  previousGameId: string,
  previous: Pick<Game, "name" | "votingSystem">
): Promise<string> {
  const next: Game = {
    name: previous.name,
    votingSystem: previous.votingSystem,
    users: [],
    reveal: false,
    currentStory: "",
  };
  const ref = await addDoc(collection(db, GAME_COLLECTION), next);
  try {
    await setDoc(
      doc(db, GAME_COLLECTION, previousGameId),
      { nextGameId: ref.id },
      { merge: true }
    );
  } catch {
    // Only the "join the new game" banner for others is lost.
  }
  return ref.id;
}

/* ── Story queue ──────────────────────────────────────────────────────── */

export const STORY_TITLE_MAX = 200;
export const STORY_QUEUE_MAX = 100;

type GameData = Record<string, unknown>;

const storiesOf = (game: GameData): Story[] =>
  Array.isArray(game.stories) ? (game.stories as Story[]) : [];

/** Fields that start a fresh round: votes cleared, cards hidden, no cheers. */
function freshRound(game: GameData): GameData {
  const users: Member[] = Array.isArray(game.users) ? game.users : [];
  return {
    reveal: false,
    users: users.map((u) => ({ ...u, vote: "" })),
    ...("reactions" in game ? { reactions: {} } : {}),
  };
}

/** Make `story` the one being estimated, starting a fresh round. */
function pointAt(game: GameData, story: Story | undefined): GameData {
  return {
    ...freshRound(game),
    currentStoryId: story?.id ?? "",
    currentStory: story?.title ?? "",
  };
}

/** Transaction that patches the game from its latest server copy. */
async function patchGame(
  gameId: string,
  patch: (game: GameData) => GameData | null
): Promise<void> {
  const ref = doc(db, GAME_COLLECTION, gameId);
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists()) throw new Error("Game not found");
    const changes = patch(snap.data());
    if (changes) tx.update(ref, changes as UpdateData<DocumentData>);
  });
}

/**
 * Append stories (one title each). If nothing is being estimated yet and no
 * one has voted, the first new story becomes the current one.
 */
export function addStories(gameId: string, titles: string[]): Promise<void> {
  const clean = titles
    .map((t) => t.trim().slice(0, STORY_TITLE_MAX))
    .filter(Boolean);
  if (!clean.length) return Promise.resolve();
  return patchGame(gameId, (game) => {
    const existing = storiesOf(game);
    const room = STORY_QUEUE_MAX - existing.length;
    if (room <= 0) throw new Error("Story queue is full");
    const added: Story[] = clean
      .slice(0, room)
      .map((title) => ({ id: nanoid(10), title }));
    const stories = [...existing, ...added];
    const users: Member[] = Array.isArray(game.users) ? game.users : [];
    const idle =
      !game.currentStoryId && !game.reveal && users.every((u) => !u.vote);
    return idle ? { stories, ...pointAt(game, added[0]) } : { stories };
  });
}

export function removeStory(gameId: string, storyId: string): Promise<void> {
  return patchGame(gameId, (game) => {
    const stories = storiesOf(game).filter((s) => s.id !== storyId);
    return game.currentStoryId === storyId
      ? { stories, currentStoryId: "", currentStory: "" }
      : { stories };
  });
}

export function selectStory(gameId: string, storyId: string): Promise<void> {
  return patchGame(gameId, (game) => {
    const story = storiesOf(game).find((s) => s.id === storyId);
    return story ? pointAt(game, story) : null;
  });
}

/** Rename a story; keeps the header in sync if it's the current one. */
export function renameStory(
  gameId: string,
  storyId: string,
  title: string
): Promise<void> {
  const clean = title.trim().slice(0, STORY_TITLE_MAX);
  if (!clean) return Promise.resolve();
  return patchGame(gameId, (game) => {
    const stories = storiesOf(game).map((s) =>
      s.id === storyId ? { ...s, title: clean } : s
    );
    return game.currentStoryId === storyId
      ? { stories, currentStory: clean }
      : { stories };
  });
}

/**
 * Save the agreed estimate for a story. With `advance`, move straight on to
 * the next story that still needs an estimate (in queue order, wrapping).
 * Returns whether there was a next story to move to.
 */
export async function saveEstimate(
  gameId: string,
  storyId: string,
  estimate: string,
  advance: boolean
): Promise<boolean> {
  let moved = false;
  await patchGame(gameId, (game) => {
    const stories = storiesOf(game).map((s) =>
      s.id === storyId ? { ...s, estimate } : s
    );
    if (!advance) return { stories };
    const at = stories.findIndex((s) => s.id === storyId);
    const ordered = [...stories.slice(at + 1), ...stories.slice(0, at)];
    const next = ordered.find((s) => !s.estimate);
    moved = !!next;
    return next ? { stories, ...pointAt(game, next) } : { stories };
  });
  return moved;
}
