export interface IColorModeContext {
  toggleColorMode: () => void;
  mode: ColorScheme;
}

export enum ColorScheme {
  LIGHT = "light",
  DARK = "dark",
}

export const COLOR_SCHEME_KEY = "colorScheme";
