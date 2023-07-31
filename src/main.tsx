import React from "react";
import ReactDOM from "react-dom";
import App from "./App.tsx";
import "./index.css";
import ToggleColorModeContext from "./context/ColorModeContext.tsx";
import { CssBaseline } from "@material-ui/core";

ReactDOM.render(
  <React.StrictMode>
    <ToggleColorModeContext>
      <CssBaseline />
      <App />
    </ToggleColorModeContext>
  </React.StrictMode>,
  document.getElementById("root")
);
