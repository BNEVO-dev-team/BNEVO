import React, { useEffect } from 'react';
import { RouterProvider, useRouter } from './context/RouterContext';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { ToastContainer } from './components/common/ToastContainer';
import { ChatbotHelper } from './components/common/ChatbotHelper';

// Pages
import { WelcomePage } from './pages/WelcomePage';
import { AuthPage } from './pages/AuthPage';
import { OrgDashboardPage } from './pages/organisation/OrgDashboardPage';
import { OrgMissionsPage } from './pages/organisation/OrgMissionsPage';
import { OrgPlanningPage } from './pages/organisation/OrgPlanningPage';
import { OrgBenevolesPage } from './pages/organisation/OrgBenevolesPage';
import { OrgExportPage } from './pages/organisation/OrgExportPage';
import { OrgOffresPage } from './pages/organisation/OrgOffresPage';
import { BenevoleDashboardPage } from './pages/benevole/BenevoleDashboardPage';
import { BenevoleMissionsPage } from './pages/benevole/BenevoleMissionsPage';
import { BenevolePlanningPage } from './pages/benevole/BenevolePlanningPage';
import { BenevoleProfilePage } from './pages/benevole/BenevoleProfilePage';

const organizationRoutes = [
  '/organisation',
  '/organisation/dashboard',
  '/organisation/missions',
  '/organisation/planning',
  '/organisation/benevoles',
  '/organisation/export',
  '/organisation/offres',
];

const volunteerRoutes = [
  '/benevole',
  '/benevole/dashboard',
  '/benevole/missions',
  '/benevole/planning',
  '/benevole/profil',
];

export const isKnownRoute = (pathname: string) =>
  pathname === '/' ||
  pathname.startsWith('/connexion') ||
  pathname.startsWith('/login') ||
  organizationRoutes.includes(pathname) ||
  volunteerRoutes.includes(pathname);

interface AppContentProps {
  initialUrl?: string;
}

const PageRouter: React.FC = () => {
  const { pathname, replace } = useRouter();
  const { currentUser, isHydrated } = useApp();
  const requiresOrganization = organizationRoutes.includes(pathname);
  const requiresVolunteer = volunteerRoutes.includes(pathname);
  const requiredRole = requiresOrganization
    ? 'organisation'
    : requiresVolunteer
      ? 'benevole'
      : null;

  useEffect(() => {
    if (!requiredRole || !isHydrated) return;

    if (!currentUser || currentUser.role === 'guest') {
      replace(`/?role=${requiredRole}`);
    } else if (currentUser.role !== requiredRole) {
      replace(
        currentUser.role === 'organisation'
          ? '/organisation'
          : currentUser.role === 'benevole'
            ? '/benevole'
            : `/?role=${requiredRole}`
      );
    }
  }, [currentUser, isHydrated, replace, requiredRole]);

  if (
    requiredRole &&
    (!isHydrated || !currentUser || currentUser.role !== requiredRole)
  ) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm font-medium text-slate-500">Vérification de l’accès…</p>
      </div>
    );
  }

  // Route matching
  if (pathname === '/' || pathname === '') {
    return <WelcomePage />;
  }

  if (pathname.startsWith('/connexion') || pathname.startsWith('/login')) {
    return <AuthPage />;
  }

  // Organisation routes
  if (pathname === '/organisation' || pathname === '/organisation/dashboard') {
    return <OrgDashboardPage />;
  }
  if (pathname === '/organisation/missions') {
    return <OrgMissionsPage />;
  }
  if (pathname === '/organisation/planning') {
    return <OrgPlanningPage />;
  }
  if (pathname === '/organisation/benevoles') {
    return <OrgBenevolesPage />;
  }
  if (pathname === '/organisation/export') {
    return <OrgExportPage />;
  }
  if (pathname === '/organisation/offres') {
    return <OrgOffresPage />;
  }

  // Bénévole routes
  if (pathname === '/benevole' || pathname === '/benevole/dashboard') {
    return <BenevoleDashboardPage />;
  }
  if (pathname === '/benevole/missions') {
    return <BenevoleMissionsPage />;
  }
  if (pathname === '/benevole/planning') {
    return <BenevolePlanningPage />;
  }
  if (pathname === '/benevole/profil') {
    return <BenevoleProfilePage />;
  }

  return (
    <section className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
      <h1 className="text-3xl font-bold text-slate-900">Page introuvable</h1>
      <p className="mt-3 text-slate-600">Cette page n’existe pas ou a été déplacée.</p>
      <a href="/" className="mt-6 font-semibold text-emerald-700 hover:text-emerald-800">
        Retour à l’accueil
      </a>
    </section>
  );
};

const AppShell: React.FC = () => {
  const { pathname } = useRouter();
  const isWelcomePage = pathname === '/' || pathname === '';

  if (isWelcomePage) {
    return (
      <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900 relative">
        <main className="flex-1 flex flex-col">
          <WelcomePage />
        </main>
        <ToastContainer />
        <ChatbotHelper />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900 relative">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <PageRouter />
      </main>
      <ToastContainer />
      <ChatbotHelper />
    </div>
  );
};

export default function App({ initialUrl }: AppContentProps) {
  return (
    <RouterProvider initialUrl={initialUrl}>
      <AppProvider>
        <AppShell />
      </AppProvider>
    </RouterProvider>
  );
}
