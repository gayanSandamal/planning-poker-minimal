export interface Card {
  value: string;
  name?: string;
}

export interface Member {
  id: string;
  displayName: string;
  joinAsSpectator: boolean;
  admin: boolean;
  vote: string;
  /** Optional, shown next to the name (e.g. "she/her"). */
  pronouns?: string;
  /** Optional emoji shown instead of initials. */
  avatar?: string;
}

/** Kinds of cheers players can give each other after a reveal. */
export type ReactionKind = "agree" | "celebrate" | "insight";

/** target player id → reaction kind → ids of players who reacted. */
export type Reactions = Record<string, Partial<Record<ReactionKind, string[]>>>;

export interface VotingSystem {
  id: number;
  label: string;
  pattern?: string[];
  disabled?: boolean;
}

export interface CustomDeck {
  name: string;
  values: string;
}

export interface Game {
  name: string;
  reveal: boolean;
  users: Member[];
  votingSystem: VotingSystem;
  /** Current story/ticket being estimated (optional). */
  currentStory?: string;
  /** Set when someone starts a follow-up game with the same deck. */
  nextGameId?: string;
  /** Cheers for the current round; cleared on "New Round". */
  reactions?: Reactions;
  /** Backlog for this session, estimated one by one. */
  stories?: Story[];
  /** Id of the story in `stories` being estimated now. */
  currentStoryId?: string;
}

export const ALIGN_LEFT = "left";
export const ALIGN_CENTER = "center";
export const ALIGN_RIGHT = "right";

export const ALIGNMENTS = [ALIGN_LEFT, ALIGN_CENTER, ALIGN_RIGHT];

export type AlignmentTypes =
  | typeof ALIGN_LEFT
  | typeof ALIGN_CENTER
  | typeof ALIGN_RIGHT;

export const ICON_EXTRA_SMALL = "xs";
export const ICON_SMALL = "s";
export const ICON_MEDIUM = "m";
export const ICON_LARGE = "l";
export const ICON_EXTRA_LARGE = "xl";

export const ICON_SIZES = [
  ICON_EXTRA_SMALL,
  ICON_SMALL,
  ICON_MEDIUM,
  ICON_LARGE,
  ICON_EXTRA_LARGE,
];

export type IconSizes =
  | typeof ICON_EXTRA_SMALL
  | typeof ICON_SMALL
  | typeof ICON_MEDIUM
  | typeof ICON_LARGE
  | typeof ICON_EXTRA_LARGE;

/** Non-numeric cards: "not sure" and "need a break". Never counted in averages. */
export const SPECIAL_CARDS = ["?", "☕"];

export const isSpecialCard = (v: string | undefined | null): boolean =>
  !!v && SPECIAL_CARDS.includes(v);

/** A backlog item in the session's story queue. */
export interface Story {
  id: string;
  title: string;
  /** Final agreed estimate, once saved. */
  estimate?: string;
}
