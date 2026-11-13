import React from 'react';

export const BnevoLogoIcon: React.FC<{ className?: string; size?: number }> = ({
  className = 'w-10 h-10',
  size = 40,
}) => {
  return (
    <img
      src="/images/ICONE.png"
      alt=""
      width={size}
      height={size}
      className={className}
    />
  );
};

export const BnevoBrand: React.FC<{ className?: string; width?: number }> = ({
  className = '',
  width = 280,
}) => {
  return (
    <picture className={`block max-w-full ${className}`} style={{ width }}>
      <source
        srcSet="/images/LOGO_CLAIR.png"
        media="(prefers-color-scheme: dark)"
      />
      <img
        src="/images/LOGO_SOMBRE.png"
        alt="BNEVO"
        className="block h-auto w-full"
      />
    </picture>
  );
};
