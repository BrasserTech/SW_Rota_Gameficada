'use client';
import { useEffect, useRef } from 'react';
import type { Place } from '@/lib/types';
import 'leaflet/dist/leaflet.css';
export default function PlacesMap({ places, onSelect }: { places: Place[]; onSelect: (p: Place) => void }) {
  const container = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let disposed = false;
    let map: import('leaflet').Map | undefined;
    import('leaflet').then(L => {
      if (!container.current || disposed) return;
      map = L.map(container.current).setView([-27.597, -48.53], 12);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors', maxZoom: 19 }).addTo(map);
      const icon = L.divIcon({ className: 'map-marker', html: '<span>●</span>', iconSize: [32, 32], iconAnchor: [16, 32] });
      for (const place of places) {
        const popup = document.createElement('button'); popup.textContent = place.name; popup.addEventListener('click', () => onSelect(place));
        L.marker([place.latitude, place.longitude], { icon }).addTo(map).bindPopup(popup);
      }
      if (places.length) map.fitBounds(L.latLngBounds(places.map(p => [p.latitude, p.longitude])), { padding: [40, 40], maxZoom: 15 });
    });
    return () => { disposed = true; map?.remove(); };
  }, [places, onSelect]);
  return <div ref={container} className="places-map" aria-label="Mapa dos locais de Florianópolis" />;
}
