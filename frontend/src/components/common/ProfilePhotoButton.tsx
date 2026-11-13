import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { UserSession } from '../../types';
import { ProfilePhotoModal } from './ProfilePhotoModal';
import { UserAvatar } from './UserAvatar';

interface ProfilePhotoButtonProps {
  user: UserSession;
  className: string;
  avatarClassName: string;
}

export const ProfilePhotoButton: React.FC<ProfilePhotoButtonProps> = ({
  user,
  className,
  avatarClassName,
}) => {
  const { updateProfileAvatar } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`${className} focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500`}
        title="Modifier la photo de profil"
        aria-label="Modifier la photo de profil"
      >
        <UserAvatar user={user} className={avatarClassName} />
      </button>
      {isOpen && (
        <ProfilePhotoModal
          user={user}
          onSave={(avatarUrl) => {
            updateProfileAvatar(avatarUrl);
            setIsOpen(false);
          }}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
