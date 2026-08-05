"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const pinIcon = L.divIcon({
  className: "map-pin",
  html: "<span></span>",
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

function ClickToMove({ onMove }: { onMove: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(event) {
      onMove(event.latlng.lat, event.latlng.lng);
    },
  });
  return null;
}

function FlyToPosition({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lng], Math.max(map.getZoom(), 15), { duration: 0.6 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lng]);
  return null;
}

function ScrollZoomOnClick() {
  const map = useMap();
  useEffect(() => {
    const container = map.getContainer();
    const enable = () => map.scrollWheelZoom.enable();
    const disable = () => map.scrollWheelZoom.disable();
    container.addEventListener("click", enable);
    container.addEventListener("mouseleave", disable);
    return () => {
      container.removeEventListener("click", enable);
      container.removeEventListener("mouseleave", disable);
    };
  }, [map]);
  return null;
}

export default function AddressMap({
  lat,
  lng,
  onMove,
}: {
  lat: number;
  lng: number;
  onMove: (lat: number, lng: number) => void;
}) {
  return (
    <MapContainer center={[lat, lng]} zoom={15} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker
        position={[lat, lng]}
        icon={pinIcon}
        draggable
        eventHandlers={{
          dragend(event) {
            const marker = event.target as L.Marker;
            const { lat: nextLat, lng: nextLng } = marker.getLatLng();
            onMove(nextLat, nextLng);
          },
        }}
      />
      <ClickToMove onMove={onMove} />
      <FlyToPosition lat={lat} lng={lng} />
      <ScrollZoomOnClick />
    </MapContainer>
  );
}
