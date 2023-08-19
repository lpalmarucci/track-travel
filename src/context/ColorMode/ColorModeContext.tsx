import {
  colors,
  createTheme,
  CssBaseline,
  responsiveFontSizes,
  ThemeProvider,
} from "@material-ui/core";
import React, { useState } from "react";
import ReloadPageDialog from "../../components/ReloadPageDialog.tsx";
import {
  getValueFromLocalStorage,
  saveValueToLocalStorage,
} from "../../utils/localStorage.tsx";
import { COLOR_SCHEME_KEY, ColorScheme, IColorModeContext } from "./types.ts";

const ColorModeContext = React.createContext<IColorModeContext>({
  toggleColorMode: () => {},
  mode: ColorScheme.LIGHT,
});

function initColorScheme() {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const savedScheme = getValueFromLocalStorage(COLOR_SCHEME_KEY);
  if (savedScheme) return savedScheme as ColorScheme;
  return prefersDark ? ColorScheme.DARK : ColorScheme.LIGHT;
}

export default function ToggleColorModeContext(props: {
  children: React.ReactNode;
}) {
  const [showReloadDialog, setShowReloadDialog] = useState<boolean>(false);
  const [mode, setMode] =
    React.useState<IColorModeContext["mode"]>(initColorScheme);
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
            type: mode,
            primary: colors.indigo,
          },
        }),
      [mode],
    ),
  );

  return (
    <ColorModeContext.Provider
      value={{ toggleColorMode: colorMode.toggleColorMode, mode }}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ReloadPageDialog
          open={showReloadDialog}
          closeDialog={(op) => {
            setShowReloadDialog(false);
            if (op) {
              setMode((prevMode) => {
                if (prevMode === ColorScheme.LIGHT) {
                  return ColorScheme.DARK;
                }

                return ColorScheme.LIGHT;
              });

              saveValueToLocalStorage(
                COLOR_SCHEME_KEY,
                mode === ColorScheme.LIGHT
                  ? ColorScheme.DARK
                  : ColorScheme.LIGHT,
              );
              window.location.reload();
            }
          }}
        />
        {props.children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export const useColorModeContext = () => React.useContext(ColorModeContext);
