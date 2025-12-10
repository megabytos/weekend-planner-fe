'use client';

import L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet/dist/leaflet.css';
import { useEffect, useMemo, useRef, useState } from 'react';

// @ts-nocheck

const DEFAULT_ORIGIN = { lat: 50.45, lon: 30.52 };
const GEOAPIFY_KEY =
  process.env.NEXT_PUBLIC_GEOAPIFY_KEY || '858bed30d2484145b18a126e57a541c7';

const EVENT_COLOR = '#8b5cf6';
const PLACE_COLOR = '#2563eb';
const ROUTE_COLORS = [
  '#2563eb', // blue
  '#8b5cf6', // purple
  '#10b981', // green
  '#f59e0b', // amber
  '#06b6d4', // cyan
  '#6366f1', // indigo
  '#ec4899', // pink
  '#14b8a6', // teal
  '#f97316', // orange
  '#84cc16', // lime
];
const MODE_MAP = {
  walking: 'walk',
  cycling: 'bicycle',
  driving: 'drive',
};

function isValidCoord(lat, lon) {
  return (
    typeof lat === 'number' &&
    typeof lon === 'number' &&
    isFinite(lat) &&
    isFinite(lon)
  );
}

function geometryToLatLngPairs(geometry) {
  if (!geometry) return [];
  const { type, coordinates } = geometry;
  if (!coordinates) return [];

  if (type === 'LineString') {
    return coordinates.map(([lon, lat]) => [lat, lon]);
  }

  if (type === 'MultiLineString') {
    return coordinates.flat().map(([lon, lat]) => [lat, lon]);
  }

  if (type === 'GeometryCollection') {
    return (geometry.geometries || []).flatMap((geo) =>
      geometryToLatLngPairs(geo),
    );
  }

  return [];
}

export default function Map({
  places = [],
  items = [],
  origin = null,
  mode = 'walking',
  useClustering = true,
}) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef(null);
  const routeLayerRef = useRef(null);

  const [isClient, setIsClient] = useState(false);
  const [routeShapes, setRouteShapes] = useState([]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const resolvedOrigin = useMemo(() => {
    if (isValidCoord(origin?.lat, origin?.lon)) {
      return { lat: origin.lat, lon: origin.lon };
    }
    return DEFAULT_ORIGIN;
  }, [origin]);

  const routePoints = useMemo(() => {
    if (!items || items.length === 0) return [];

    return items
      .map((item) => {
        const lat = item?.location?.lat ?? item?.geo?.lat;
        const lon = item?.location?.lon ?? item?.geo?.lon;
        if (!isValidCoord(lat, lon)) return null;

        return {
          lat,
          lon,
          title: item.title || item.name,
          type:
            item.type ||
            (item.kind === 'event_visit' || item.kind === 'event'
              ? 'event'
              : 'place'),
        };
      })
      .filter(Boolean);
  }, [items]);

  const hasRoute = routePoints.length > 0;

  useEffect(() => {
    if (!isClient || !mapContainerRef.current) return;

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
        center: [resolvedOrigin.lat, resolvedOrigin.lon],
        zoom: 12,
      });

      L.tileLayer(
        `https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${GEOAPIFY_KEY}`,
        {
          maxZoom: 20,
          attribution:
            'Powered by <a href="https://www.geoapify.com/" target="_blank">Geoapify</a> | © OpenStreetMap contributors',
        },
      ).addTo(mapRef.current);
    }

    const needsClustering = useClustering;
    const isClusterGroup = markersRef.current instanceof L.MarkerClusterGroup;
    
    if (!markersRef.current || (needsClustering && !isClusterGroup) || (!needsClustering && isClusterGroup)) {
      if (markersRef.current) {
        mapRef.current.removeLayer(markersRef.current);
      }
      if (useClustering) {
        markersRef.current = L.markerClusterGroup();
      } else {
        markersRef.current = L.layerGroup();
      }
      mapRef.current.addLayer(markersRef.current);
    }

    if (!routeLayerRef.current) {
      routeLayerRef.current = L.layerGroup();
      mapRef.current.addLayer(routeLayerRef.current);
    }
  }, [isClient, resolvedOrigin.lat, resolvedOrigin.lon, useClustering]);

  useEffect(() => {
    if (!mapRef.current || !markersRef.current) return;
    if (hasRoute) return;
    if (!places || places.length === 0) return;

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
  }, [places, hasRoute]);

  useEffect(() => {
    if (!hasRoute) {
      setRouteShapes([]);
      return;
    }

    if (routePoints.length === 0) {
      setRouteShapes([]);
      return;
    }

    const controllers = [];
    const apiMode = MODE_MAP[mode] || MODE_MAP.walking;
    const promises = [];

    for (let i = 0; i < routePoints.length; i++) {
      const from = i === 0 ? resolvedOrigin : routePoints[i - 1];
      const to = routePoints[i];
      
      const waypoints = [
        `${from.lat},${from.lon}`,
        `${to.lat},${to.lon}`,
      ];

      const controller = new AbortController();
      controllers.push(controller);

      const url = `https://api.geoapify.com/v1/routing?waypoints=${waypoints.join('|')}&mode=${apiMode}&apiKey=${GEOAPIFY_KEY}`;

      promises.push(
        fetch(url, { signal: controller.signal })
          .then((res) => res.json())
          .then((data) => {
            const geometry = data?.features?.[0]?.geometry;
            const pairs = geometryToLatLngPairs(geometry);
            return pairs.length > 1 ? pairs : null;
          })
          .catch((err) => {
            if (err?.name === 'AbortError') return null;
            console.warn('Failed to fetch routed path segment', err);
            return null;
          })
      );
    }

    Promise.all(promises).then((shapes) => {
      setRouteShapes(shapes.filter(Boolean));
    });

    return () => {
      controllers.forEach((c) => c.abort());
    };
  }, [hasRoute, routePoints, resolvedOrigin, mode]);

  useEffect(() => {
    if (!mapRef.current || !routeLayerRef.current || !markersRef.current)
      return;

    if (!hasRoute) {
      routeLayerRef.current.clearLayers();
      return;
    }

    routeLayerRef.current.clearLayers();
    markersRef.current.clearLayers();

    const startLatLng = L.latLng(resolvedOrigin.lat, resolvedOrigin.lon);
    const allLatLngs = [startLatLng];

    const startMarker = L.marker(startLatLng, {
      icon: L.divIcon({
        html: `<div style="
            background:green;
            color:white;
            width:30px;
            height:30px;
            display:flex;
            align-items:center;
            justify-content:center;
            border-radius:50%;
            border:2px solid white;
            font-weight:600;
          ">S</div>`,
        className: '',
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      }),
    }).bindPopup('Start');

    markersRef.current.addLayer(startMarker);

    routePoints.forEach((point, index) => {
      const latLng = L.latLng(point.lat, point.lon);
      allLatLngs.push(latLng);

      const color = point.type === 'event' ? EVENT_COLOR : PLACE_COLOR;

      const marker = L.marker(latLng, {
        icon: L.divIcon({
          html: `<div style="
              background:${color};
              color:white;
              width:30px;
              height:30px;
              display:flex;
              align-items:center;
              justify-content:center;
              border-radius:50%;
              border:2px solid white;
              font-weight:600;
            ">${index + 1}</div>`,
          className: '',
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        }),
      }).bindPopup(`<b>${point.title || 'Точка маршрута'}</b>`);

      markersRef.current.addLayer(marker);
    });

    if (routeShapes.length > 0) {
      routeShapes.forEach((shape, index) => {
        if (shape && shape.length > 1) {
          const color = ROUTE_COLORS[index % ROUTE_COLORS.length];
          const polyline = L.polyline(
            shape.map(([lat, lon]) => L.latLng(lat, lon)),
            {
              color,
              weight: 4,
              smoothFactor: 1,
            },
          );
          routeLayerRef.current.addLayer(polyline);
        }
      });

      const allRoutePoints = routeShapes.flat().map(([lat, lon]) =>
        L.latLng(lat, lon),
      );
      if (allRoutePoints.length > 0) {
        mapRef.current.fitBounds(L.latLngBounds(allRoutePoints), {
          padding: [40, 40],
        });
      }
    } else {
      if (allLatLngs.length > 1) {
        const color = ROUTE_COLORS[0];
        const polyline = L.polyline(allLatLngs, {
          color,
          weight: 4,
          smoothFactor: 1,
        });
        routeLayerRef.current.addLayer(polyline);
        mapRef.current.fitBounds(L.latLngBounds(allLatLngs), {
          padding: [40, 40],
        });
      } else {
        mapRef.current.setView(startLatLng, 12);
      }
    }
  }, [hasRoute, routePoints, resolvedOrigin, routeShapes]);

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
