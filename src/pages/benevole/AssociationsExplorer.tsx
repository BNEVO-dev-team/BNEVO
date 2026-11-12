import React, { useState } from 'react';
import { Building2, Check, CheckCircle2, KeyRound, Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DEFAULT_JOINED_ASSOCIATION_IDS } from '../../data/mockData';

interface AssociationsExplorerProps {
  onBackToDashboard: () => void;
}

export const AssociationsExplorer: React.FC<AssociationsExplorerProps> = ({
  onBackToDashboard,
}) => {
  const {
    associations,
    joinedAssociationIds,
    joinAssociation,
    leaveAssociation,
  } = useApp();
  const [associationCode, setAssociationCode] = useState('');

  const joinedAssociations = associations.filter((association) =>
    joinedAssociationIds.includes(association.id)
  );
  const availableAssociations = associations.filter(
    (association) => !joinedAssociationIds.includes(association.id)
  );

  const getMemberCount = (associationId: string, memberCount: number) => {
    const wasInitiallyJoined = DEFAULT_JOINED_ASSOCIATION_IDS.includes(associationId);
    const isJoined = joinedAssociationIds.includes(associationId);
    return memberCount + Number(isJoined && !wasInitiallyJoined) - Number(!isJoined && wasInitiallyJoined);
  };

  const handleJoinByCode = (event: React.FormEvent) => {
    event.preventDefault();
    if (joinAssociation(associationCode)) setAssociationCode('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-emerald-50/30 to-emerald-50/70 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex justify-center">
          <div className="flex items-center gap-1 rounded-2xl border border-emerald-200/60 bg-[#d1fae5]/80 p-1 shadow-2xs">
            <button
              type="button"
              onClick={onBackToDashboard}
              className="rounded-xl px-5 py-2 text-xs font-bold text-emerald-900/80 transition-colors hover:bg-white/70 sm:text-sm"
            >
              Mon Dashboard
            </button>
            <button
              type="button"
              aria-current="page"
              className="flex items-center gap-2 rounded-xl bg-white px-5 py-2 text-xs font-bold text-emerald-800 shadow-xs sm:text-sm"
            >
              <Search className="h-4 w-4" />
              Explorer
            </button>
          </div>
        </div>

        <form
          onSubmit={handleJoinByCode}
          className="flex flex-col gap-4 rounded-3xl border border-emerald-200 bg-emerald-100/80 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"
        >
          <div className="flex items-start gap-3">
            <KeyRound className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
            <div>
              <h1 className="text-sm font-extrabold uppercase tracking-wide text-emerald-950 sm:text-base">
                Rejoindre avec un code
              </h1>
              <p className="mt-1 text-xs text-emerald-800">
                Saisissez le code fourni par votre association pour la rejoindre.
              </p>
            </div>
          </div>
          <div className="flex gap-2 sm:w-[330px]">
            <input
              value={associationCode}
              onChange={(event) => setAssociationCode(event.target.value)}
              placeholder="Ex. COQ-2025"
              aria-label="Code association"
              className="min-w-0 flex-1 rounded-xl border border-emerald-200 bg-white px-4 py-2.5 text-sm uppercase text-slate-900 shadow-2xs outline-none placeholder:normal-case placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
            />
            <button
              type="submit"
              disabled={!associationCode.trim()}
              className="rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Valider
            </button>
          </div>
        </form>

        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            <h2 className="text-lg font-extrabold uppercase tracking-wide text-slate-900">
              Mes associations
            </h2>
          </div>
          {joinedAssociations.length ? (
            <div className="grid gap-5 md:grid-cols-2">
              {joinedAssociations.map((association) => (
                <article
                  key={association.id}
                  className="rounded-3xl border border-emerald-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-200">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                      <Check className="h-3 w-3" />
                      Membre
                    </span>
                  </div>
                  <h3 className="mt-4 text-sm font-extrabold uppercase text-slate-900">
                    {association.name}
                  </h3>
                  <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Code : {association.code}
                  </p>
                  <button
                    type="button"
                    onClick={() => leaveAssociation(association.id)}
                    className="mt-5 w-full rounded-xl border border-slate-200 py-2.5 text-xs font-bold text-rose-600 transition-colors hover:border-rose-200 hover:bg-rose-50"
                  >
                    Quitter
                  </button>
                </article>
              ))}
            </div>
          ) : (
            <p className="rounded-2xl border border-dashed border-emerald-200 bg-white/70 p-6 text-sm text-slate-500">
              Vous n’avez pas encore rejoint d’association.
            </p>
          )}
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-emerald-500" />
            <h2 className="text-lg font-extrabold uppercase tracking-wide text-slate-900">
              Découvrir
            </h2>
          </div>
          {availableAssociations.length ? (
            <div className="grid gap-5 md:grid-cols-2">
              {availableAssociations.map((association) => {
                const memberCount = getMemberCount(association.id, association.memberCount);
                const isFull = memberCount >= association.maxMembers;

                return (
                  <article
                    key={association.id}
                    className="rounded-3xl border border-emerald-100 bg-white/80 p-5 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <span className="pt-2 text-[10px] font-semibold text-slate-400">
                        {memberCount} / {association.maxMembers}
                      </span>
                    </div>
                    <h3 className="mt-4 text-sm font-extrabold uppercase text-slate-900">
                      {association.name}
                    </h3>
                    <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Code : {association.code}
                    </p>
                    <button
                      type="button"
                      onClick={() => joinAssociation(association.code)}
                      disabled={isFull}
                      className="mt-5 w-full rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                      {isFull ? 'Complet' : 'Rejoindre'}
                    </button>
                  </article>
                );
              })}
            </div>
          ) : (
            <p className="rounded-2xl border border-dashed border-emerald-200 bg-white/70 p-6 text-sm text-slate-500">
              Vous avez rejoint toutes les associations proposées.
            </p>
          )}
        </section>
      </div>
    </div>
  );
};
