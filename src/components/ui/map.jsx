'use client';

import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet.markercluster';

// @ts-nocheck

export default function Map() {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef(null);

  const [places, setPlaces] = useState([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    fetch('/search_response.json')
      .then((res) => res.json())
      .then((data) => setPlaces(data.items || []))
      .catch((e) => console.error('Ошибка загрузки JSON:', e));
  }, []);

  useEffect(() => {
    if (!isClient || !mapContainerRef.current) return;

    Promise.all([import('leaflet'), import('leaflet.markercluster')]).then(
      ([LModule]) => {
        const L = LModule.default || LModule;

        L.Icon.Default.mergeOptions({
          iconRetinaUrl:
            'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
          iconUrl:
            'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl:
            'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        });

        if (!mapRef.current) {
          mapRef.current = L.map(mapContainerRef.current, {
            center: [50.45, 30.52],
            zoom: 12,
          });

          L.tileLayer(
            'https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=858bed30d2484145b18a126e57a541c7',
            {
              maxZoom: 20,
              attribution:
                'Powered by <a href="https://www.geoapify.com/" target="_blank">Geoapify</a> | © OpenStreetMap contributors',
            }
          ).addTo(mapRef.current);
        }

        if (!markersRef.current) {
          markersRef.current = L.markerClusterGroup();
          mapRef.current.addLayer(markersRef.current);
        }
      }
    );
  }, [isClient]);

  useEffect(() => {
    if (!mapRef.current || !markersRef.current || places.length === 0) return;

    markersRef.current.clearLayers();
    
    places.forEach((item) => {
      const loc = item.location;
      if (loc?.lat && loc?.lon) {
        const marker = L.marker([loc.lat, loc.lon]);
        marker.bindPopup(`<b>${item.name || item.title}</b>`);
        markersRef.current.addLayer(marker);
      }
    });

    const valid = places.filter((p) => p.location?.lat && p.location?.lon);
    if (valid.length > 0) {
      const bounds = valid.map((p) => [p.location.lat, p.location.lon]);
      mapRef.current.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [places]);

  useEffect(() => {
    const handler = () => {
      if (mapRef.current) {
        setTimeout(() => mapRef.current.invalidateSize(), 50);
      }
    };

    window.addEventListener('map-visible', handler);
    return () => window.removeEventListener('map-visible', handler);
  }, []);

  return (
    <div className="flex justify-center items-center bg-blue-light p-0">
      <div className="relative w-[335px] h-[400px] sm:w-[541px] sm:h-[800px] md:w-[496px] md:h-[800px]">
        <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />
      </div>
    </div>
  );
}
