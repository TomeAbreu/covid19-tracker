import React from "react";
import "./Map.css";
import { MapContainer, TileLayer, useMap } from "react-leaflet";

function ChangeView({ center, zoom }) {
   const map = useMap();
   map.setView(center, zoom);
   return null;
}

function Map({ center, zoom }) {
   return (
      <div className="map">
         <MapContainer center={center} zoom={zoom}>
            <ChangeView center={center} zoom={zoom} />
            <TileLayer
               url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
               attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
         </MapContainer>
      </div>
   );
}

export default Map;
