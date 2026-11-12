import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useRouter, Link } from '../../context/RouterContext';
import { BnevoBrand } from '../common/BnevoLogo';
import { ProfilePhotoButton } from '../common/ProfilePhotoButton';
import { ASSOCIATION_CODE } from '../../data/mockData';
import {
  LogOut,
  Key,
  Pencil,
  X
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentUser, logout, showToast } = useApp();
  const { pathname, push } = useRouter();
  const [orgName, setOrgName] = useState('Le Chant du Coq Solidaire');
  const [isEditingOrg, setIsEditingOrg] = useState(false);
  const [isAssociationCodeOpen, setIsAssociationCodeOpen] = useState(false);

  const copyAssociationCode = async () => {
    try {
      await navigator.clipboard.writeText(ASSOCIATION_CODE);
      showToast('Code association copié.', 'success');
    } catch (error) {
      console.error('Failed to copy association code', error);
      showToast('Copie impossible. Vous pouvez sélectionner le code pour le copier.', 'warning');
    }
  };

  // If on organisation side, render the exact header from Screenshot 1 & 3
  if (currentUser?.role === 'organisation') {
    return (
      <>
      <header className="sticky top-0 z-40 bg-white border-b border-slate-100/90 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            {/* Left: Brand + Organization Name & Tier Pill */}
            <div className="flex items-center gap-6">
              <Link href="/organisation" className="flex-shrink-0">
                <BnevoBrand width={135} />
              </Link>

              {/* Org Name with edit pencil and Tier pills */}
              <div className="hidden sm:flex flex-col text-left">
                <div className="flex items-center gap-1.5">
                  {isEditingOrg ? (
                    <input
                      type="text"
                      value={orgName}
                      autoFocus
                      onBlur={() => setIsEditingOrg(false)}
                      onChange={(e) => setOrgName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && setIsEditingOrg(false)}
                      className="text-xs font-semibold text-slate-800 border-b border-emerald-500 focus:outline-none"
                    />
                  ) : (
                    <span className="text-xs font-semibold text-slate-700">
                      {orgName}
                    </span>
                  )}
                  <button
                    onClick={() => setIsEditingOrg(!isEditingOrg)}
                    className="text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                    title="Modifier le nom"
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                </div>

                <div className="flex items-center gap-2 mt-0.5">
                  <span className="bg-slate-100 text-slate-500 font-bold text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-md">
                    TIER GRATUIT
                  </span>
                  <Link
                    href="/organisation/offres"
                    className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold text-[10px] px-2 py-0.5 rounded-md transition-colors cursor-pointer"
                  >
                    Gérer l'offre
                  </Link>
                </div>
              </div>
            </div>

            {/* Right: Organisateur label, Key, AD Avatar, Logout icon */}
            <div className="flex items-center gap-3 sm:gap-4">
              <span className="text-xs font-bold text-slate-500 tracking-wider uppercase">
                ORGANISATEUR
              </span>

              {/* Mint Key circle */}
              <button
                type="button"
                onClick={() => setIsAssociationCodeOpen(true)}
                className="w-8 h-8 rounded-full bg-emerald-100/90 text-emerald-700 flex items-center justify-center flex-shrink-0 hover:bg-emerald-200 transition-colors"
                title="Afficher le code association"
                aria-label="Afficher le code association"
              >
                <Key className="w-4 h-4" />
              </button>

              {/* Magenta / Pink AD avatar circle */}
              <ProfilePhotoButton
                user={currentUser}
                className="rounded-full"
                avatarClassName="h-8 w-8 rounded-full bg-[#e879f9] text-xs font-bold text-white shadow-2xs"
              />

              {/* Logout icon */}
              <button
                onClick={logout}
                className="text-slate-400 hover:text-slate-700 p-1.5 transition-colors cursor-pointer"
                title="Se déconnecter"
                aria-label="Déconnexion"
              >
                <LogOut className="w-5 h-5 stroke-[1.75]" />
              </button>
            </div>
          </div>
        </div>
      </header>
      {isAssociationCodeOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs"
          onClick={() => setIsAssociationCodeOpen(false)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="association-code-title"
            className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="association-code-title" className="text-base font-extrabold text-slate-900">
                  Code de l’association
                </h2>
                <p className="mt-1 text-sm text-slate-500">{orgName}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAssociationCodeOpen(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Fermer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-center font-mono text-lg font-bold tracking-widest text-emerald-800">
              {ASSOCIATION_CODE}
            </p>
            <p className="mt-3 text-xs leading-relaxed text-slate-500">
              Partagez ce code pour permettre aux bénévoles de rejoindre votre association.
            </p>
            <button
              type="button"
              onClick={copyAssociationCode}
              className="mt-5 w-full rounded-xl bg-emerald-700 py-3 text-sm font-bold text-white transition-colors hover:bg-emerald-800"
            >
              Copier le code
            </button>
          </section>
        </div>
      )}
      </>
    );
  }

  // Bénévole Header matching Screenshot 1
  if (currentUser?.role === 'benevole') {
    return (
      <>
      <header className="sticky top-0 z-40 bg-white border-b border-slate-100/90 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            {/* Left: Brand + Organization Subtitle */}
            <div className="flex items-center gap-6">
              <Link href="/benevole" className="flex-shrink-0">
                <BnevoBrand width={135} />
              </Link>
              <span className="hidden sm:inline-block text-xs font-semibold text-slate-500">
                Le Chant du Coq Solidaire
              </span>
            </div>

            {/* Right: User name, role badge, VA avatar, logout */}
            <div className="flex items-center gap-3.5">
              <div className="flex flex-col text-right">
                <span className="text-xs font-bold text-slate-800 leading-tight">
                  {currentUser.name || 'Valentin'}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  BÉNÉVOLE
                </span>
              </div>

              {/* Blue VA Avatar matching Screenshot 1 */}
              <ProfilePhotoButton
                user={currentUser}
                className="flex-shrink-0 rounded-xl"
                avatarClassName="h-8 w-8 rounded-xl bg-[#0284c7] text-xs font-extrabold text-white shadow-2xs"
              />

              {/* Logout icon matching Screenshot 1 */}
              <button
                onClick={logout}
                className="text-slate-400 hover:text-slate-700 p-1 transition-colors cursor-pointer"
                title="Se déconnecter"
                aria-label="Déconnexion"
              >
                <LogOut className="w-5 h-5 stroke-[1.75]" />
              </button>
            </div>
          </div>
        </div>
      </header>
      </>
    );
  }

  // Fallback for Guest
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex-shrink-0">
              <BnevoBrand width={125} />
            </Link>

            {currentUser && (
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                Bénévole
              </span>
            )}
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link
              href="/benevole"
              className={`transition-colors hover:text-teal-600 ${pathname === '/benevole' ? 'text-teal-600 font-semibold' : 'text-slate-600'}`}
            >
              Mon Espace
            </Link>
            <Link
              href="/benevole/missions"
              className={`transition-colors hover:text-teal-600 ${pathname === '/benevole/missions' ? 'text-teal-600 font-semibold' : 'text-slate-600'}`}
            >
              Catalogue Missions
            </Link>
            <Link
              href="/benevole/planning"
              className={`transition-colors hover:text-teal-600 ${pathname === '/benevole/planning' ? 'text-teal-600 font-semibold' : 'text-slate-600'}`}
            >
              Mes Créneaux
            </Link>
            <Link
              href="/benevole/profil"
              className={`transition-colors hover:text-teal-600 ${pathname === '/benevole/profil' ? 'text-teal-600 font-semibold' : 'text-slate-600'}`}
            >
              Mon Profil
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-200/60 cursor-pointer"
              title="Déconnexion de BNEVO"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
