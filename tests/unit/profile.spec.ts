import {
  AVATARS,
  PRONOUNS_MAX,
  loadProfile,
  saveProfile,
} from "@/composables/useProfile";

describe("player profile", () => {
  beforeEach(() => localStorage.clear());

  it("is empty for first-time visitors", () => {
    expect(loadProfile()).toEqual({
      displayName: "",
      pronouns: "",
      avatar: "",
    });
  });

  it("round-trips name, pronouns and avatar", () => {
    saveProfile({ displayName: " Priya ", pronouns: "she/her", avatar: "🦊" });
    expect(loadProfile()).toEqual({
      displayName: "Priya",
      pronouns: "she/her",
      avatar: "🦊",
    });
  });

  it("clears fields saved as empty", () => {
    saveProfile({ displayName: "Sam", pronouns: "they/them", avatar: "🐼" });
    saveProfile({ displayName: "Sam", pronouns: "", avatar: "" });
    expect(loadProfile()).toEqual({
      displayName: "Sam",
      pronouns: "",
      avatar: "",
    });
  });

  it("caps pronouns at the max length", () => {
    saveProfile({ displayName: "A", pronouns: "x".repeat(50), avatar: "" });
    expect(loadProfile().pronouns).toHaveLength(PRONOUNS_MAX);
  });

  it("ignores avatars that aren't in the picker", () => {
    localStorage.setItem("ppm.avatar", "<img>");
    expect(loadProfile().avatar).toBe("");
    expect(AVATARS).toContain("🦊");
  });
});
