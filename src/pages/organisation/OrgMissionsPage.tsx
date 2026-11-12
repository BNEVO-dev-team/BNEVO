import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Mission, Creneau } from '../../types';
import {
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  Trash2,
  X,
  PlusCircle,
  Briefcase
} from 'lucide-react';

export const OrgMissionsPage: React.FC = () => {
  const { missions, createMission, volunteers, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Mission Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Mission['category']>('Accueil & Info');
  const [location, setLocation] = useState('');
  const [city, setCity] = useState('Lyon');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [requiredSkills, setRequiredSkills] = useState('');
  const [perks, setPerks] = useState('');
  const [referentName, setReferentName] = useState('Camille Laurent');
  const [referentPhone, setReferentPhone] = useState('06 12 34 56 78');

  // Custom slots
  const [creneaux, setCreneaux] = useState<Array<{ date: string; startTime: string; endTime: string; capacity: number }>>([
    { date: '2026-10-10', startTime: '09:00', endTime: '13:00', capacity: 4 },
    { date: '2026-10-10', startTime: '13:00', endTime: '17:00', capacity: 4 },
  ]);

  const addSlotRow = () => {
    setCreneaux((prev) => [
      ...prev,
      { date: startDate || '2026-10-10', startTime: '17:00', endTime: '21:00', capacity: 4 },
    ]);
  };

  const removeSlotRow = (index: number) => {
    setCreneaux((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !location.trim()) {
      showToast('Veuillez renseigner le titre et le lieu de la mission.', 'warning');
      return;
    }

    const createdCreneaux: Creneau[] = creneaux.map((cr, idx) => ({
      id: `cr_new_${Date.now()}_${idx}`,
      date: cr.date,
      startTime: cr.startTime,
      endTime: cr.endTime,
      capacity: Number(cr.capacity) || 4,
      enrolledUserIds: [],
      attendance: {},
    }));

    createMission({
      title: title.trim(),
      organizationId: 'org_1',
      organizationName: 'Festival Éco-Arts & Musiques',
      category,
      location: location.trim(),
      city: city.trim(),
      startDate: startDate || '2026-10-10',
      endDate: endDate || startDate || '2026-10-10',
      description: description.trim(),
      requiredSkills: requiredSkills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      perks: perks
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean),
      referentName: referentName.trim(),
      referentPhone: referentPhone.trim(),
      creneaux: createdCreneaux,
      status: 'active',
    });

    setIsModalOpen(false);
    // Reset form
    setTitle('');
    setDescription('');
    setLocation('');
    setRequiredSkills('');
    setPerks('');
  };

  const filteredMissions = missions.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || m.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex-1 bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span>Espace Organisation</span>
              <span aria-hidden="true">·</span>
              <span>Gestion des Besoins</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 font-display">
              Missions & Créneaux Bénévoles
            </h1>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Créer une Mission</span>
          </button>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par titre, mot-clé ou lieu..."
              className="w-full pl-9 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Interactive filter control */}
          <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-slate-200/60 rounded-lg">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Toutes
            </button>
            <button
              onClick={() => setSelectedCategory('Accueil & Info')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                selectedCategory === 'Accueil & Info'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Accueil & Info
            </button>
            <button
              onClick={() => setSelectedCategory('Bar & Restauration')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                selectedCategory === 'Bar & Restauration'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Bar & Restauration
            </button>
            <button
              onClick={() => setSelectedCategory('Éco-Responsable')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                selectedCategory === 'Éco-Responsable'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Éco-Responsable
            </button>
            <button
              onClick={() => setSelectedCategory('Scène & Technique')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                selectedCategory === 'Scène & Technique'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Scène & Technique
            </button>
          </div>
        </div>

        {/* Mission Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredMissions.map((mission) => {
            const totalCap = mission.creneaux.reduce((acc, cr) => acc + cr.capacity, 0);
            const totalEnr = mission.creneaux.reduce((acc, cr) => acc + cr.enrolledUserIds.length, 0);
            const percent = totalCap > 0 ? Math.round((totalEnr / totalCap) * 100) : 0;

            return (
              <div
                key={mission.id}
                className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                        <span>{mission.organizationName}</span>
                        <span aria-hidden="true">·</span>
                        <span>{mission.category}</span>
                      </div>
                      <h2 className="text-lg font-bold text-slate-900 font-display">
                        {mission.title}
                      </h2>
                    </div>

                    <span
                      className={`px-2.5 py-1 text-xs font-semibold rounded ${
                        percent >= 100
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {percent}% rempli
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mb-4 line-clamp-2 leading-relaxed">
                    {mission.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{mission.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{mission.startDate}</span>
                    </div>
                  </div>

                  {/* Creneaux list */}
                  <div className="space-y-2 mb-4">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Créneaux programmés ({mission.creneaux.length})
                    </p>
                    <div className="space-y-1.5">
                      {mission.creneaux.map((cr) => (
                        <div
                          key={cr.id}
                          className="flex items-center justify-between text-xs p-2 rounded bg-slate-50 border border-slate-200"
                        >
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span className="font-mono text-slate-700">
                              {cr.startTime} - {cr.endTime}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="tabular-nums font-semibold text-slate-800">
                              {cr.enrolledUserIds.length}/{cr.capacity} inscrits
                            </span>
                            <span
                              className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                                cr.enrolledUserIds.length >= cr.capacity
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-slate-200 text-slate-700'
                              }`}
                            >
                              {cr.enrolledUserIds.length >= cr.capacity ? 'Complet' : 'Ouvert'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="text-slate-500">
                    Référent : <span className="font-medium text-slate-700">{mission.referentName}</span>
                  </div>
                  <div className="text-slate-400">
                    {mission.perks.slice(0, 2).join(' · ')}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Create Mission Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-display">
                    Créer une nouvelle mission bénévole
                  </h3>
                  <p className="text-xs text-slate-500">
                    Configurez le poste, les horaires et les quotas d'inscrits requis
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="mt-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Intitulé de la mission *
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Ex: Accueil & Billetterie Festival Éco-Arts"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Catégorie *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    >
                      <option value="Accueil & Info">Accueil & Info</option>
                      <option value="Bar & Restauration">Bar & Restauration</option>
                      <option value="Logistique & Montage">Logistique & Montage</option>
                      <option value="Éco-Responsable">Éco-Responsable</option>
                      <option value="Scène & Technique">Scène & Technique</option>
                      <option value="Sécurité & Secours">Sécurité & Secours</option>
                      <option value="Solidarité & Social">Solidarité & Social</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Lieu / Adresse *
                    </label>
                    <input
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Ex: Parc de Gerland, Lyon"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Description de la mission *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Détaillez les tâches confiées aux bénévoles..."
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Date de début
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Avantages / Perks (séparés par virgules)
                    </label>
                    <input
                      type="text"
                      value={perks}
                      onChange={(e) => setPerks(e.target.value)}
                      placeholder="Ex: Repas chaud offert, Pass festival, T-shirt"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                {/* Slots Creator */}
                <div className="pt-4 border-t border-slate-200">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Créneaux Horaires & Quotas de Bénévoles
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Ajoutez les différentes tranches horaires nécessaires
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={addSlotRow}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600 hover:text-teal-700"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Ajouter un créneau</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {creneaux.map((cr, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200 text-xs"
                      >
                        <input
                          type="date"
                          value={cr.date}
                          onChange={(e) => {
                            const val = e.target.value;
                            setCreneaux((prev) =>
                              prev.map((c, i) => (i === idx ? { ...c, date: val } : c))
                            );
                          }}
                          className="px-2 py-1 border border-slate-300 rounded bg-white"
                        />
                        <input
                          type="time"
                          value={cr.startTime}
                          onChange={(e) => {
                            const val = e.target.value;
                            setCreneaux((prev) =>
                              prev.map((c, i) => (i === idx ? { ...c, startTime: val } : c))
                            );
                          }}
                          className="px-2 py-1 border border-slate-300 rounded bg-white"
                        />
                        <span>à</span>
                        <input
                          type="time"
                          value={cr.endTime}
                          onChange={(e) => {
                            const val = e.target.value;
                            setCreneaux((prev) =>
                              prev.map((c, i) => (i === idx ? { ...c, endTime: val } : c))
                            );
                          }}
                          className="px-2 py-1 border border-slate-300 rounded bg-white"
                        />

                        <div className="flex items-center gap-1 ml-auto">
                          <span className="text-[11px] text-slate-500">Quota :</span>
                          <input
                            type="number"
                            min="1"
                            max="50"
                            value={cr.capacity}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 1;
                              setCreneaux((prev) =>
                                prev.map((c, i) => (i === idx ? { ...c, capacity: val } : c))
                              );
                            }}
                            className="w-16 px-2 py-1 border border-slate-300 rounded bg-white text-center"
                          />
                        </div>

                        {creneaux.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeSlotRow(idx)}
                            className="p-1 text-slate-400 hover:text-red-500"
                            title="Supprimer ce créneau"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm"
                  >
                    Publier la Mission
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
