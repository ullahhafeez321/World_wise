import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import styles from "./Map.module.css";

import { useNavigate } from "react-router-dom";
import { useCities } from "../contexts/CitiesContext";
import { useEffect, useState } from "react";
import { useGeoLocation } from "../hooks/useGeoLocation";
import Button from "./Button.jsx";
import { useLocationParams } from "../hooks/useLocationParams.js";

export default function Map() {
  const { cities } = useCities();
  const [mapPosition, setMapPosition] = useState([25.1313, 62.325]);
  const {
    isLoading: isGeoLocationLoading,
    position: geoLocationPosition,
    getPosition,
  } = useGeoLocation();

  const [lat, lng] = useLocationParams();

  useEffect(() => {
    if (lat && lng) {
      setMapPosition([lat, lng]);
    }
  }, [lat, lng]);

  useEffect(() => {
    if (geoLocationPosition) {
      setMapPosition([geoLocationPosition.lat, geoLocationPosition.lng]);
    }
  }, [geoLocationPosition]);

  return (
    <div className={styles.mapContainer}>
      {!geoLocationPosition && (
        <Button type="position" onClick={getPosition}>
          {isGeoLocationLoading ? "Loading..." : "Use Current Position"}
        </Button>
      )}
      <MapContainer
        center={mapPosition}
        zoom={13}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker
            position={[city.position.lat, city.position.lng]}
            key={city.id}
          >
            <Popup>
              {city.emoji}, {city.cityName}
            </Popup>
          </Marker>
        ))}
        <CenterView position={mapPosition} />
        <DetectClicks />
      </MapContainer>
    </div>
  );
}

function CenterView({ position }) {
  const map = useMap();
  map.setView(position);
  return null;
}

function DetectClicks() {
  const navigate = useNavigate();
  useMapEvents({
    click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`),
  });
  return null;
}
