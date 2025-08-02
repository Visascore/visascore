import { Router } from "./components/Router";
import { Toaster } from "./components/ui/sonner";
import { useAuth } from './hooks/useAuth';

export default function App() {
  const {
    authState,
    userProfile,
    handleSignIn,
    handleSignUp,
    handleSignOut,
    updateUserProfile,
    completeOnboarding,
    updateSettings,
    setUserProfile
  } = useAuth();

  // Show loading spinner while checking auth state
  if (authState.isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Router 
        authState={authState}
        userProfile={userProfile}
        onSignIn={handleSignIn}
        onSignUp={handleSignUp}
        onSignOut={handleSignOut}
        updateUserProfile={updateUserProfile}
        completeOnboarding={completeOnboarding}
        updateSettings={updateSettings}
        setUserProfile={setUserProfile}
      />
      <Toaster />
    </div>
  );
}