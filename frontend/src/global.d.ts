// src/global.d.ts

declare global {
  declare module '*.module.css' {
    const classes: Record<string, string>;
    export default classes;
  }
}
