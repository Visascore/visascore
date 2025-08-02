import { useState, useEffect } from 'react';
import { HomePage } from '../pages/HomePage';
import { VisaRoutesPage } from '../pages/VisaRoutesPage';
import { VisaRouteDetailPage } from '../pages/VisaRouteDetailPage';
import { AIAssistantPage } from '../pages/AIAssistantPage';
import { DashboardPage } from '../pages/DashboardPage';
import { EligibilityResultsPage } from '../pages/EligibilityResultsPage';
import { EligibilityAssessmentPage } from '../pages/EligibilityAssessmentPage';
import { ActionPlanPage } from '../pages/ActionPlanPage';

import { EmailConfirmationPage } from '../pages/EmailConfirmationPage';
import { OnboardingFlow } from '../components/OnboardingFlow';
import { ProfilePage } from '../pages/ProfilePage';
import { VisaNewsPage } from '../pages/VisaNewsPage';
import { NewsDetailPage } from '../pages/NewsDetailPage';
import { AdminLoginPage } from '../pages/AdminLoginPage';
import { AdminDashboardPage } from '../pages/AdminDashboardPage';
import { AdminSetupPage } from '../pages/AdminSetupPage';

interface User {
  id: string;
  email: string;
  user_metadata?: {
    name?: string;
  };
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  session: any;
}

interface UserProfile {
  name: string;
  email: string;
  completed_onboarding: boolean;
  [key: string]: any;
}

interface RouterProps {
  authState: AuthState;
  userProfile: UserProfile | null;
  onSignIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  onSignUp: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  onSignOut: () => void;
  updateUserProfile?: (data: any) => Promise<any>;
  completeOnboarding?: (data: any) => Promise<any>;
  updateSettings?: (data: any) => Promise<any>;
  setUserProfile?: (profile: any) => void;
}

export function Router({ 
  authState, 
  userProfile, 
  onSignIn, 
  onSignUp, 
  onSignOut,
  updateUserProfile,
  completeOnboarding,
  updateSettings,
  setUserProfile
}: RouterProps) {
  const [currentPath, setCurrentPath] = useState('/');
  const [routeParams, setRouteParams] = useState<any>(null);
  const [adminAuth, setAdminAuth] = useState<any>(null);

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      setCurrentPath(path);
      parseRouteParams(path);
    };

    const parseRouteParams = (path: string) => {
      const visaRouteMatch = path.match(/^\/visa-routes\/(.+)$/);
      const newsDetailMatch = path.match(/^\/news\/(.+)$/);
      
      if (visaRouteMatch) {
        setRouteParams({ routeId: visaRouteMatch[1] });
      } else if (newsDetailMatch) {
        setRouteParams({ newsId: newsDetailMatch[1] });
      } else {
        setRouteParams(null);
      }
    };

    // Set initial path
    const initialPath = window.location.pathname;
    setCurrentPath(initialPath);
    parseRouteParams(initialPath);

    // Listen for browser navigation
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const navigate = (path: string, data?: any) => {
    console.log('=== ROUTER NAVIGATE CALLED ===');
    console.log('Path:', path);
    console.log('Data:', data);
    console.log('Current path before navigation:', currentPath);
    console.log('Current route params before navigation:', routeParams);
    console.log('Browser location before navigation:', window.location.pathname);
    
    if (path.startsWith('/')) {
      // Handle absolute paths
      console.log('Handling absolute path:', path);
      setCurrentPath(path);
      window.history.pushState(null, '', path);
      
      // Parse route params for new path
      const visaRouteMatch = path.match(/^\/visa-routes\/(.+)$/);
      const newsDetailMatch = path.match(/^\/news\/(.+)$/);
      
      if (visaRouteMatch) {
        console.log('Visa route match found:', visaRouteMatch[1]);
        setRouteParams({ routeId: visaRouteMatch[1] });
      } else if (newsDetailMatch) {
        console.log('News detail match found:', newsDetailMatch[1]);
        setRouteParams({ newsId: newsDetailMatch[1] });
      } else {
        console.log('No route match, clearing route params');
        setRouteParams(null);
      }
    } else {
      // Handle named routes
      let targetPath = '/';
      
      switch (path) {
        case 'home':
          targetPath = '/';
          break;
        case 'visa-routes':
          targetPath = '/visa-routes';
          break;
        case 'ai-assistant':
          targetPath = '/ai-assistant';
          break;
        case 'dashboard':
          targetPath = '/dashboard';
          break;
        case 'eligibility-assessment':
          targetPath = '/eligibility-assessment';
          break;
        case 'eligibility-results':
          targetPath = '/eligibility-results';
          break;
        case 'action-plan':
          targetPath = '/action-plan';
          break;
        case 'email-confirmation':
          targetPath = '/email-confirmation';
          break;
        case 'profile':
          targetPath = '/profile';
          break;
        case 'news':
          targetPath = '/news';
          break;
        case 'admin':
          targetPath = '/admin';
          break;
        case 'admin-login':
          targetPath = '/admin/login';
          break;
        case 'admin-setup':
          targetPath = '/admin/setup';
          break;
        default:
          targetPath = `/${path}`;
      }
      
      console.log('Navigating to target path:', targetPath);
      try {
        setCurrentPath(targetPath);
        window.history.pushState(null, '', targetPath);
        console.log('Navigation successful, updated browser path to:', targetPath);
        
        if (data) {
          console.log('Setting route params:', data);
          setRouteParams(data);
        }
      } catch (error) {
        console.error('Navigation error:', error);
        console.error('Failed to navigate to:', targetPath);
      }
    }
    
    console.log('Navigation completed. New current path:', path.startsWith('/') ? path : targetPath);
  };

  const handleAdminLogin = (adminData: any) => {
    setAdminAuth(adminData);
    navigate('/admin');
  };

  const handleAdminSignOut = () => {
    setAdminAuth(null);
    navigate('/');
  };

  // Route rendering logic
  const renderPage = () => {
    console.log('=== ROUTER RENDERPAGE CALLED ===');
    console.log('Current path:', currentPath);
    console.log('Route params:', routeParams);
    
    // Handle admin routes - skip onboarding for admin pages
    if (currentPath.startsWith('/admin')) {
      console.log('=== ADMIN ROUTE DETECTED ===');
      console.log('Admin route path:', currentPath);
      console.log('Skipping onboarding check for admin route');
      // Admin routes are handled in the switch statement below
    } else if (authState.isAuthenticated && userProfile && !userProfile.completed_onboarding && currentPath !== '/onboarding') {
      // Handle onboarding flow for authenticated users without completed onboarding
      console.log('Redirecting to onboarding flow');
      return (
        <div className="min-h-screen bg-background">
          <OnboardingFlow
            onComplete={(data) => {
              console.log('Onboarding completed:', data);
              // Navigate to visa routes after onboarding
              navigate('/visa-routes');
            }}
            onSkip={() => {
              console.log('Onboarding skipped');
              navigate('/visa-routes');
            }}
            completeOnboarding={completeOnboarding!}
          />
        </div>
      );
    }
    
    // Handle email confirmation
    if (currentPath === '/email-confirmation') {
      console.log('Rendering EmailConfirmationPage');
      return (
        <EmailConfirmationPage
          navigate={navigate}
        />
      );
    }

    // Handle visa route detail pages
    if (currentPath.startsWith('/visa-routes/') && routeParams?.routeId) {
      console.log('Rendering VisaRouteDetailPage for route:', routeParams.routeId);
      return (
        <VisaRouteDetailPage
          routeId={routeParams.routeId}
          authState={authState}
          userProfile={userProfile}
          navigate={navigate}
          onSignIn={onSignIn}
          onSignUp={onSignUp}
          onSignOut={onSignOut}
        />
      );
    }

    // Handle news detail pages
    if (currentPath.startsWith('/news/') && routeParams?.newsId) {
      console.log('Rendering NewsDetailPage for news:', routeParams.newsId);
      return (
        <NewsDetailPage
          newsId={routeParams.newsId}
          authState={authState}
          userProfile={userProfile}
          navigate={navigate}
        />
      );
    }

    // Handle other routes
    console.log('Checking switch statement for currentPath:', currentPath);
    switch (currentPath) {
      case '/onboarding':
        return (
          <div className="min-h-screen bg-background">
            <OnboardingFlow
              onComplete={(data) => {
                console.log('Onboarding completed:', data);
                // Navigate to visa routes after onboarding
                navigate('/visa-routes');
              }}
              onSkip={() => {
                console.log('Onboarding skipped');
                navigate('/visa-routes');
              }}
              completeOnboarding={completeOnboarding!}
            />
          </div>
        );
        
      case '/':
        return (
          <HomePage
            authState={authState}
            userProfile={userProfile}
            onSignIn={onSignIn}
            onSignUp={onSignUp}
            onSignOut={onSignOut}
            navigate={navigate}
          />
        );

      case '/visa-routes':
        return (
          <VisaRoutesPage
            authState={authState}
            userProfile={userProfile}
            navigate={navigate}
            onSignIn={onSignIn}
            onSignUp={onSignUp}
            onSignOut={onSignOut}
          />
        );

      case '/ai-assistant':
        return (
          <AIAssistantPage
            authState={authState}
            userProfile={userProfile}
            navigate={navigate}
            onSignIn={onSignIn}
            onSignUp={onSignUp}
            onSignOut={onSignOut}
          />
        );

      case '/eligibility-assessment':
        return (
          <EligibilityAssessmentPage
            authState={authState}
            userProfile={userProfile}
            navigate={navigate}
            onSignIn={onSignIn}
            onSignUp={onSignUp}
          />
        );

      case '/dashboard':
        return (
          <DashboardPage
            authState={authState}
            userProfile={userProfile}
            navigate={navigate}
            onSignIn={onSignIn}
            onSignUp={onSignUp}
            onSignOut={onSignOut}
          />
        );

      case '/eligibility-results':
        return (
          <EligibilityResultsPage
            authState={authState}
            userProfile={userProfile}
            navigate={navigate}
          />
        );

      case '/action-plan':
        return (
          <ActionPlanPage
            authState={authState}
            navigate={navigate}
          />
        );

      case '/profile':
        return (
          <ProfilePage
            navigate={navigate}
            authState={authState}
            userProfile={userProfile}
            updateUserProfile={updateUserProfile}
            updateSettings={updateSettings}
          />
        );

      case '/news':
        return (
          <VisaNewsPage
            authState={authState}
            userProfile={userProfile}
            onSignIn={onSignIn}
            onSignUp={onSignUp}
            onSignOut={onSignOut}
            navigate={navigate}
          />
        );

      case '/admin/setup':
        return (
          <AdminSetupPage />
        );

      case '/admin/login':
        return (
          <AdminLoginPage
            onAdminLogin={handleAdminLogin}
            onBackToHome={() => navigate('/')}
          />
        );

      case '/admin':
        console.log('=== ADMIN ROUTE ACCESS ===');
        console.log('Current admin auth state:', adminAuth);
        console.log('Checking admin authentication...');
        
        if (!adminAuth) {
          console.log('No admin auth found, redirecting to admin login');
          navigate('/admin/login');
          return null;
        }
        
        console.log('Admin authenticated, rendering dashboard');
        return (
          <AdminDashboardPage
            adminAuth={adminAuth}
            onSignOut={handleAdminSignOut}
          />
        );

      default:
        // Check if it's an unhandled admin route
        if (currentPath.startsWith('/admin')) {
          console.log('=== UNHANDLED ADMIN ROUTE ===');
          console.log('Unknown admin path:', currentPath);
          // Redirect unknown admin routes to admin login
          navigate('/admin/login');
          return null;
        }
        // Redirect unknown routes to home page
        console.log('Unknown route, redirecting to home:', currentPath);
        navigate('/');
        return (
          <HomePage
            authState={authState}
            userProfile={userProfile}
            onSignIn={onSignIn}
            onSignUp={onSignUp}
            onSignOut={onSignOut}
            navigate={navigate}
          />
        );
    }
  };

  return renderPage();
}