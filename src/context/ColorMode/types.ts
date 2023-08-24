import { colors } from "@material-ui/core";
import React from "react";

export interface IColorModeContext {
  toggleColorMode(): void;
  mode: ColorScheme;
  countryColor: string;
  setCountryColor: React.Dispatch<React.SetStateAction<string>>;
}

export enum ColorScheme {
  LIGHT = "light",
  DARK = "dark",
}

export const COLOR_SCHEME_KEY = "colorScheme";
export const DEFAULT_COLOR = colors.indigo[900];
