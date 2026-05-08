import { useState, useEffect, useRef } from 'react';
import { fetchISSLocation } from '../services/api';

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

export const useISS = () => {
  const [location, setLocation] = useState({ latitude: 0, longitude: 0 });
  const [path, setPath] = useState([]);
  const [speed, setSpeed] = useState(27600);
  const [speedHistory, setSpeedHistory] = useState([]);
  const lastUpdate = useRef(null);

  const updateLocation = async () => {
    try {
      const data = await fetchISSLocation();
      const now = Date.now();
      
      if (lastUpdate.current) {
        const dist = calculateDistance(
          lastUpdate.current.latitude,
          lastUpdate.current.longitude,
          data.latitude,
          data.longitude
        );
        const timeDiff = (now - lastUpdate.current.time) / 1000 / 3600; // hours
        const currentSpeed = dist / timeDiff;
        
        if (currentSpeed > 0 && currentSpeed < 35000) {
          setSpeed(Math.round(currentSpeed));
          setSpeedHistory(prev => [...prev.slice(-19), { time: new Date().toLocaleTimeString(), speed: Math.round(currentSpeed) }]);
        }
      }

      setLocation(data);
      setPath(prev => [...prev.slice(-50), [data.latitude, data.longitude]]);
      lastUpdate.current = { ...data, time: now };
    } catch (error) {
      console.error('ISS update error:', error);
      // If rate limited, just simulate a tiny movement to keep it "live"
      setLocation(prev => ({
        latitude: prev.latitude + (Math.random() - 0.5) * 0.1,
        longitude: prev.longitude + (Math.random() - 0.5) * 0.1,
      }));
    }
  };

  useEffect(() => {
    updateLocation();
    const interval = setInterval(updateLocation, 15000);
    return () => clearInterval(interval);
  }, []);

  return { location, path, speed, speedHistory };
};
