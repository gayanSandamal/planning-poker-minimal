import { ref } from "vue";

/** Games this browser has opened, kept only in localStorage (no account). */
export interface RecentGame {
  id: string;
  name: string;
  deck: string;
  lastVisited: number;
}

const KEY = "ppm.recentGames";
const MAX = 8;

function read(): RecentGame[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(parsed)
      ? parsed.filter((g) => g && typeof g.id === "string")
      : [];
  } catch {
    return [];
  }
}

const recentGames = ref<RecentGame[]>(read());

function save(list: RecentGame[]) {
  recentGames.value = list;
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    // Storage full or blocked: keep the in-memory list for this visit.
  }
}

export function useRecentGames() {
  const remember = (game: Omit<RecentGame, "lastVisited">) => {
    const rest = recentGames.value.filter((g) => g.id !== game.id);
    save([{ ...game, lastVisited: Date.now() }, ...rest].slice(0, MAX));
  };

  const forget = (id: string) => {
    save(recentGames.value.filter((g) => g.id !== id));
  };

  return { recentGames, remember, forget };
}

/** "just now", "5 min ago", "3 days ago". */
export function timeAgo(ts: number, now = Date.now()): string {
  const s = Math.max(0, Math.round((now - ts) / 1000));
  if (s < 60) return "just now";
  const m = Math.round(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} hr${h === 1 ? "" : "s"} ago`;
  const d = Math.round(h / 24);
  if (d < 30) return `${d} day${d === 1 ? "" : "s"} ago`;
  const mo = Math.round(d / 30);
  return `${mo} month${mo === 1 ? "" : "s"} ago`;
}
