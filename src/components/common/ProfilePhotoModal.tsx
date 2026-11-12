import React, { useEffect, useRef, useState } from 'react';
import { ImagePlus, Trash2, X } from 'lucide-react';
import type { UserSession } from '../../types';
import { prepareProfileImage } from '../../utils/profileImage';
import { UserAvatar } from './UserAvatar';

interface ProfilePhotoModalProps {
  user: UserSession;
  onSave: (avatarUrl: string | null) => void;
  onClose: () => void;
}

export const ProfilePhotoModal: React.FC<ProfilePhotoModalProps> = ({
  user,
  onSave,
  onClose,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || '');
  const [hasChanges, setHasChanges] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setAvatarUrl(user.avatarUrl || '');
    setHasChanges(false);
    setErrorMessage('');
  }, [user.id, user.avatarUrl]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setErrorMessage('');
    setIsProcessing(true);
    try {
      setAvatarUrl(await prepareProfileImage(file));
      setHasChanges(true);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Impossible de charger cette image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemove = () => {
    setAvatarUrl('');
    setHasChanges(true);
    setErrorMessage('');
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (hasChanges && !isProcessing) onSave(avatarUrl || null);
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-photo-title"
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 id="profile-photo-title" className="text-sm font-extrabold uppercase tracking-wide text-slate-900">
            Ma photo de profil
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
            aria-label="Fermer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col items-center py-6">
          <UserAvatar
            user={{ name: user.name, avatarUrl: avatarUrl || undefined }}
            className="h-24 w-24 rounded-2xl border-4 border-emerald-100 bg-emerald-100 text-2xl font-semibold text-emerald-900 shadow-sm"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-emerald-700 hover:text-emerald-900 disabled:opacity-60"
          >
            <ImagePlus className="h-4 w-4" />
            {isProcessing ? 'Préparation…' : 'Changer de photo'}
          </button>
          {avatarUrl && (
            <button
              type="button"
              onClick={handleRemove}
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-800"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Supprimer la photo
            </button>
          )}
          <p className="mt-3 text-center text-[11px] text-slate-400">
            JPG, PNG ou WEBP, 5 Mo maximum
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="sr-only"
          aria-label="Sélectionner une photo de profil"
        />
        {errorMessage && (
          <p role="alert" className="mb-4 rounded-lg bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700">
            {errorMessage}
          </p>
        )}

        <div className="space-y-2">
          <button
            type="submit"
            disabled={!hasChanges || isProcessing}
            className="w-full rounded-xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Enregistrer
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
};
