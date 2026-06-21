declare module "lenis" {
  interface LenisOptions {
    duration?: number;
    smoothWheel?: boolean;
  }
  export default class Lenis {
    constructor(options?: LenisOptions);
    raf(time: number): void;
    destroy(): void;
  }
}
