import { colors } from "@material-ui/core";
import React from "react";

export interface IColorModeContext {
  toggleDarkMode(): void;
  isDarkMode: boolean;
  countryColor: string;
  setCountryColor: React.Dispatch<React.SetStateAction<string>>;
}

export const DEFAULT_STORAGE_KEY_COUNTRIES = "countries";
export const DARK_MODE_KEY = "darkMode";

export const COLOR_SCHEME_KEY = "colorScheme";

export const DEFAULT_COLOR = colors.indigo[900];
