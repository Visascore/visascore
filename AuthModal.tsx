import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2, Eye, EyeOff, Mail, Lock, User, Calendar } from 'lucide-react';
import { createClient } from '../utils/supabase/client';
import { toast } from 'sonner@2.0.3';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  onSignUp: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  navigate?: (path: string) => void;
  initialMode?: 'signin' | 'signup';
  title?: string;
  subtitle?: string;
}

export function AuthModal({ 
  isOpen, 
  onClose, 
  onSignIn, 
  onSignUp, 
  navigate, 
  initialMode = 'signin',
  title,
  subtitle 
}: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);

  // Reset mode when modal opens/closes or initialMode changes
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setEmail('');
      setPassword('');
      setName('');
      setError('');
    }
  }, [isOpen, initialMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'signup') {
        const result = await onSignUp(email, password, name);
        if (result.success) {
          onClose();
          // Show success message
          toast.success('Account created successfully! Complete your profile to get started.');
          // Auto-redirect to onboarding after successful signup
          if (navigate) {
            setTimeout(() => navigate('/onboarding'), 500);
          }
        } else {
          // Handle email_exists error by switching to sign-in mode
          if ((result as any)?.code === 'email_exists' || result.error?.includes('already exists')) {
            setMode('signin');
            setName(''); // Clear name field
            setError('This email is already registered. Please sign in instead.');
            toast.info('This email is already registered. Please sign in instead.');
          } else {
            setError(result.error || 'Sign up failed');
          }
        }
      } else {
        const result = await onSignIn(email, password);
        if (result.success) {
          onClose();
          toast.success('Welcome back!');
        } else {
          setError(result.error || 'Sign in failed');
        }
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        throw error;
      }
      
      // OAuth will redirect, so we don't need to handle success here
    } catch (err: any) {
      console.error('Google sign in error:', err);
      setError(err.message || 'Failed to sign in with Google');
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            {title || (mode === 'signup' ? 'Create Your Account' : 'Welcome Back')}
          </DialogTitle>
          <DialogDescription className="text-center">
            {subtitle || (mode === 'signup' 
              ? 'Create your free account and build your personalized visa profile' 
              : 'Sign in to access your visa assessment and personalized guidance'
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Social Sign In */}
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">or</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={mode === 'signup' ? 'Create a strong password' : 'Enter your password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                  minLength={6}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {mode === 'signup' && (
                <p className="text-xs text-muted-foreground">
                  Password must be at least 6 characters long
                </p>
              )}
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-purple-600"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : mode === 'signup' ? (
                <Calendar className="w-4 h-4 mr-2" />
              ) : null}
              {mode === 'signup' ? 'Create Account & Continue' : 'Sign In'}
            </Button>
          </form>

          {/* Switch Mode */}
          <div className="text-center text-sm">
            {mode === 'signup' ? (
              <>
                Already have an account?{' '}
                <Button
                  variant="link"
                  className="p-0 h-auto font-semibold"
                  onClick={() => setMode('signin')}
                >
                  Sign in
                </Button>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <Button
                  variant="link"
                  className="p-0 h-auto font-semibold"
                  onClick={() => setMode('signup')}
                >
                  Start free trial
                </Button>
              </>
            )}
          </div>

          {mode === 'signup' && (
            <div className="text-xs text-muted-foreground text-center space-y-1">
              <p>By creating an account, you agree to our Terms of Service and Privacy Policy.</p>
              <p>✨ Completely free platform - no subscription required!</p>
              <p>📋 Complete your profile setup after signup for personalized guidance</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}