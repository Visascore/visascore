import { useState } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { CheckCircle, Crown, Sparkles, Rocket, Star, Zap, Bot, MapPin, Target, Newspaper, Bell } from 'lucide-react';
import { AuthModal } from '../AuthModal';
import { stats } from '../../data/homePageData';

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

interface HeroSectionProps {
  authState: AuthState;
  userProfile: UserProfile | null;
  onSignIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  onSignUp: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  navigate: (path: string) => void;
}

export function HeroSection({
  authState,
  userProfile,
  onSignIn,
  onSignUp,
  navigate
}: HeroSectionProps) {
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleExploreOptions = () => {
    if (authState.isAuthenticated && authState.user) {
      // User is authenticated, navigate to visa routes
      if (userProfile?.completed_onboarding) {
        navigate('/visa-routes');
      } else {
        // If user hasn't completed onboarding, take them there first
        navigate('/onboarding');
      }
    } else {
      // User is not authenticated, show auth modal
      setShowAuthModal(true);
    }
  };

  const handleAuthModalClose = () => {
    setShowAuthModal(false);
  };

  // Handle successful authentication
  const handleSignInSuccess = async (email: string, password: string) => {
    const result = await onSignIn(email, password);
    if (result.success) {
      setShowAuthModal(false);
      // Navigate to appropriate destination after successful sign in
      if (userProfile?.completed_onboarding) {
        navigate('/visa-routes');
      } else {
        navigate('/onboarding');
      }
    }
    return result;
  };

  const handleSignUpSuccess = async (email: string, password: string, name: string) => {
    const result = await onSignUp(email, password, name);
    if (result.success) {
      setShowAuthModal(false);
      // Navigate to onboarding after successful sign up
      navigate('/onboarding');
    }
    return result;
  };

  return (
    <>
      <section className="relative overflow-hidden">
        {/* Gaming Background with Grid */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/10"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div 
            className="absolute inset-0" 
            style={{
              backgroundImage: 'linear-gradient(to right, hsl(var(--primary)) 0.5px, transparent 0.5px), linear-gradient(to bottom, hsl(var(--primary)) 0.5px, transparent 0.5px)',
              backgroundSize: '40px 40px'
            }}
          ></div>
        </div>
        
        {/* Gaming Orbs and Particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-32 h-32 bg-primary/20 rounded-full blur-2xl animate-gaming-pulse"></div>
          <div className="absolute bottom-32 left-32 w-24 h-24 bg-secondary/20 rounded-full blur-xl animate-gaming-float"></div>
          <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-accent/30 rounded-full blur-lg animate-gaming-float-delay"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 mobile-container h-full">
          <div className="grid lg:grid-cols-2 gap-8 items-center py-8 lg:py-16">
            
            {/* Left Content Panel */}
            <div className="space-y-6 lg:pr-8 text-left">

              {/* Gaming Title */}
              <div className="space-y-4">
                <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-tight">
                  <span className="block text-foreground font-bold">FIND THE UK VISA</span>
                  <span className="block bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent font-bold">
                    ROUTE THAT SUITS YOUR
                  </span>
                  <span className="block bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent font-bold">
                    UNIQUE SITUATION
                  </span>
                </h1>
              </div>

              {/* Gaming Description */}
              <div className="max-w-lg">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Get accurate eligibility assessments for all UK visa routes with AI-powered guidance, 
                  personalized action plans, and real UKVI requirements analysis.
                </p>
              </div>

              {/* Gaming Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-start">
                <Button 
                  size="lg" 
                  className="h-16 px-12 text-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 mobile-button touch-target mobile-tap relative overflow-hidden group shadow-2xl shadow-primary/30 rounded-xl border border-primary/20"
                  onClick={handleExploreOptions}
                  disabled={authState.isLoading}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <span className="relative z-10 font-semibold">
                    {authState.isAuthenticated ? 'EXPLORE YOUR OPTIONS' : 'START YOUR JOURNEY'}
                  </span>
                  <Rocket className="ml-3 h-5 w-5 relative z-10 group-hover:translate-x-2 transition-transform" />
                </Button>

                <Button 
                  size="lg" 
                  variant="outline"
                  className="h-16 px-8 text-lg bg-card/20 backdrop-blur-sm border-primary/30 hover:bg-card/40 mobile-button touch-target mobile-tap relative overflow-hidden group shadow-xl rounded-xl"
                  onClick={() => navigate('/news')}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Newspaper className="h-5 w-5 group-hover:scale-110 transition-transform" />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    </div>
                    <span className="font-semibold">LATEST NEWS</span>
                    <Bell className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                  </div>
                </Button>
              </div>

              {/* Free Platform Badge */}
              <div className="flex items-center space-x-2 pt-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-muted-foreground">
                  {authState.isAuthenticated 
                    ? 'Welcome back! All features are unlocked' 
                    : '100% Free Platform • No Subscription Required'
                  }
                </span>
              </div>

              {/* DEBUG: Admin Route Test Button */}
              <div className="pt-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  className="text-xs text-muted-foreground border-muted-foreground/30 bg-card/10"
                  onClick={() => {
                    console.log('=== DEBUG: Admin Route Navigation Test ===');
                    console.log('Current browser path:', window.location.pathname);
                    console.log('Attempting to navigate to /admin');
                    navigate('/admin');
                  }}
                >
                  DEBUG: Test Admin Route
                </Button>
              </div>

              {/* Gaming Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-left group">
                    <div className="relative mb-2">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-card/20 backdrop-blur-sm rounded-xl border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <stat.icon className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                      </div>
                    </div>
                    <div className="text-lg md:text-2xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</div>
                  </div>
                ))}
              </div>

            </div>

            {/* Right Visual Panel */}
            <div className="relative lg:pl-8">
              {/* Glass Panel Background */}
              <div className="relative">
                <div className="absolute inset-0 bg-card/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl transform rotate-3 -translate-y-30"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 rounded-3xl transform -rotate-1"></div>
                
                {/* Content */}
                <div className="relative bg-card/20 backdrop-blur-xl rounded-3xl border border-white/30 p-8 shadow-2xl -translate-y-24">
                  {/* Mock Dashboard Preview */}
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/80 rounded-xl flex items-center justify-center">
                          <Bot className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-foreground">AI Visa Assistant</div>
                          <div className="text-xs text-muted-foreground">
                            {authState.isAuthenticated ? 'Ready to help' : 'Awaiting sign in'}
                          </div>
                        </div>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${authState.isAuthenticated ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></div>
                    </div>

                    {/* Preview Content Based on Auth State */}
                    <div className="space-y-3">
                      {authState.isAuthenticated ? (
                        <>
                          <div className="bg-primary/10 rounded-lg p-3">
                            <div className="text-xs text-primary font-semibold">
                              Welcome back, {userProfile?.name || 'User'}!
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              Ready to continue your visa journey?
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="bg-card/30 rounded-lg p-3">
                            <div className="text-xs text-foreground">
                              🚀 Get started with your personalized visa assessment
                            </div>
                          </div>
                          <div className="bg-card/30 rounded-lg p-3">
                            <div className="text-xs text-muted-foreground">
                              ✨ Sign in to unlock AI-powered guidance
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-2 gap-3">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="bg-card/30 backdrop-blur-sm border border-white/20 hover:bg-card/50 text-xs"
                        onClick={() => authState.isAuthenticated ? navigate('/visa-routes') : setShowAuthModal(true)}
                      >
                        <MapPin className="mr-1 h-3 w-3" />
                        Visa Routes
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="bg-card/30 backdrop-blur-sm border border-white/20 hover:bg-card/50 text-xs relative"
                        onClick={() => navigate('/news')}
                      >
                        <div className="flex items-center">
                          <Newspaper className="mr-1 h-3 w-3" />
                          <span>News</span>
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        </div>
                      </Button>
                    </div>

                    {/* News Preview */}
                    <div className="mt-3 bg-card/20 rounded-lg p-2">
                      <div className="text-xs text-primary font-semibold mb-1 flex items-center">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse mr-1"></div>
                        BREAKING
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Skilled Worker visa salary threshold increases to £38,700
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-primary/30 backdrop-blur-sm rounded-xl border border-white/20 flex items-center justify-center animate-gaming-float">
                <Star className="h-5 w-5 text-primary" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-10 h-10 bg-secondary/30 backdrop-blur-sm rounded-xl border border-white/20 flex items-center justify-center animate-gaming-float-delay">
                <Zap className="h-4 w-4 text-secondary" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={handleAuthModalClose}
        onSignIn={handleSignInSuccess}
        onSignUp={handleSignUpSuccess}
        navigate={navigate}
        initialMode="signup"
        title="Start Your UK Visa Journey"
        subtitle="Create your free account to access AI-powered visa assessments, personalized guidance, and your step-by-step action plan"
      />
    </>
  );
}