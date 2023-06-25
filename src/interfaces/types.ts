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
