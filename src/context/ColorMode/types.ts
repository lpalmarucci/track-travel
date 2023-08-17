export interface IColorModeContext {
  toggleColorMode: () => void;
  mode: "light" | "dark";
}

export enum ColorScheme {
  LIGHT,
  DARK,
}

export const COLOR_SCHEME_KEY = "colorScheme";
