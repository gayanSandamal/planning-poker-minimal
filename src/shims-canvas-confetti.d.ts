declare module "canvas-confetti" {
  interface Options {
    particleCount?: number;
    spread?: number;
    origin?: { x?: number; y?: number };
  }
  function confetti(options?: Options): void;
  export default confetti;
}
