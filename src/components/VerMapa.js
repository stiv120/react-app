import "leaflet/dist/leaflet.css";
import { LocacionIcono } from "./LocacionIcono";
import React, { useEffect, useRef, useMemo } from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";

const VerMapa = (props) => {
  const markerPosition = useMemo(
    () => [props?.lat, props?.lon],
    [props?.lat, props?.lon]
  );
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current && markerPosition[0] && markerPosition[1]) {
      const map = mapRef.current;
      map.setView(markerPosition, map.getZoom(), { animate: true }); // Centramos el mapa en la nueva posición
    }
  }, [markerPosition]);

  return (
    <div>
      {props?.error ? (
        <div className="container p-2">
          <div className="row">
            <div className="alert alert-danger">
              <p>{props?.error}</p>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      {props?.lat && props?.lon ? (
        <div className="col-12 col-md-12 col-sm-12 col-lg-12">
          La humedad es de: {props.hum} %{" "}
          <img
            src={`http://openweathermap.org/img/wn/${props?.iconoClima?.icon}@2x.png`}
            alt="Imagen"
            className="map-image"
            width="50"
          ></img>
          <MapContainer center={markerPosition} zoom={props?.zoom} ref={mapRef}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={markerPosition} icon={LocacionIcono} />
          </MapContainer>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default VerMapa;
