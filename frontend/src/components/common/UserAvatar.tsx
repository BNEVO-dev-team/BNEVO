import React from 'react';
import type { UserSession } from '../../types';

interface UserAvatarProps {
  user: Pick<UserSession, 'name' | 'avatarUrl'>;
  className: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ user, className }) => {
  const initials = user.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  return (
    <span className={`${className} inline-flex items-center justify-center overflow-hidden`}>
      {user.avatarUrl ? (
        <img src={user.avatarUrl} alt="" className="h-full w-full object-cover" />
      ) : (
        initials || 'U'
      )}
    </span>
  );
};
