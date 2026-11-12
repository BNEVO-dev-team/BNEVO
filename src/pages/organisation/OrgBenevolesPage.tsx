import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Phone, Mail, Award, Clock, MapPin, CheckCircle, ShieldCheck } from 'lucide-react';

export const OrgBenevolesPage: React.FC = () => {
  const { volunteers, missions } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [skillFilter, setSkillFilter] = useState('all');

  // Collect all unique skills
  const allSkills = Array.from(new Set(volunteers.flatMap((v) => v.skills)));

  const filteredVolunteers = volunteers.filter((vol) => {
    const matchesSearch =
      vol.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vol.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vol.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vol.phone.includes(searchTerm);

    const matchesSkill = skillFilter === 'all' || vol.skills.includes(skillFilter);

    return matchesSearch && matchesSkill;
  });

  return (
    <div className="flex-1 bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span>Espace Organisation</span>
              <span aria-hidden="true">·</span>
              <span>Ressources Humaines & Bénévolat</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 font-display">
              Annuaire des Bénévoles ({volunteers.length})
            </h1>
          </div>

          <div className="text-xs text-slate-500">
            Tous les profils sont vérifiés et conformes à la charte d'engagement BNEVO.
          </div>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par nom, téléphone, ville ou compétence..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-slate-200/60 rounded-lg">
            <button
              onClick={() => setSkillFilter('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                skillFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Toutes compétences
            </button>
            {allSkills.slice(0, 4).map((skill) => (
              <button
                key={skill}
                onClick={() => setSkillFilter(skill)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  skillFilter === skill
                    ? 'bg-white text-slate-900 shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>

        {/* Volunteers Table / Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredVolunteers.map((vol) => (
            <div
              key={vol.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start gap-3.5 mb-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden border border-slate-200 flex-shrink-0">
                    <img
                      src={vol.avatarUrl}
                      alt={vol.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 leading-tight">
                      {vol.name}
                    </h2>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{vol.city}</span>
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 text-center py-2.5 px-3 bg-slate-50 rounded-lg border border-slate-100 mb-4">
                  <div>
                    <p className="text-sm font-bold text-slate-900 font-display tabular-nums">
                      {vol.totalHours} h
                    </p>
                    <p className="text-[10px] text-slate-400 uppercase">Heures réalisées</p>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-teal-600 font-display tabular-nums">
                      {vol.missionsCount}
                    </p>
                    <p className="text-[10px] text-slate-400 uppercase">Missions</p>
                  </div>
                </div>

                {/* Skills */}
                <div className="mb-4">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Compétences & Atouts
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {vol.skills.map((s, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Emergency Contact */}
                {vol.emergencyContact && (
                  <div className="text-[11px] text-slate-500 bg-amber-50/60 p-2 rounded border border-amber-100 mb-4">
                    <span className="font-semibold text-amber-900">Contact d'urgence : </span>
                    {vol.emergencyContact.name} ({vol.emergencyContact.relationship}) - {vol.emergencyContact.phone}
                  </div>
                )}
              </div>

              {/* Contact Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                <a
                  href={`tel:${vol.phone}`}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
                >
                  <Phone className="w-3.5 h-3.5 text-teal-600" />
                  <span>{vol.phone}</span>
                </a>
                <a
                  href={`mailto:${vol.email}`}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 truncate"
                >
                  <Mail className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="truncate">Email</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
