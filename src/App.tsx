import { Ref, createRef, useRef, useState } from "react";
import Map, { Layer, MapEvent, MapLayerMouseEvent, MapRef } from "react-map-gl";
import Header from "./components/Header";

function App() {
  const mapRef = createRef<MapRef>();
  const selectedStateId = useRef<number | null>(null);

  const handleMapLoad = (e: MapEvent) => {
    e.target.addSource("states", {
      type: "geojson",
      data: "../src/assets/geoson/ne_110m_admin_0_countries.geojson",
    });

    e.target.on("mousemove", "state-fills", (ev: any) => {
      if (ev.features.length > 0) {
        if (selectedStateId.current !== null) {
          e.target.setFeatureState(
            { source: "states", id: selectedStateId.current },
            { hover: false }
          );
        }
        const currentId = ev.features[0].id;
        selectedStateId.current = currentId;
        e.target.setFeatureState(
          { source: "states", id: currentId },
          { hover: true }
        );
      }
    });

    // When the mouse leaves the state-fill layer, update the feature state of the
    // previously hovered feature.
    e.target.on("mouseleave", "state-fills", () => {
      console.log({ selectedStateId });
      if (selectedStateId.current !== null) {
        e.target.setFeatureState(
          { source: "states", id: selectedStateId.current },
          { hover: false }
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
        mapStyle={import.meta.env.VITE_MAPBOX_MAP_STYLE_DARK}
        ref={mapRef}
        onLoad={handleMapLoad}
      >
        <Layer
          type="fill"
          id="state-fills"
          source="states"
          layout={{}}
          paint={{
            "fill-color": "#627BC1",
            "fill-opacity": [
              "case",
              ["boolean", ["feature-state", "hover"], false],
              0.3,
              0,
            ],
          }}
        />
      </Map>
    </div>
  );
}

export default App;
