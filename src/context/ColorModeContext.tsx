import { ThemeProvider, colors, createTheme } from "@material-ui/core";
import React from "react";

interface IColorModeContext {
  toggleColorMode: () => void;
  mode: "light" | "dark";
}

const ColorModeContext = React.createContext<IColorModeContext>({
  toggleColorMode: () => {},
  mode: "light",
});

export default function ToggleColorModeContext(props: {
  children: React.ReactNode;
}) {
  const [mode, setMode] = React.useState<IColorModeContext["mode"]>("dark");
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          if (prevMode === "light") {
            document.documentElement.classList.add("dark");
            return "dark";
          }
          document.documentElement.classList.remove("dark");
          return "light";
        });
      },
    }),
    []
  );

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          type: mode,
          primary: colors.orange,
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider
      value={{ toggleColorMode: colorMode.toggleColorMode, mode }}
    >
      <ThemeProvider theme={theme}>{props.children}</ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export const useColorModeContext = () => React.useContext(ColorModeContext);
