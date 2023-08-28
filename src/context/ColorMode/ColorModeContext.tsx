import {
  colors,
  createTheme,
  CssBaseline,
  responsiveFontSizes,
  ThemeProvider,
} from "@material-ui/core";
import React, { useEffect, useMemo, useState } from "react";
import ReloadPageDialog from "../../components/ReloadPageDialog.tsx";
import {
  getValueFromLocalStorage,
  saveValueToLocalStorage,
} from "../../utils/localStorage.ts";
import { COLOR_SCHEME_KEY, DEFAULT_COLOR, IColorModeContext } from "./types.ts";

const ColorModeContext = React.createContext<IColorModeContext>({
  toggleDarkMode: () => {},
  isDarkMode: false,
  countryColor:
    getValueFromLocalStorage<string>(COLOR_SCHEME_KEY) ?? DEFAULT_COLOR,
  setCountryColor: () => {},
});

function initColorScheme(): boolean {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const savedScheme = getValueFromLocalStorage<boolean>(COLOR_SCHEME_KEY);
  return savedScheme ?? prefersDark;
}

export default function ToggleColorModeContext(props: {
  children: React.ReactNode;
}) {
  const [showReloadDialog, setShowReloadDialog] = useState<boolean>(false);
  const [countryColor, setCountryColor] = useState<
    IColorModeContext["countryColor"]
  >(getValueFromLocalStorage<string>("color") ?? DEFAULT_COLOR);
  const isDarkMode: IColorModeContext["isDarkMode"] = useMemo(
    initColorScheme,
    [],
  );
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setShowReloadDialog(true);
      },
    }),
    [],
  );

  const theme = responsiveFontSizes(
    React.useMemo(
      () =>
        createTheme({
          palette: {
            type: isDarkMode ? "dark" : "light",
            primary: colors.indigo,
          },
        }),
      [isDarkMode],
    ),
  );

  return (
    <ColorModeContext.Provider
      value={{
        toggleDarkMode: colorMode.toggleColorMode,
        isDarkMode: isDarkMode,
        setCountryColor,
        countryColor,
      }}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ReloadPageDialog
          open={showReloadDialog}
          onCloseDialog={(op) => {
            setShowReloadDialog(false);
            if (op) {
              window.location.reload();
              saveValueToLocalStorage(COLOR_SCHEME_KEY, !isDarkMode);
            }
          }}
        />
        {props.children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export const useColorModeContext = () => React.useContext(ColorModeContext);
