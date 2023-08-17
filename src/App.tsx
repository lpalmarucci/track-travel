import { createRef, useMemo, useRef } from "react";
import Map, { Layer, MapEvent, MapRef } from "react-map-gl";
import Header from "./components/Header";
import { colors } from "@material-ui/core";
import { useColorModeContext } from "./context/ColorMode/ColorModeContext.tsx";

const defaultState: number[] = [46, 94, 48];

function App() {
  const { mode } = useColorModeContext();
  const mapRef = createRef<MapRef>();
  const selectedStateId = useRef<number | null>(null);
  const [mapStyle] = useMemo<string>(
    () =>
      mode === "light"
        ? import.meta.env.VITE_MAPBOX_MAP_STYLE_LIGHT
        : import.meta.env.VITE_MAPBOX_MAP_STYLE_DARK,
    [mode],
  );

  const handleMapLoad = (e: MapEvent) => {
    // Add states
    e.target.addSource("states", {
      type: "geojson",
      data: "../src/assets/geoson/ne_110m_admin_0_countries.geojson",
    });

    //Pre color states that have already been selected
    defaultState.forEach((stateId: number) => {
      e.target.setFeatureState(
        {
          source: "states",
          id: stateId,
        },
        { hover: false, selected: true, color: colors.indigo[800] },
      );
    });

    //Add listeners to the map

    e.target.on("click", "state-fills", (ev) => {
      if (ev.features && ev.features.length > 0) {
        const id: string = ev.features[0].id!.toString();
        defaultState.push(parseInt(id));
        e.target.setFeatureState(
          { source: "states", id },
          { hover: false, selected: true, color: colors.indigo[800] },
        );
      }
    });

    e.target.on("mousemove", "state-fills", (ev) => {
      if (ev.features && ev.features.length > 0) {
        if (selectedStateId.current !== null) {
          e.target.setFeatureState(
            { source: "states", id: selectedStateId.current },
            { hover: false },
          );
        }
        if (isNaN(parseInt(ev.features[0].id!.toString()))) {
          throw new Error(
            "Checkout this id inside geoJSON file. ID " + ev.features[0].id,
          );
        }
        const currentId = parseInt(ev.features[0].id!.toString());
        selectedStateId.current = currentId;
        e.target.setFeatureState(
          { source: "states", id: currentId },
          {
            hover: true,
          },
        );
      }
    });

    // When the mouse leaves the state-fill layer, update the feature state of the
    // previously hovered feature.
    e.target.on("mouseleave", "state-fills", () => {
      if (selectedStateId.current !== null) {
        e.target.setFeatureState(
          { source: "states", id: selectedStateId.current },
          { hover: false },
        );
      }
      selectedStateId.current = null;
    });
  };

  return (
    <div className="w-full flex h-screen overflow-hidden">
      <Header />
      <Map
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        initialViewState={{
          longitude: 20,
          latitude: 20,
          zoom: 1.2,
        }}
        minZoom={1.2}
        mapStyle={mapStyle}
        ref={mapRef}
        onLoad={handleMapLoad}
        reuseMaps={true}
        fog={{
          color: "rgb(186, 210, 235)", // Lower atmosphere
          "horizon-blend": 0.1, // Atmosphere thickness
        }}
      >
        <Layer
          type="fill"
          id="state-fills"
          source="states"
          layout={{}}
          paint={{
            "fill-color": [
              "case",
              ["boolean", ["feature-state", "hover"], false],
              "#627BC1",
              ["boolean", ["feature-state", "selected"], false],
              ["string", ["feature-state", "color"], "#FFF"],
              "#627BC1",
            ],
            "fill-opacity": [
              "case",
              ["boolean", ["feature-state", "hover"], false],
              0.3,
              ["boolean", ["feature-state", "selected"], false],
              0.5,
              0,
            ],
          }}
        />
      </Map>
    </div>
  );
}

export default App;
