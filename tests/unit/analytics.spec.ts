import { sanitizePath, consent, track } from "@/analytics";

describe("sanitizePath", () => {
  it("replaces game IDs, which work as access links", () => {
    expect(sanitizePath("/qm7217KxUn0VGAL1ZrFB", "game")).toBe("/game");
  });

  it("keeps other routes as they are", () => {
    expect(sanitizePath("/about", "about")).toBe("/about");
    expect(sanitizePath("/new-game", "newgame")).toBe("/new-game");
    expect(sanitizePath("/", "home")).toBe("/");
  });
});

describe("track", () => {
  const debug = jest
    .spyOn(console, "debug")
    .mockImplementation(() => undefined);
  afterEach(() => debug.mockClear());
  afterAll(() => debug.mockRestore());

  it("sends nothing before the visitor has chosen", async () => {
    consent.value = "unset";
    await track("vote_cast");
    expect(debug).not.toHaveBeenCalled();
  });

  it("sends nothing after the visitor declined", async () => {
    consent.value = "denied";
    await track("vote_cast");
    expect(debug).not.toHaveBeenCalled();
  });

  it("logs locally (never sends) outside production once accepted", async () => {
    consent.value = "granted";
    await track("vote_cast", { deck: "Fibonacci" });
    expect(debug).toHaveBeenCalledWith("[analytics]", "vote_cast", {
      deck: "Fibonacci",
    });
  });
});
