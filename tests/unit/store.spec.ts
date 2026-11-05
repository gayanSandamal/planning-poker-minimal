import store from "@/store";
import type { Game, Member } from "@/interfaces/types";

const player = (vote: string, extra: Partial<Member> = {}): Member => ({
  id: Math.random().toString(36).slice(2),
  displayName: "Player",
  joinAsSpectator: false,
  admin: false,
  vote,
  ...extra,
});

function withVotes(users: Member[]) {
  const game: Game = {
    name: "Test",
    reveal: true,
    users,
    votingSystem: { id: 1, label: "Fibonacci", pattern: [] },
  };
  store.commit("mutateGameData", game);
}

const average = () => store.getters.getAverageAgreement;
const consensus = () => store.getters.getConsensus;

describe("getAverageAgreement", () => {
  it("averages numeric votes", () => {
    withVotes([player("3"), player("5"), player("8")]);
    expect(average()).toBeCloseTo(16 / 3);
  });

  it("ignores players who haven't voted", () => {
    withVotes([player("5"), player("8"), player("")]);
    expect(average()).toBe(6.5);
  });

  it('ignores "?" and "☕" cards', () => {
    withVotes([player("13"), player("8"), player("?"), player("☕")]);
    expect(average()).toBe(10.5);
  });

  it("ignores spectators", () => {
    withVotes([player("5"), player("100", { joinAsSpectator: true })]);
    expect(average()).toBe(5);
  });

  it('is null when only "?" / "☕" were played', () => {
    withVotes([player("?"), player("☕")]);
    expect(average()).toBeNull();
  });

  it("is null for non-numeric decks", () => {
    withVotes([player("m"), player("l")]);
    expect(average()).toBeNull();
  });

  it("is 0 when nobody has voted yet", () => {
    withVotes([player(""), player("")]);
    expect(average()).toBe(0);
  });
});

describe("getConsensus", () => {
  it("is null for numeric votes (the average is shown instead)", () => {
    withVotes([player("5"), player("8")]);
    expect(consensus()).toBeNull();
  });

  it("is null for numeric votes mixed with special cards", () => {
    withVotes([player("5"), player("?")]);
    expect(consensus()).toBeNull();
  });

  it("finds the most common value for T-shirt sizes", () => {
    withVotes([player("m"), player("m"), player("l")]);
    expect(consensus()).toEqual({ value: "m", count: 2, total: 3 });
  });

  it('leaves "?" / "☕" out of the T-shirt consensus', () => {
    withVotes([player("l"), player("?"), player("?")]);
    expect(consensus()).toEqual({ value: "l", count: 1, total: 1 });
  });

  it("falls back to special cards when they are the only votes", () => {
    withVotes([player("☕"), player("☕"), player("?")]);
    expect(consensus()).toEqual({ value: "☕", count: 2, total: 3 });
  });
});
