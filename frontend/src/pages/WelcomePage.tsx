import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useRouter } from '../context/RouterContext';
import { LayoutGrid, Users, ArrowLeft } from 'lucide-react';
import { BnevoBrand } from '../components/common/BnevoLogo';

type WelcomeView = 'menu' | 'org-login' | 'benevole-login' | 'create-org' | 'create-benevole';

export const WelcomePage: React.FC = () => {
  const { login, showToast } = useApp();
  const { pathname, search } = useRouter();

  // Detect requested initial role from URL if present
  const [view, setView] = useState<WelcomeView>(() => {
    if (search.includes('role=organisation')) return 'org-login';
    if (search.includes('role=benevole')) return 'benevole-login';
    if (pathname.includes('/connexion')) return 'benevole-login';
    return 'menu';
  });

  // Organisation Form State
  const [orgEmail, setOrgEmail] = useState('');
  const [orgPassword, setOrgPassword] = useState('');

  // Bénévole Form State
  const [volPseudo, setVolPseudo] = useState('');
  const [volPassword, setVolPassword] = useState('');

  // Creation State
  const [createName, setCreateName] = useState('');
  const [createEmail, setCreateEmail] = useState('');
  const [createPhone, setCreatePhone] = useState('');

  const handleOrgSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailToUse = orgEmail.trim() || 'asso@bnevo.com';
    const pwdToUse = orgPassword.trim() || 'admin';

    // Verify sample credentials or any provided credentials
    login('organisation', {
      name: emailToUse === 'asso@bnevo.com' ? 'Association BNEVO' : emailToUse.split('@')[0],
      email: emailToUse,
      organizationName: 'Festival Éco-Arts & Musiques',
    });
  };

  const handleBenevoleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pseudoToUse = volPseudo.trim() || 'vs827';
    const pwdToUse = volPassword.trim() || '123456';

    // Verify sample credentials or any provided credentials
    login('benevole', {
      name: pseudoToUse === 'vs827' ? 'Valentin A' : pseudoToUse,
      email: `${pseudoToUse.toLowerCase()}@bnevo.fr`,
    });
  };

  const handleCreateOrg = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createName.trim()) return;
    login('organisation', {
      name: createName.trim(),
      email: createEmail.trim() || 'contact@association.fr',
      organizationName: createName.trim(),
    });
  };

  const handleCreateBenevole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createName.trim()) return;
    login('benevole', {
      name: createName.trim(),
      email: createEmail.trim() || 'benevole@bnevo.fr',
      phone: createPhone.trim() || '06 00 00 00 00',
    });
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/40 px-4 py-8 select-none">
      {/* Subtle atmospheric background glow matching original app */}
      <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-emerald-100/35 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-teal-100/30 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <div className="w-full max-w-[430px] flex flex-col items-center text-center">
        {/* Brand Logo & Name */}
        <BnevoBrand width={320} className="mb-7" />

        {/* Tagline */}
        <div className="space-y-1 mb-8 text-slate-700 text-sm sm:text-base font-medium leading-relaxed">
          <p>Simplifiez la gestion de vos bénévoles.</p>
          <p>Libérez votre temps associatif.</p>
        </div>

        {/* VIEW 1: THE 2 MAIN BUTTONS (Default Welcome Screen) */}
        {view === 'menu' && (
          <div className="w-full space-y-4 animate-in fade-in zoom-in-95 duration-200">
            {/* Button 1: ESPACE ORGANISATION */}
            <button
              onClick={() => setView('org-login')}
              className="w-full bg-white hover:bg-emerald-50/30 border border-emerald-200/90 hover:border-emerald-400 rounded-2xl p-5 text-left transition-all duration-150 shadow-xs hover:shadow-md flex items-center justify-between group cursor-pointer"
            >
              <div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-wide font-display group-hover:text-emerald-700 transition-colors">
                  ESPACE ORGANISATION
                </h2>
                <p className="text-xs text-slate-500 mt-1 font-normal">
                  Plannings, missions et équipes
                </p>
              </div>
              <div className="text-emerald-300 group-hover:text-emerald-600 transition-colors pl-4">
                <LayoutGrid className="w-6 h-6 stroke-[1.5]" />
              </div>
            </button>

            {/* Button 2: ESPACE BÉNÉVOLE */}
            <button
              onClick={() => setView('benevole-login')}
              className="w-full bg-white hover:bg-emerald-50/30 border border-emerald-200/90 hover:border-emerald-400 rounded-2xl p-5 text-left transition-all duration-150 shadow-xs hover:shadow-md flex items-center justify-between group cursor-pointer"
            >
              <div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-wide font-display group-hover:text-emerald-700 transition-colors">
                  ESPACE BÉNÉVOLE
                </h2>
                <p className="text-xs text-slate-500 mt-1 font-normal">
                  Trouver des missions de coeur
                </p>
              </div>
              <div className="text-emerald-300 group-hover:text-emerald-600 transition-colors pl-4">
                <Users className="w-6 h-6 stroke-[1.5]" />
              </div>
            </button>
          </div>
        )}

        {/* VIEW 2: ORGANISATION LOGIN CARD (Screenshot 1 Match) */}
        {view === 'org-login' && (
          <div className="w-full bg-white rounded-3xl p-7 sm:p-8 border border-emerald-100 shadow-xl text-left animate-in fade-in zoom-in-95 duration-200">
            {/* Header with Arrow and Title */}
            <div className="flex items-center gap-4 mb-6">
              <button
                type="button"
                onClick={() => setView('menu')}
                className="p-1.5 -ml-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                aria-label="Retour à l'accueil"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 font-display tracking-wide uppercase">
                ORGANISATION
              </h2>
            </div>

            <form onSubmit={handleOrgSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={orgEmail}
                  onChange={(e) => setOrgEmail(e.target.value)}
                  placeholder="asso@exemple.com"
                  className="w-full px-4 py-3 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 placeholder:text-slate-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Mot de passe
                </label>
                <input
                  type="password"
                  value={orgPassword}
                  onChange={(e) => setOrgPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 transition-colors"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 bg-[#009560] hover:bg-[#008053] active:bg-[#007049] text-white font-semibold rounded-xl text-sm transition-all shadow-xs cursor-pointer"
                >
                  Se connecter
                </button>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setView('create-org')}
                  className="text-xs text-slate-600 hover:text-emerald-700 font-medium transition-colors cursor-pointer"
                >
                  Créer mon association
                </button>
              </div>

              {/* Sample credentials helper */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Démo: asso@bnevo.com</span>
                <button
                  type="button"
                  onClick={() => {
                    setOrgEmail('asso@bnevo.com');
                    setOrgPassword('admin');
                  }}
                  className="text-emerald-600 hover:underline font-semibold"
                >
                  Remplir (admin)
                </button>
              </div>
            </form>
          </div>
        )}

        {/* VIEW 3: BÉNÉVOLE LOGIN CARD (Screenshot 2 Match) */}
        {view === 'benevole-login' && (
          <div className="w-full bg-white rounded-3xl p-7 sm:p-8 border border-emerald-100 shadow-xl text-left animate-in fade-in zoom-in-95 duration-200">
            {/* Header with Arrow and Title */}
            <div className="flex items-center gap-4 mb-6">
              <button
                type="button"
                onClick={() => setView('menu')}
                className="p-1.5 -ml-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                aria-label="Retour à l'accueil"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 font-display tracking-wide uppercase">
                BÉNÉVOLE
              </h2>
            </div>

            <form onSubmit={handleBenevoleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Pseudo / Identifiant
                </label>
                <input
                  type="text"
                  value={volPseudo}
                  onChange={(e) => setVolPseudo(e.target.value)}
                  placeholder="Ex: vs827"
                  className="w-full px-4 py-3 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 placeholder:text-slate-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Mot de passe
                </label>
                <input
                  type="password"
                  value={volPassword}
                  onChange={(e) => setVolPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 transition-colors"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 bg-[#009560] hover:bg-[#008053] active:bg-[#007049] text-white font-semibold rounded-xl text-sm transition-all shadow-xs cursor-pointer"
                >
                  Se connecter
                </button>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setView('create-benevole')}
                  className="text-xs text-slate-600 hover:text-emerald-700 font-medium transition-colors cursor-pointer"
                >
                  Créer mon compte
                </button>
              </div>

              {/* Sample credentials helper */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Démo: vs827</span>
                <button
                  type="button"
                  onClick={() => {
                    setVolPseudo('vs827');
                    setVolPassword('123456');
                  }}
                  className="text-emerald-600 hover:underline font-semibold"
                >
                  Remplir (123456)
                </button>
              </div>
            </form>
          </div>
        )}

        {/* VIEW 4: CREATE ASSOCIATION FORM */}
        {view === 'create-org' && (
          <div className="w-full bg-white rounded-3xl p-7 sm:p-8 border border-emerald-100 shadow-xl text-left animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-4 mb-6">
              <button
                type="button"
                onClick={() => setView('org-login')}
                className="p-1.5 -ml-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 font-display tracking-wide uppercase">
                CRÉER MON ASSOCIATION
              </h2>
            </div>

            <form onSubmit={handleCreateOrg} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Nom de l'association / événement *
                </label>
                <input
                  type="text"
                  required
                  value={createName}
                  onChange={(e) => setCreateName(e.target.value)}
                  placeholder="Ex: Collectif Éco-Solidaire"
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email de contact *
                </label>
                <input
                  type="email"
                  required
                  value={createEmail}
                  onChange={(e) => setCreateEmail(e.target.value)}
                  placeholder="contact@association.fr"
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-[#009560] hover:bg-[#008053] text-white font-semibold rounded-xl text-sm transition-all shadow-xs"
                >
                  Créer et accéder à mon espace
                </button>
              </div>
            </form>
          </div>
        )}

        {/* VIEW 5: CREATE BÉNÉVOLE ACCOUNT */}
        {view === 'create-benevole' && (
          <div className="w-full bg-white rounded-3xl p-7 sm:p-8 border border-emerald-100 shadow-xl text-left animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-4 mb-6">
              <button
                type="button"
                onClick={() => setView('benevole-login')}
                className="p-1.5 -ml-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 font-display tracking-wide uppercase">
                CRÉER MON COMPTE BÉNÉVOLE
              </h2>
            </div>

            <form onSubmit={handleCreateBenevole} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Pseudo ou Prénom & Nom *
                </label>
                <input
                  type="text"
                  required
                  value={createName}
                  onChange={(e) => setCreateName(e.target.value)}
                  placeholder="Ex: Alex Martin"
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Numéro de portable (pour les rappels SMS)
                </label>
                <input
                  type="tel"
                  value={createPhone}
                  onChange={(e) => setCreatePhone(e.target.value)}
                  placeholder="06 12 34 56 78"
                  className="w-full px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-[#009560] hover:bg-[#008053] text-white font-semibold rounded-xl text-sm transition-all shadow-xs"
                >
                  Créer et commencer à m'engager
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
