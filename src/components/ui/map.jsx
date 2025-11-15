'use client';

import { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

export default function Map() {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

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
    if (!isClient || !mapContainerRef.current || places.length === 0) return;

    Promise.all([import('leaflet'), import('leaflet.markercluster')]).then(
      ([LModule]) => {
        const L = LModule.default || LModule;


        if (L.Icon.Default.prototype._getIconUrl) delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl:
            'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
          iconUrl:
            'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl:
            'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        });

        if (mapRef.current) {
          mapRef.current.remove();
        }

        const locations = places
          .map((i) => i.location)
          .filter((loc) => loc?.lat && loc?.lon);

        const avgLat =
          locations.reduce((sum, loc) => sum + loc.lat, 0) / locations.length;
        const avgLon =
          locations.reduce((sum, loc) => sum + loc.lon, 0) / locations.length;

        const map = L.map(mapContainerRef.current, {
          center: [avgLat, avgLon],
          zoom: 13,
        });

        L.tileLayer(
          'https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=858bed30d2484145b18a126e57a541c7',
          {
            maxZoom: 20,
            attribution:
              'Powered by <a href="https://www.geoapify.com/" target="_blank">Geoapify</a> | © OpenStreetMap contributors',
          }
        ).addTo(map);


        const markers = L.markerClusterGroup();

        places.forEach((item) => {
          if (item.location?.lat && item.location?.lon) {
            const marker = L.marker([item.location.lat, item.location.lon]);
            const name = item.name || item.title || 'Место';
            marker.bindPopup(`<b>${name}</b>`);
            markers.addLayer(marker);
          }
        });

        map.addLayer(markers);

        setTimeout(() => map.invalidateSize(), 150);

        mapRef.current = map;
      }
    );
  }, [isClient, places]);

  return (
    <div className="flex justify-center items-center bg-blue-light p-0">
      <div className="relative w-[335px] h-[400px] sm:w-[541px] sm:h-[800px] md:w-[496px] md:h-[800px]">
        <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />
      </div>
    </div>
  );
}
