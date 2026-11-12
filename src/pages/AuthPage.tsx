import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useRouter } from '../context/RouterContext';
import { ArrowLeft } from 'lucide-react';
import { BnevoBrand } from '../components/common/BnevoLogo';

export const AuthPage: React.FC = () => {
  const { login } = useApp();
  const { push, search } = useRouter();

  const isOrgDefault = search.includes('role=organisation');
  const [role, setRole] = useState<'organisation' | 'benevole'>(isOrgDefault ? 'organisation' : 'benevole');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pseudo, setPseudo] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'organisation') {
      const emailToUse = email.trim() || 'asso@bnevo.com';
      login('organisation', {
        name: emailToUse === 'asso@bnevo.com' ? 'Association BNEVO' : emailToUse.split('@')[0],
        email: emailToUse,
        organizationName: 'Festival Éco-Arts & Musiques',
      });
    } else {
      const pseudoToUse = pseudo.trim() || 'vs827';
      login('benevole', {
        name: pseudoToUse === 'vs827' ? 'Valentin A' : pseudoToUse,
        email: `${pseudoToUse.toLowerCase()}@bnevo.fr`,
      });
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/40 px-4 py-8 select-none">
      <div className="w-full max-w-[430px] flex flex-col items-center text-center">
        {/* Brand Logo & Name */}
        <BnevoBrand width={320} className="mb-7" />

        {/* Tagline */}
        <div className="space-y-1 mb-8 text-slate-700 text-sm sm:text-base font-medium leading-relaxed">
          <p>Simplifiez la gestion de vos bénévoles.</p>
          <p>Libérez votre temps associatif.</p>
        </div>

        {/* Login Card */}
        <div className="w-full bg-white rounded-3xl p-7 sm:p-8 border border-emerald-100 shadow-xl text-left">
          <div className="flex items-center gap-4 mb-6">
            <button
              type="button"
              onClick={() => push('/')}
              className="p-1.5 -ml-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              aria-label="Retour à l'accueil"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 font-display tracking-wide uppercase">
              {role === 'organisation' ? 'ORGANISATION' : 'BÉNÉVOLE'}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {role === 'organisation' ? (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="asso@exemple.com"
                  className="w-full px-4 py-3 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 placeholder:text-slate-400"
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Pseudo / Identifiant
                </label>
                <input
                  type="text"
                  value={pseudo}
                  onChange={(e) => setPseudo(e.target.value)}
                  placeholder="Ex: vs827"
                  className="w-full px-4 py-3 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 placeholder:text-slate-400"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-[#009560] hover:bg-[#008053] text-white font-semibold rounded-xl text-sm transition-all shadow-xs cursor-pointer"
              >
                Se connecter
              </button>
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setRole(role === 'organisation' ? 'benevole' : 'organisation')}
                className="text-xs text-slate-600 hover:text-emerald-700 font-medium transition-colors cursor-pointer"
              >
                {role === 'organisation' ? 'Créer mon association' : 'Créer mon compte'}
              </button>
            </div>

            {/* Helper test credentials */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>
                {role === 'organisation' ? 'Démo: asso@bnevo.com' : 'Démo: vs827'}
              </span>
              <button
                type="button"
                onClick={() => {
                  if (role === 'organisation') {
                    setEmail('asso@bnevo.com');
                    setPassword('admin');
                  } else {
                    setPseudo('vs827');
                    setPassword('123456');
                  }
                }}
                className="text-emerald-600 hover:underline font-semibold"
              >
                Remplir
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
