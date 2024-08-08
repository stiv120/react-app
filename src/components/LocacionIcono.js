import L from "leaflet";

export const LocacionIcono = L.icon({
    iconUrl: require("../assets/icon.png"),
    iconRetinaUrl: require("../assets/icon.png"),
    iconAnchor: null,
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize: [20, 20],
    className: "leaflet-venue-icon"
});