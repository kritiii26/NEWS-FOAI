import React from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useTheme } from '../context/ThemeContext';

// Fix for default marker icon in Leaflet + React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom ISS Icon
const issIcon = L.divIcon({
  html: `<div class="bg-primary p-2 rounded-full border-2 border-white shadow-lg animate-pulse">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 12h-5"/><path d="M15 8h-5"/><path d="M19 17V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2Z"/><path d="M12 19v2"/><path d="M9 21h6"/></svg>
         </div>`,
  className: '',
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

function MapUpdater({ center }) {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
}

const ISSMap = ({ location, path }) => {
  const { isDark } = useTheme();
  const position = location ? [location.latitude, location.longitude] : [0, 0];

  return (
    <div className="h-full w-full rounded-xl overflow-hidden shadow-2xl border border-white/10 relative">
      {!location && (
        <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-background/50 backdrop-blur-sm">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}
      <MapContainer 
        center={position} 
        zoom={3} 
        scrollWheelZoom={true} 
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url={isDark 
            ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          }
        />
        {location && (
          <>
            <Marker position={position} icon={issIcon} />
            <Polyline positions={path} color="#3b82f6" weight={3} opacity={0.6} dashArray="10, 10" />
            <MapUpdater center={position} />
          </>
        )}
      </MapContainer>
      <div className="absolute bottom-4 left-4 z-[1000] glass p-3 rounded-lg text-xs font-mono">
        <div className="flex flex-col gap-1">
          <span className="text-primary font-bold">LAT: {location?.latitude.toFixed(4) || '---'}</span>
          <span className="text-primary font-bold">LON: {location?.longitude.toFixed(4) || '---'}</span>
        </div>
      </div>
    </div>
  );
};

export default ISSMap;
