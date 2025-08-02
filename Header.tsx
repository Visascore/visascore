import { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AuthModal } from './AuthModal';
import { UserProfileDropdown } from './UserProfileDropdown';
import { VisaScoreLogo } from './VisaScoreLogo';
import { EscapeButton } from './EscapeButton';
import { Menu, X, Newspaper, Bell, Shield } from 'lucide-react';

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

interface UserProfileData {
  name: string;
  email: string;
  completed_onboarding: boolean;
  [key: string]: any;
}

interface HeaderProps {
  authState: AuthState;
  userProfile: UserProfileData | null;
  onSignIn?: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  onSignUp?: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  onSignOut: () => void;
  currentPath?: string;
  navigate: (path: string) => void;
}

export function Header({ 
  authState, 
  userProfile, 
  onSignIn, 
  onSignUp, 
  onSignOut, 
  currentPath = '/',
  navigate
}: HeaderProps) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  // Check if user is admin
  const isAdmin = authState.user && (
    authState.user.email === 'admin@visascore.com' || 
    authState.user.user_metadata?.role === 'admin' ||
    authState.user.email?.endsWith('@visascore.com')
  );

  const navigationItems = [
    {
      label: 'Visa Routes',
      path: '/visa-routes',
      description: 'Explore all UK visa options'
    },
    {
      label: 'AI Assistant',
      path: '/ai-assistant',
      description: 'Get personalized visa guidance'
    },
    {
      label: 'Dashboard',
      path: '/dashboard',
      description: 'Track your progress'
    }
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div 
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => handleNavigation('/')}
            >
              <VisaScoreLogo />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {navigationItems.map((item) => (
                <span
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className="cursor-pointer hover:text-primary transition-colors text-foreground"
                >
                  {item.label}
                </span>
              ))}
              
              {/* News Update Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleNavigation('/news')}
                className="bg-card/20 backdrop-blur-sm border-primary/30 hover:bg-card/40 relative group"
              >
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Newspaper className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  </div>
                  <span className="hidden lg:inline">News</span>
                  <Bell className="h-3 w-3 group-hover:rotate-12 transition-transform" />
                </div>
              </Button>

              {/* Admin Button */}
              {isAdmin && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleNavigation('/admin')}
                  className="bg-amber-500/10 backdrop-blur-sm border-amber-500/30 hover:bg-amber-500/20 relative group"
                >
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-amber-500 group-hover:scale-110 transition-transform" />
                    <span className="hidden lg:inline text-amber-500">Admin</span>
                  </div>
                </Button>
              )}
            </nav>

            {/* Desktop Auth Section */}
            <div className="hidden md:flex items-center space-x-3">
              {authState.isAuthenticated ? (
                <UserProfileDropdown
                  user={authState.user}
                  userProfile={userProfile}
                  onSignOut={onSignOut}
                  navigate={navigate}
                />
              ) : (
                <>
                  <span
                    onClick={() => {
                      setAuthModalMode('signin');
                      setShowAuthModal(true);
                    }}
                    className="cursor-pointer hover:text-primary transition-colors text-foreground"
                  >
                    Sign In
                  </span>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => {
                      setAuthModalMode('signup');
                      setShowAuthModal(true);
                    }}
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-sm">
              <div className="px-4 py-4 space-y-3">
                {navigationItems.map((item) => (
                  <div key={item.path}>
                    <div
                      onClick={() => handleNavigation(item.path)}
                      className="cursor-pointer hover:text-primary transition-colors text-foreground py-2"
                    >
                      {item.label}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.description}
                    </p>
                  </div>
                ))}
                
                {/* Mobile News Button */}
                <div>
                  <div
                    onClick={() => handleNavigation('/news')}
                    className="cursor-pointer hover:text-primary transition-colors text-foreground py-2 flex items-center space-x-2"
                  >
                    <div className="relative">
                      <Newspaper className="h-4 w-4" />
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    </div>
                    <span>Visa News</span>
                    <Bell className="h-3 w-3" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Latest visa updates and policy changes
                  </p>
                </div>

                {/* Mobile Admin Button */}
                {isAdmin && (
                  <div>
                    <div
                      onClick={() => handleNavigation('/admin')}
                      className="cursor-pointer hover:text-amber-500 transition-colors text-foreground py-2 flex items-center space-x-2"
                    >
                      <Shield className="h-4 w-4 text-amber-500" />
                      <span>Admin Dashboard</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Access admin panel and analytics
                    </p>
                  </div>
                )}

                <div className="pt-3 border-t border-border">
                  {authState.isAuthenticated ? (
                    <div className="space-y-3">
                      <div className="text-sm text-muted-foreground">
                        Signed in as {userProfile?.name || authState.user?.email}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={async () => {
                          if (isSigningOut) {
                            console.log('Sign out already in progress, ignoring mobile click');
                            return;
                          }
                          
                          console.log('🔄 Sign out initiated from mobile menu');
                          setIsSigningOut(true);
                          setIsMobileMenuOpen(false);
                          
                          try {
                            await onSignOut();
                            console.log('✅ Sign out completed from mobile menu');
                          } catch (error) {
                            console.error('❌ Sign out error in mobile menu:', error);
                          } finally {
                            // Similar to dropdown, we don't reset this immediately
                            // because the component will be unmounted after redirect
                            setTimeout(() => {
                              setIsSigningOut(false);
                            }, 2000);
                          }
                        }}
                        className="w-full text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-950"
                        disabled={isSigningOut}
                      >
                        {isSigningOut ? (
                          <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                            <span>Signing out...</span>
                          </div>
                        ) : (
                          'Sign Out'
                        )}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div
                        onClick={() => {
                          setAuthModalMode('signin');
                          setShowAuthModal(true);
                          setIsMobileMenuOpen(false);
                        }}
                        className="cursor-pointer hover:text-primary transition-colors text-foreground py-2"
                      >
                        Sign In
                      </div>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => {
                          setAuthModalMode('signup');
                          setShowAuthModal(true);
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full"
                      >
                        Get Started
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Auth Modal */}
      {showAuthModal && onSignIn && onSignUp && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSignIn={onSignIn}
          onSignUp={onSignUp}
          navigate={navigate}
          initialMode={authModalMode}
        />
      )}

      {/* Escape Button */}
      <EscapeButton />
    </>
  );
}