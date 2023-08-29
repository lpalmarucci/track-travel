import { createRef, useEffect, useMemo, useRef, useState } from "react";
import Map, { Layer, MapEvent, MapRef } from "react-map-gl";
import Header from "./components/Header";
import { useColorModeContext } from "./context/ColorMode/ColorModeContext.tsx";
import { adjustColor } from "./utils/color.ts";
import { colors } from "@material-ui/core";
import {
  getValueFromLocalStorage,
  saveValueToLocalStorage,
} from "./utils/localStorage.ts";
import {
  COLOR_SCHEME_KEY,
  DEFAULT_COLOR,
  DEFAULT_STORAGE_KEY_COUNTRIES,
} from "./context/ColorMode/types.ts";

type MarkedCountry = {
  id: number;
  color: string;
};

function App() {
  const { isDarkMode, countryColor } = useColorModeContext();
  const mapRef = createRef<MapRef>();
  const selectedStateId = useRef<number | null>(null);
  const mapStyle = useMemo<string>(
    () =>
      isDarkMode
        ? import.meta.env.VITE_MAPBOX_MAP_STYLE_DARK
        : import.meta.env.VITE_MAPBOX_MAP_STYLE_LIGHT,
    [isDarkMode],
  );
  const [markedCountries, setMarkedCountries] = useState<MarkedCountry[]>(
    getValueFromLocalStorage<MarkedCountry[]>(DEFAULT_STORAGE_KEY_COUNTRIES) ??
      [],
  );

  useEffect(
    () =>
      saveValueToLocalStorage(DEFAULT_STORAGE_KEY_COUNTRIES, markedCountries),
    [markedCountries],
  );

  const handleMapLoad = (e: MapEvent) => {
    // Add states
    e.target.addSource("states", {
      type: "geojson",
      data: "../src/assets/geoson/ne_110m_admin_0_countries.geojson",
    });

    //Pre color states that have already been selected
    markedCountries.forEach((country) => {
      e.target.setFeatureState(
        {
          source: "states",
          id: country.id,
        },
        { hover: false, selected: true, color: country.color },
      );
    });

    e.target.on(
      "click",
      "state-fills",
      (
        ev: mapboxgl.MapMouseEvent & {
          features?: mapboxgl.MapboxGeoJSONFeature[] | undefined;
        } & mapboxgl.EventData,
      ) => {
        if (ev.features && ev.features.length > 0) {
          const id: string | undefined = ev.features[0].id?.toString();
          if (!id) return;
          const color =
            getValueFromLocalStorage<string>(COLOR_SCHEME_KEY) ?? DEFAULT_COLOR;

          const { selected: alreadySelected } = ev.target.getFeatureState({
            source: "states",
            id,
          });

          ev.target.setFeatureState(
            { source: "states", id },
            { hover: false, selected: !alreadySelected, color },
          );
          setMarkedCountries((prevCountries) => {
            const res = prevCountries.slice();
            const countryIdx = prevCountries.findIndex((c) => c.id === +id);
            if (countryIdx !== -1) {
              res.splice(countryIdx, 1);
            }
            res.push({ id: +id, color });

            return res;
          });
        }
      },
    );

    e.target.on("mousemove", "state-fills", (ev) => {
      if (ev.features && ev.features.length > 0) {
        if (selectedStateId.current !== null) {
          e.target.setFeatureState(
            { source: "states", id: selectedStateId.current },
            { hover: false },
          );
        }
        const id: string | undefined = ev.features[0].id?.toString();
        if (!id) return;
        if (isNaN(parseInt(id))) {
          throw new Error("Checkout this id inside geoJSON file. ID " + id);
        }
        const currentId = parseInt(id);
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
        interactive={true}
        fog={{
          color: "rgb(186, 210, 235)", // Lower atmosphere
          "horizon-blend": 0.08, // Atmosphere thickness
        }}
        cursor={"auto"}
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
              adjustColor(countryColor, 50),
              ["boolean", ["feature-state", "selected"], false],
              ["string", ["feature-state", "color"], countryColor],
              colors.deepPurple[900],
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
