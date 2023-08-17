import React from "react";
import ReactDOM from "react-dom";
import App from "./App.tsx";
import "./index.css";
import ToggleColorModeContext from "./context/ColorMode/ColorModeContext.tsx";
import "mapbox-gl/dist/mapbox-gl.css";

ReactDOM.render(
  <React.StrictMode>
    <ToggleColorModeContext>
      <App />
    </ToggleColorModeContext>
  </React.StrictMode>,
  document.getElementById("root"),
);
