import React, { useEffect, useRef } from 'react';
import { X, Flag } from 'lucide-react';
import { Mission } from '../../types';

interface ObjectifsApercuModalProps {
  mission: Mission;
  onClose: () => void;
}

export const ObjectifsApercuModal: React.FC<ObjectifsApercuModalProps> = ({
  mission,
  onClose,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  const objectifs = mission.objectifs && mission.objectifs.length > 0
    ? mission.objectifs
    : [
        { id: 'obj_default_1', name: 'Point de rdv / Accueil', lat: 48.8584, lng: 2.2945 },
        { id: 'obj_default_2', name: 'Zone de ramassage A', lat: 48.8601, lng: 2.2980 },
        { id: 'obj_default_3', name: 'Stockage des sacs', lat: 48.8565, lng: 2.2960 },
      ];

  useEffect(() => {
    let isMounted = true;

    const initMap = async () => {
      if (typeof window === 'undefined' || !mapContainerRef.current) return;
      const L = (await import('leaflet')).default;

      if (!isMounted || !mapContainerRef.current) return;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      // Calculate center based on average of objectives
      const avgLat = objectifs.reduce((acc, o) => acc + o.lat, 0) / objectifs.length;
      const avgLng = objectifs.reduce((acc, o) => acc + o.lng, 0) / objectifs.length;

      const map = L.map(mapContainerRef.current, {
        center: [avgLat, avgLng],
        zoom: 15,
        zoomControl: true,
      });

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '🇺🇦 Leaflet | © OpenStreetMap',
        maxZoom: 19,
      }).addTo(map);

      // Add each objective as a white pill with green border matching Screenshot 2
      objectifs.forEach((obj) => {
        const pillIcon = L.divIcon({
          className: 'bnevo-apercu-pill',
          html: `<div style="
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background: #ffffff;
            border: 2px solid #009560;
            border-radius: 9999px;
            padding: 4px 14px;
            font-size: 11px;
            font-weight: 700;
            color: #1e293b;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            white-space: nowrap;
            transform: translate(-50%, -50%);
            user-select: none;
          ">${obj.name}</div>`,
          iconSize: [0, 0],
          iconAnchor: [0, 0],
        });

        L.marker([obj.lat, obj.lng], { icon: pillIcon }).addTo(map);
      });

      mapInstanceRef.current = map;

      setTimeout(() => {
        map.invalidateSize();
      }, 200);
    };

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [objectifs]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-100 flex flex-col space-y-4 animate-in fade-in zoom-in-95 duration-150">
        {/* Header matching Screenshot 2 */}
        <div className="flex items-start justify-between pb-2 border-b border-slate-100">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 font-display tracking-wide uppercase">
            OBJECTIFS : {mission.title.toUpperCase()}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Objectives Green Pills Row matching Screenshot 2 */}
        <div className="flex flex-wrap gap-2">
          {objectifs.map((obj) => (
            <div
              key={obj.id}
              className="bg-[#d1fae5] border border-emerald-300 text-emerald-800 rounded-xl px-3 py-1.5 font-bold text-[11px] sm:text-xs flex items-center gap-1.5 uppercase shadow-2xs"
            >
              <Flag className="w-3.5 h-3.5 fill-emerald-700 text-emerald-700" />
              <span>{obj.name}</span>
            </div>
          ))}
        </div>

        {/* Real Leaflet Map Container with all objectives pinned */}
        <div className="relative w-full h-72 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner">
          <div ref={mapContainerRef} className="w-full h-full" style={{ zIndex: 1 }} />
        </div>

        {/* Fermer Button matching Screenshot 2 */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3.5 px-4 bg-[#009560] hover:bg-[#008053] active:bg-[#007049] text-white font-bold rounded-xl text-sm transition-all shadow-xs cursor-pointer text-center"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
