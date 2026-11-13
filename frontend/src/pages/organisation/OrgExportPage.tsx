import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FileSpreadsheet, Download, Printer, CheckCircle, Award, FileText, Table } from 'lucide-react';

export const OrgExportPage: React.FC = () => {
  const { missions, volunteers, currentUser, showToast } = useApp();
  const [downloading, setDownloading] = useState(false);

  const handleDownloadCSV = () => {
    setDownloading(true);
    setTimeout(() => {
      // Build CSV content
      const headers = ['Mission', 'Categorie', 'Date', 'Creneau', 'Capacite', 'Inscrits', 'Nom Benevole', 'Telephone', 'Statut Pointage'];
      const rows: string[][] = [];

      missions.forEach((m) => {
        m.creneaux.forEach((cr) => {
          if (cr.enrolledUserIds.length === 0) {
            rows.push([
              `"${m.title}"`,
              `"${m.category}"`,
              cr.date,
              `"${cr.startTime}-${cr.endTime}"`,
              cr.capacity.toString(),
              '0',
              'Vacant',
              '-',
              'Non affecté',
            ]);
          } else {
            cr.enrolledUserIds.forEach((vId) => {
              const vol = volunteers.find((v) => v.id === vId);
              const status = cr.attendance?.[vId] || 'En attente';
              rows.push([
                `"${m.title}"`,
                `"${m.category}"`,
                cr.date,
                `"${cr.startTime}-${cr.endTime}"`,
                cr.capacity.toString(),
                cr.enrolledUserIds.length.toString(),
                `"${vol?.name || 'Inconnu'}"`,
                `"${vol?.phone || '-'}"`,
                `"${status}"`,
              ]);
            });
          }
        });
      });

      const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `bnevo_planning_${currentUser?.organizationName || 'evenement'}_2026.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloading(false);
      showToast('Fichier CSV généré et téléchargé avec succès !', 'success');
    }, 400);
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="flex-1 bg-slate-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span>Espace Organisation</span>
              <span aria-hidden="true">·</span>
              <span>Exports & Archivage</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 font-display">
              Export du Planning & Feuilles d'Émargement
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer la feuille de route</span>
            </button>
            <button
              onClick={handleDownloadCSV}
              disabled={downloading}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloading ? 'Génération...' : 'Télécharger CSV (Excel)'}</span>
            </button>
          </div>
        </div>

        {/* Feature explanation cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center mb-3">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h2 className="text-sm font-bold text-slate-900 mb-1">
              Format CSV universel
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Directement ouvrable sur Microsoft Excel, Google Sheets, LibreOffice avec encodage UTF-8.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
              <FileText className="w-5 h-5" />
            </div>
            <h2 className="text-sm font-bold text-slate-900 mb-1">
              Feuilles de pointage papier
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Pour les chefs de poste et responsables de site n'ayant pas accès au réseau internet sur le terrain.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
              <Award className="w-5 h-5" />
            </div>
            <h2 className="text-sm font-bold text-slate-900 mb-1">
              Valorisation associative
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Permet de calculer le Compte d'Engagement Citoyen (CEC) et justifier les subventions publiques.
            </p>
          </div>
        </div>

        {/* Preview of export table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Aperçu des données d'export ({missions.length} missions)
            </span>
            <span className="text-xs text-slate-500">
              Mise à jour en temps réel
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 uppercase text-[10px] font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Mission</th>
                  <th className="px-4 py-3">Créneau</th>
                  <th className="px-4 py-3">Capacité</th>
                  <th className="px-4 py-3">Bénévoles affectés</th>
                  <th className="px-4 py-3 text-right">Pointage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {missions.slice(0, 5).map((m) =>
                  m.creneaux.map((cr) => (
                    <tr key={cr.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {m.title}
                      </td>
                      <td className="px-4 py-3 text-slate-600 font-mono">
                        {cr.date} · {cr.startTime}-{cr.endTime}
                      </td>
                      <td className="px-4 py-3 tabular-nums">
                        {cr.capacity} pers.
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {cr.enrolledUserIds.length > 0
                          ? cr.enrolledUserIds
                              .map((id) => volunteers.find((v) => v.id === id)?.name || id)
                              .join(', ')
                          : 'Aucun (vacant)'}
                      </td>
                      <td className="px-4 py-3 text-right font-medium">
                        {cr.enrolledUserIds.length >= cr.capacity ? (
                          <span className="text-emerald-600 font-semibold">Complet ✓</span>
                        ) : (
                          <span className="text-amber-600">
                            {cr.capacity - cr.enrolledUserIds.length} manquant(s)
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
