import React, { createContext, useContext, ReactNode } from 'react';

interface RouterContextType {
  pathname: string;
  search: string;
  push: (url: string) => void;
  replace: (url: string) => void;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

interface RouterProviderProps {
  children: ReactNode;
  initialUrl?: string;
}

export const RouterProvider: React.FC<RouterProviderProps> = ({ children, initialUrl }) => {
  const initialLocation =
    typeof window !== 'undefined'
      ? { pathname: window.location.pathname || '/', search: window.location.search }
      : (() => {
          const url = (initialUrl || '/').split('#', 1)[0];
          const queryIndex = url.indexOf('?');
          return {
            pathname: queryIndex === -1 ? url : url.slice(0, queryIndex) || '/',
            search: queryIndex === -1 ? '' : url.slice(queryIndex),
          };
        })();
  const { pathname, search } = initialLocation;

  const push = (url: string) => {
    if (typeof window === 'undefined') {
      throw new Error('Navigation is only available in the browser');
    }
    window.location.assign(url);
  };

  const replace = (url: string) => {
    if (typeof window === 'undefined') {
      throw new Error('Navigation is only available in the browser');
    }
    window.location.replace(url);
  };

  return (
    <RouterContext.Provider value={{ pathname, search, push, replace }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = () => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
};

export const Link: React.FC<{
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  activeClassName?: string;
}> = ({ href, children, className = '', onClick, activeClassName = '' }) => {
  const { pathname } = useRouter();
  const isActive = pathname === href;

  const combinedClass = `${className} ${isActive ? activeClassName : ''}`.trim();

  return (
    <a href={href} onClick={onClick} className={combinedClass}>
      {children}
    </a>
  );
};
