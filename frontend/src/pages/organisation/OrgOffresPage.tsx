import React, { useState } from 'react';
import { useRouter } from '../../context/RouterContext';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Check, AlertTriangle } from 'lucide-react';

export const OrgOffresPage: React.FC = () => {
  const { push } = useRouter();
  const { showToast } = useApp();
  const [billingPeriod, setBillingPeriod] = useState<'mensuel' | 'annuel'>('mensuel');
  const [currentTier, setCurrentTier] = useState<'gratuit' | 'premium'>('gratuit');

  const handleSelectTier = (tier: 'gratuit' | 'premium') => {
    setCurrentTier(tier);
    if (tier === 'premium') {
      showToast('Félicitations ! Vous êtes passé à l\'Offre Premium illimitée.', 'success');
    } else {
      showToast('Vous avez sélectionné l\'Offre Découverte gratuite.', 'info');
    }
  };

  return (
    <div className="flex-1 bg-white py-10 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-5xl mx-auto">
        {/* Top Header Row with Arrow, Title, and Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => push('/organisation')}
              className="p-1.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              aria-label="Retour au tableau de bord"
            >
              <ArrowLeft className="w-6 h-6 stroke-[2]" />
            </button>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tracking-wide uppercase">
              NOS OFFRES
            </h1>
          </div>

          {/* Billing Switch (Mensuel / Annuel -16%) */}
          <div className="flex items-center bg-slate-100/90 p-1.5 rounded-full border border-slate-200/80 self-start sm:self-auto">
            <button
              onClick={() => setBillingPeriod('mensuel')}
              className={`px-5 py-2 text-xs font-bold rounded-full transition-all cursor-pointer ${
                billingPeriod === 'mensuel'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              MENSUEL
            </button>
            <button
              onClick={() => setBillingPeriod('annuel')}
              className={`flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-full transition-all cursor-pointer ${
                billingPeriod === 'annuel'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>ANNUEL</span>
              <span className="bg-emerald-500 text-white font-extrabold text-[10px] px-1.5 py-0.5 rounded-md">
                -16%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto">
          {/* Card 1: OFFRE DÉCOUVERTE */}
          <div className="bg-white rounded-3xl p-8 border-2 border-emerald-500/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative">
            <div>
              <h2 className="text-xl font-bold text-emerald-700 font-display tracking-tight">
                OFFRE DÉCOUVERTE
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                (100% gratuit)
              </p>

              <div className="my-6">
                <span className="text-5xl font-black text-slate-900 font-display">
                  0€
                </span>
                <span className="text-slate-500 text-lg font-medium ml-1">
                  / mois
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-6 font-normal">
                Testez l'efficacité BNEVO sur vos petits événements.
              </p>

              {/* Features List */}
              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-slate-800 font-medium leading-snug">
                    <strong className="font-bold">Planning Interactif :</strong> Créez vos événements et missions facilement.
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-slate-800 font-medium leading-snug">
                    <strong className="font-bold">Alerte Anti-Surprise :</strong> Notification dès qu'un bénévole a un imprévu.
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-slate-800 font-medium leading-snug">
                    <strong className="font-bold">Démarchage Auto Mail :</strong> Démarchage automatique lors d'un désistement.
                  </span>
                </div>

                <div className="flex items-start gap-3 text-slate-400">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-slate-400" />
                  <span className="leading-snug">
                    Limite : Maximum 10 bénévoles contactés.
                  </span>
                </div>

                <div className="flex items-start gap-3 text-slate-400">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-slate-400" />
                  <span className="leading-snug">
                    Limite : Maximum 5 évènements par an.
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <button
                onClick={() => handleSelectTier('gratuit')}
                className="w-full py-4 px-6 bg-[#009560] hover:bg-[#008053] active:bg-[#007049] text-white font-bold rounded-2xl text-sm transition-all shadow-xs cursor-pointer"
              >
                {currentTier === 'gratuit' ? 'Offre actuelle (Activée)' : 'Choisir cette offre'}
              </button>
            </div>
          </div>

          {/* Card 2: OFFRE PREMIUM */}
          <div className="bg-white rounded-3xl p-8 border-2 border-emerald-500 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative">
            {/* Recommandé Badge */}
            <div className="absolute -top-3.5 right-6">
              <span className="bg-[#009560] text-white font-extrabold text-[11px] uppercase tracking-wider px-3.5 py-1 rounded-md shadow-xs">
                RECOMMANDÉ
              </span>
            </div>

            <div>
              <h2 className="text-xl font-bold text-emerald-700 font-display tracking-tight">
                OFFRE PREMIUM
              </h2>

              <div className="my-6">
                <span className="text-5xl font-black text-slate-900 font-display">
                  {billingPeriod === 'mensuel' ? '19,90€' : '16,70€'}
                </span>
                <span className="text-slate-500 text-lg font-medium ml-1">
                  / mois
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-6 font-normal">
                La sécurité absolue pour vos gros événements et une diffusion massive.
              </p>

              {/* Features List */}
              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-slate-800 font-bold leading-snug">
                    Toutes les fonctions de l'Offre Découverte
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-slate-800 font-bold leading-snug">
                    Événements Illimités
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-slate-800 font-bold leading-snug">
                    Démarchage Illimité Mail + SMS
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-slate-800 font-medium leading-snug">
                    <strong className="font-bold">Dashboard & Statistiques :</strong> Tableau de bord complet de pilotage.
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <button
                onClick={() => handleSelectTier('premium')}
                className="w-full py-4 px-6 bg-[#009560] hover:bg-[#008053] active:bg-[#007049] text-white font-bold rounded-2xl text-sm transition-all shadow-xs cursor-pointer"
              >
                Passer au Premium
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
