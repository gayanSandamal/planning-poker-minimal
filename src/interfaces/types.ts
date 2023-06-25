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
}

export interface VotingSystem {
  id: number;
  label: string;
  pattern?: string[];
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
