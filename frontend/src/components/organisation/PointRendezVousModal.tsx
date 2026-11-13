import React, { useState, useEffect, useRef } from 'react';
import { X, Navigation, MapPin } from 'lucide-react';

interface PointRendezVousModalProps {
  initialName?: string;
  initialLat?: number;
  initialLng?: number;
  onClose: () => void;
  onConfirm: (point: { name: string; lat: number; lng: number }) => void;
}

export const PointRendezVousModal: React.FC<PointRendezVousModalProps> = ({
  initialName = 'Objectif',
  initialLat = 48.8566,
  initialLng = 2.3522,
  onClose,
  onConfirm,
}) => {
  const [pointName, setPointName] = useState(initialName);
  const [lat, setLat] = useState(initialLat);
  const [lng, setLng] = useState(initialLng);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerInstanceRef = useRef<any>(null);

  // Helper to build the exact pill icon from Image 1
  const buildPillHtml = (name: string) => `
    <div style="
      display: inline-flex;
      align-items: center;
      gap: 7px;
      background: #ffffff;
      border: 2px solid #009560;
      border-radius: 9999px;
      padding: 5px 14px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      white-space: nowrap;
      transform: translate(-50%, -50%);
      user-select: none;
      cursor: pointer;
    ">
      <span style="
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #009560;
        flex-shrink: 0;
      "></span>
      <span style="
        font-size: 13px;
        font-weight: 700;
        color: #1e293b;
        line-height: 1;
      ">${name || 'Objectif'}</span>
    </div>
  `;

  useEffect(() => {
    let isMounted = true;

    // Dynamically load leaflet on client side to avoid SSR issues
    const initLeaflet = async () => {
      if (typeof window === 'undefined' || !mapContainerRef.current) return;
      const L = (await import('leaflet')).default;

      if (!isMounted || !mapContainerRef.current) return;

      // Clean up previous instance if any
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      // Initialize map
      const map = L.map(mapContainerRef.current, {
        center: [lat, lng],
        zoom: 14,
        zoomControl: true,
      });

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '🇺🇦 Leaflet | © OpenStreetMap',
        maxZoom: 19,
      }).addTo(map);

      // Custom marker icon matching Image 1: white capsule pill with green dot and text
      const pillIcon = L.divIcon({
        className: 'bnevo-map-pill',
        html: buildPillHtml(pointName),
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      });

      const marker = L.marker([lat, lng], {
        draggable: true,
        icon: pillIcon,
      }).addTo(map);

      // Click on map to place/move marker
      map.on('click', (e: any) => {
        const newLat = e.latlng.lat;
        const newLng = e.latlng.lng;
        setLat(newLat);
        setLng(newLng);
        marker.setLatLng([newLat, newLng]);
      });

      // Drag marker
      marker.on('dragend', () => {
        const pos = marker.getLatLng();
        setLat(pos.lat);
        setLng(pos.lng);
      });

      mapInstanceRef.current = map;
      markerInstanceRef.current = marker;

      // Force recalculating map size after modal animation
      setTimeout(() => {
        map.invalidateSize();
      }, 200);
    };

    initLeaflet();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update marker label when name changes
  useEffect(() => {
    if (markerInstanceRef.current && typeof window !== 'undefined') {
      import('leaflet').then((LModule) => {
        const L = LModule.default;
        const newIcon = L.divIcon({
          className: 'bnevo-map-pill',
          html: buildPillHtml(pointName),
          iconSize: [0, 0],
          iconAnchor: [0, 0],
        });
        markerInstanceRef.current.setIcon(newIcon);
      });
    }
  }, [pointName]);

  const handleMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLat = position.coords.latitude;
          const newLng = position.coords.longitude;
          setLat(newLat);
          setLng(newLng);
          if (mapInstanceRef.current && markerInstanceRef.current) {
            mapInstanceRef.current.setView([newLat, newLng], 15);
            markerInstanceRef.current.setLatLng([newLat, newLng]);
          }
        },
        (error) => {
          console.warn('Geolocation unavailable, falling back to central coordinates', error);
          const fallbackLat = 48.8566;
          const fallbackLng = 2.3522;
          setLat(fallbackLat);
          setLng(fallbackLng);
          if (mapInstanceRef.current && markerInstanceRef.current) {
            mapInstanceRef.current.setView([fallbackLat, fallbackLng], 15);
            markerInstanceRef.current.setLatLng([fallbackLat, fallbackLng]);
          }
        }
      );
    }
  };

  const handleValidate = () => {
    onConfirm({
      name: pointName.trim() || 'Objectif',
      lat,
      lng,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 flex flex-col space-y-4 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900 font-display tracking-wide uppercase">
            POINT DE RENDEZ-VOUS
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Real Leaflet Map Container */}
        <div className="relative w-full h-80 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner">
          <div ref={mapContainerRef} className="w-full h-full" style={{ zIndex: 1 }} />
        </div>

        {/* Checkpoint Name input */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
            Nom de ce repère / checkpoint
          </label>
          <input
            type="text"
            value={pointName}
            onChange={(e) => setPointName(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900"
            placeholder="Ex: Objectif, Poste secours, Entrée..."
          />
          <p className="text-[10px] text-slate-400 mt-1">
            Astuce : Cliquez ou glissez le repère n'importe où sur la carte pour définir la position exacte.
          </p>
        </div>

        {/* Action Buttons: Ma position & Valider ce point */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={handleMyLocation}
            className="py-3 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold rounded-xl text-xs sm:text-sm transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5"
          >
            <Navigation className="w-3.5 h-3.5 text-emerald-600" />
            <span>Ma position</span>
          </button>
          <button
            type="button"
            onClick={handleValidate}
            className="py-3 px-4 bg-[#009560] hover:bg-[#008053] active:bg-[#007049] text-white font-bold rounded-xl text-xs sm:text-sm transition-colors shadow-xs cursor-pointer text-center"
          >
            Valider ce point
          </button>
        </div>
      </div>
    </div>
  );
};
