/**
 * The visitor's player profile, remembered in this browser only so they
 * don't have to set it up again: display name, pronouns and avatar.
 */
export const DISPLAY_NAME_KEY = "planningPokerDisplayName";
const PRONOUNS_KEY = "ppm.pronouns";
const AVATAR_KEY = "ppm.avatar";

export const PRONOUN_PRESETS = ["she/her", "he/him", "they/them"];
export const PRONOUNS_MAX = 20;

/** Neutral, friendly avatars. Empty string means "use my initials". */
export const AVATARS = [
  "🦊",
  "🐼",
  "🦉",
  "🐢",
  "🐙",
  "🦄",
  "🐝",
  "🌻",
  "🌈",
  "🚀",
  "🎧",
  "☕",
];

export interface Profile {
  displayName: string;
  pronouns: string;
  avatar: string;
}

function get(key: string): string {
  try {
    return (localStorage.getItem(key) ?? "").trim();
  } catch {
    return "";
  }
}

function set(key: string, value: string): void {
  try {
    if (value) localStorage.setItem(key, value);
    else localStorage.removeItem(key);
  } catch {
    // Storage blocked: the profile still applies for this game.
  }
}

export function loadProfile(): Profile {
  const avatar = get(AVATAR_KEY);
  return {
    displayName: get(DISPLAY_NAME_KEY),
    pronouns: get(PRONOUNS_KEY).slice(0, PRONOUNS_MAX),
    avatar: AVATARS.includes(avatar) ? avatar : "",
  };
}

export function saveProfile(p: Profile): void {
  set(DISPLAY_NAME_KEY, p.displayName.trim());
  set(PRONOUNS_KEY, p.pronouns.trim().slice(0, PRONOUNS_MAX));
  set(AVATAR_KEY, p.avatar);
}
