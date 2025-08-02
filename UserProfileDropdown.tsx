import { useState } from 'react';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Avatar, AvatarFallback } from './ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { User, LogOut, Settings, UserIcon, Shield } from 'lucide-react';

interface User {
  id: string;
  email: string;
  user_metadata?: {
    name?: string;
  };
}

interface UserProfile {
  name: string;
  email: string;
  completed_onboarding: boolean;
  [key: string]: any;
}

interface UserProfileDropdownProps {
  user: User | null;
  userProfile: UserProfile | null;
  onSignOut: () => void;
  navigate?: (path: string) => void;
}

export function UserProfileDropdown({ user, userProfile, onSignOut, navigate }: UserProfileDropdownProps) {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);
  const displayName = userProfile?.name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';
  const displayEmail = userProfile?.email || user?.email || '';

  // Check if user is admin
  const isAdmin = user && (
    user.email === 'admin@visascore.com' || 
    user.user_metadata?.role === 'admin' ||
    user.email?.endsWith('@visascore.com')
  );

  const handleSignOutClick = async () => {
    if (isSigningOut) {
      console.log('Sign out already in progress, ignoring click');
      return;
    }
    
    console.log('🔄 Sign out initiated from user dropdown');
    setIsSigningOut(true);
    setShowSignOutDialog(false);
    
    try {
      // Close the dropdown immediately to prevent multiple clicks
      document.body.click();
      
      // Call the sign out function
      await onSignOut();
      
      console.log('✅ Sign out completed from dropdown');
    } catch (error) {
      console.error('❌ Sign out error in dropdown:', error);
      // The error is already handled in useAuth, so we just log here
    } finally {
      // Note: We don't set isSigningOut to false here because the component
      // will be unmounted after successful sign out due to redirect
      // Only set it to false if we're still mounted (error case)
      setTimeout(() => {
        setIsSigningOut(false);
      }, 2000);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/10 text-primary">
              {getInitials(displayName)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {displayEmail}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => {
          if (navigate) {
            navigate('/dashboard');
          } else {
            window.history.pushState(null, '', '/dashboard');
            window.dispatchEvent(new PopStateEvent('popstate'));
          }
        }}>
          <UserIcon className="mr-2 h-4 w-4" />
          <span>Dashboard</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => {
          if (navigate) {
            navigate('/profile');
          } else {
            window.history.pushState(null, '', '/profile');
            window.dispatchEvent(new PopStateEvent('popstate'));
          }
        }}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Profile & Settings</span>
        </DropdownMenuItem>
        
        {/* Admin Panel Access */}
        {isAdmin && (
          <DropdownMenuItem onClick={() => {
            if (navigate) {
              navigate('/admin');
            } else {
              window.history.pushState(null, '', '/admin');
              window.dispatchEvent(new PopStateEvent('popstate'));
            }
          }} className="text-amber-600 focus:text-amber-600">
            <Shield className="mr-2 h-4 w-4" />
            <span>Admin Dashboard</span>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={() => {
            if (isSigningOut) {
              console.log('Sign out already in progress, ignoring click');
              return;
            }
            setShowSignOutDialog(true);
          }}
          className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950 hover:bg-red-50 dark:hover:bg-red-950"
          disabled={isSigningOut}
        >
          <LogOut className={`mr-2 h-4 w-4 ${isSigningOut ? 'animate-spin' : ''}`} />
          <span>
            {isSigningOut ? 'Signing out...' : 'Sign out'}
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

    {/* Sign Out Confirmation Dialog */}
    <AlertDialog open={showSignOutDialog} onOpenChange={setShowSignOutDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Sign out of Visa Score?</AlertDialogTitle>
          <AlertDialogDescription>
            You will be signed out of your account and redirected to the home page. 
            Any unsaved progress will be preserved in your profile.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSigningOut}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleSignOutClick}
            disabled={isSigningOut}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isSigningOut ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Signing out...</span>
              </div>
            ) : (
              'Sign out'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
}