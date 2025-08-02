import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Lock, CreditCard, AlertTriangle, Clock } from 'lucide-react';
import { CardInputModal } from './CardInputModal';
import { toast } from 'sonner@2.0.3';

interface SubscriptionGuardProps {
  children: React.ReactNode;
  hasActiveSubscription: boolean;
  subscription: {
    status: string;
    days_remaining?: number;
    trial_end?: string;
    current_period_end?: string;
    is_expired?: boolean;
  } | null;
  userProfile: {
    has_used_trial?: boolean;
    [key: string]: any;
  } | null;
  onStartTrial: (cardDetails: any) => void;
  isLoading?: boolean;
  feature?: string;
}

export function SubscriptionGuard({ 
  children, 
  hasActiveSubscription, 
  subscription, 
  userProfile, 
  onStartTrial,
  isLoading = false,
  feature = 'this feature'
}: SubscriptionGuardProps) {
  const [showCardModal, setShowCardModal] = useState(false);

  // If user has active subscription, show content
  if (hasActiveSubscription && subscription && ['trial', 'active'].includes(subscription.status) && !subscription.is_expired) {
    return <>{children}</>;
  }

  const handleStartTrial = async (cardDetails: any) => {
    try {
      await onStartTrial(cardDetails);
      setShowCardModal(false);
    } catch (error) {
      // Error handling is done in the parent component
    }
  };

  const handleSubscribe = () => {
    // Redirect to Revolut payment link
    window.open('https://checkout.revolut.com/pay/6a73c06d-9231-48cd-ab2e-813d21000903', '_blank');
    toast.info('Redirected to subscription page');
  };

  // Trial expired message
  if (subscription?.status === 'trial' && subscription.is_expired) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
            <CardTitle className="text-orange-800 dark:text-orange-200">Trial Expired</CardTitle>
            <CardDescription className="text-orange-700 dark:text-orange-300">
              Your 2-day free trial has ended. Subscribe to continue using all features.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-orange-200 bg-orange-100 dark:border-orange-800 dark:bg-orange-900">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800 dark:text-orange-200">
                Your trial ended on {subscription.trial_end ? new Date(subscription.trial_end).toLocaleDateString() : 'recently'}. 
                Subscribe now to regain access to {feature}.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <Button 
                onClick={handleSubscribe}
                className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                disabled={isLoading}
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Subscribe for £6.99/month
              </Button>
              
              <p className="text-xs text-center text-orange-700 dark:text-orange-300">
                Secure payment via Revolut • Cancel anytime
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // No subscription - show trial or subscribe options
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <CardTitle>Subscription Required</CardTitle>
          <CardDescription>
            {feature === 'this feature' 
              ? 'A subscription is required to access this feature'
              : `Access to ${feature} requires an active subscription`
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Free Trial Option */}
          {!userProfile?.has_used_trial && (
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-200 dark:border-green-800">
              <CardContent className="p-4">
                <div className="text-center space-y-3">
                  <h4 className="font-semibold text-green-800 dark:text-green-200">🎉 2-Day Free Trial Available</h4>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Experience all features with no commitment
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="bg-green-100 dark:bg-green-900 p-2 rounded">
                      <div className="font-medium text-green-800 dark:text-green-200">Full Access</div>
                    </div>
                    <div className="bg-green-100 dark:bg-green-900 p-2 rounded">
                      <div className="font-medium text-green-800 dark:text-green-200">48 Hours</div>
                    </div>
                    <div className="bg-green-100 dark:bg-green-900 p-2 rounded">
                      <div className="font-medium text-green-800 dark:text-green-200">No Risk</div>
                    </div>
                  </div>
                  <Button
                    onClick={() => setShowCardModal(true)}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    disabled={isLoading}
                  >
                    Start Free Trial
                  </Button>
                  <p className="text-xs text-green-700 dark:text-green-300">
                    Card required • No charge for 48 hours
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Monthly Subscription */}
          <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 border-blue-200 dark:border-blue-800">
            <CardContent className="p-4">
              <div className="text-center space-y-3">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200">Monthly Subscription</h4>
                <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">£6.99/month</div>
                <div className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
                  <div>✓ Full platform access</div>
                  <div>✓ All AI features</div>
                  <div>✓ Priority support</div>
                  <div>✓ Cancel anytime</div>
                </div>
                <Button
                  onClick={handleSubscribe}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                  disabled={isLoading}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Subscribe Now
                </Button>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  Secure payment via Revolut
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Trial Used Notice */}
          {userProfile?.has_used_trial && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                You've already used your free trial. Subscribe to continue accessing all features.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Card Input Modal for Free Trial */}
      <CardInputModal
        isOpen={showCardModal}
        onClose={() => setShowCardModal(false)}
        onStartTrial={handleStartTrial}
        isLoading={isLoading}
      />
    </div>
  );
}