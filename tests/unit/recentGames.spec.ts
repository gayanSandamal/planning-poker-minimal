import { timeAgo } from "@/composables/useRecentGames";

const NOW = new Date("2026-11-05T12:00:00Z").getTime();
const ago = (ms: number) => timeAgo(NOW - ms, NOW);
const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

describe("timeAgo", () => {
  it.each([
    [10_000, "just now"],
    [5 * MIN, "5 min ago"],
    [HOUR, "1 hr ago"],
    [3 * HOUR, "3 hrs ago"],
    [DAY, "1 day ago"],
    [2 * DAY, "2 days ago"],
    [45 * DAY, "2 months ago"],
  ])("%i ms → %s", (ms, label) => {
    expect(ago(ms)).toBe(label);
  });

  it("never goes negative for future timestamps", () => {
    expect(timeAgo(NOW + MIN, NOW)).toBe("just now");
  });
});

describe("useRecentGames", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.resetModules();
  });

  const load = () =>
    // Fresh module per test: the list is read from storage on import.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require("@/composables/useRecentGames").useRecentGames();

  it("puts the latest game first and doesn't duplicate", () => {
    const { recentGames, remember } = load();
    remember({ id: "a", name: "A", deck: "Fibonacci" });
    remember({ id: "b", name: "B", deck: "Fibonacci" });
    remember({ id: "a", name: "A renamed", deck: "Fibonacci" });
    expect(recentGames.value.map((g: { id: string }) => g.id)).toEqual([
      "a",
      "b",
    ]);
    expect(recentGames.value[0].name).toBe("A renamed");
  });

  it("keeps at most 8 games", () => {
    const { recentGames, remember } = load();
    for (let i = 0; i < 12; i++) {
      remember({ id: `g${i}`, name: `Game ${i}`, deck: "" });
    }
    expect(recentGames.value).toHaveLength(8);
    expect(recentGames.value[0].id).toBe("g11");
  });

  it("persists to localStorage and can forget a game", () => {
    const first = load();
    first.remember({ id: "keep", name: "Keep", deck: "" });
    first.remember({ id: "drop", name: "Drop", deck: "" });
    first.forget("drop");

    jest.resetModules();
    const reloaded = load();
    expect(reloaded.recentGames.value.map((g: { id: string }) => g.id)).toEqual(
      ["keep"]
    );
  });

  it("survives corrupt storage", () => {
    localStorage.setItem("ppm.recentGames", "{not json");
    expect(load().recentGames.value).toEqual([]);
  });
});
