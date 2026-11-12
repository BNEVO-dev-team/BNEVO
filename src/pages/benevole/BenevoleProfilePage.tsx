import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserAvatar } from '../../components/common/UserAvatar';
import {
  User,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  Award,
  Download,
  Shield,
  Save,
  Clock,
  Briefcase
} from 'lucide-react';

export const BenevoleProfilePage: React.FC = () => {
  const { currentUser, updateVolunteerProfile, showToast } = useApp();

  const [name, setName] = useState(currentUser?.name || 'Lucas Moreau');
  const [email, setEmail] = useState(currentUser?.email || 'lucas.moreau@email.fr');
  const [phone, setPhone] = useState(currentUser?.phone || '06 98 76 54 32');
  const [city, setCity] = useState(currentUser?.city || 'Lyon');

  const availableSkillsList = [
    'Accueil & Billetterie',
    'Premiers secours PSC1',
    'Permis B',
    'Sensibilisation au tri & Écologie',
    'Service bar & restauration',
    'Régie technique & son',
    'Anglais courant',
    'Gestion des flux & sécurité',
  ];

  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    'Accueil & Billetterie',
    'Gestion des flux',
    'Anglais courant',
    'Permis B',
  ]);

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateVolunteerProfile({
      name,
      email,
      phone,
      city,
      skills: selectedSkills,
    });
  };

  const handleDownloadAttestation = () => {
    showToast('Attestation officielle d\'engagement bénévole générée et téléchargée (PDF).', 'success');
  };

  return (
    <div className="flex-1 bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span>Espace Bénévoles</span>
              <span aria-hidden="true">·</span>
              <span>Mon Compte</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 font-display">
              Profil Bénévole & Compétences
            </h1>
          </div>

          <button
            onClick={handleDownloadAttestation}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-teal-600" />
            <span>Télécharger mon attestation ({currentUser?.hoursCompleted || 24}h)</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left card: Summary & Avatar */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col items-center text-center">
            <UserAvatar
              user={{ name, avatarUrl: currentUser?.avatarUrl }}
              className="mb-4 h-24 w-24 rounded-full border-2 border-teal-500 bg-emerald-100 text-xl font-bold text-emerald-900 shadow-sm"
            />
            <h2 className="text-lg font-bold text-slate-900">{name}</h2>
            <p className="text-xs text-slate-500">{city} · Bénévole certifié</p>

            <div className="w-full grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-slate-100 text-center">
              <div>
                <p className="text-2xl font-extrabold text-slate-900 font-display tabular-nums">
                  {currentUser?.hoursCompleted || 24} h
                </p>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Total Heures</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-teal-600 font-display tabular-nums">
                  4
                </p>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Missions</p>
              </div>
            </div>

            <div className="w-full mt-6 bg-slate-50 p-3 rounded-lg border border-slate-100 text-left text-xs text-slate-600 space-y-1">
              <p className="font-semibold text-slate-800">Badge BNEVO Éco-Citoyen</p>
              <p className="text-[11px] text-slate-500">
                Participation active à des événements certifiés développement durable.
              </p>
            </div>
          </div>

          {/* Right: Profile editor form */}
          <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <form onSubmit={handleSave} className="space-y-5">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
                Coordonnées Personnelles
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nom & Prénom *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ville de résidence *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Adresse e-mail
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Numéro de portable (SMS d'alerte)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              </div>

              {/* Skills selection */}
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Mes Compétences & Permis
                </h3>
                <p className="text-[11px] text-slate-500 mb-3">
                  Ces informations aident les coordinateurs à vous attribuer les postes où vous serez le plus à l'aise.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {availableSkillsList.map((skill) => {
                    const isChecked = selectedSkills.includes(skill);
                    return (
                      <button
                        type="button"
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs text-left transition-all ${
                          isChecked
                            ? 'bg-teal-50 border-teal-300 text-teal-900 font-semibold'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span
                          className={`w-4 h-4 rounded border flex items-center justify-center ${
                            isChecked
                              ? 'bg-teal-600 border-teal-600 text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isChecked && <CheckCircle2 className="w-3 h-3" />}
                        </span>
                        <span>{skill}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>Enregistrer les modifications</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
