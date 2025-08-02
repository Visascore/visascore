import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { CreditCard, Calendar, AlertTriangle, CheckCircle, ExternalLink, X } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Subscription {
  id: string;
  status: 'trial' | 'active' | 'canceled' | 'expired';
  plan: string;
  amount: number;
  currency: string;
  trial_start?: string;
  trial_end?: string;
  current_period_start?: string;
  current_period_end?: string;
  cancel_at_period_end?: boolean;
  is_expired?: boolean;
  days_remaining?: number;
  card_last_four?: string;
  card_brand?: string;
}

interface SubscriptionManagementProps {
  subscription: Subscription | null;
  onCancelSubscription: () => void;
  onUpdatePaymentMethod: () => void;
  onSubscribe: () => void;
  isLoading?: boolean;
}

export function SubscriptionManagement({ 
  subscription, 
  onCancelSubscription, 
  onUpdatePaymentMethod, 
  onSubscribe,
  isLoading = false 
}: SubscriptionManagementProps) {
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getStatusBadge = () => {
    if (!subscription) return null;

    switch (subscription.status) {
      case 'trial':
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            Free Trial
          </Badge>
        );
      case 'active':
        return subscription.cancel_at_period_end ? (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            Canceling
          </Badge>
        ) : (
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            Active
          </Badge>
        );
      case 'canceled':
        return (
          <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
            Canceled
          </Badge>
        );
      case 'expired':
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            Expired
          </Badge>
        );
      default:
        return null;
    }
  };

  const handleSubscribe = () => {
    // Redirect to Revolut payment link
    window.open('https://checkout.revolut.com/pay/6a73c06d-9231-48cd-ab2e-813d21000903', '_blank');
    onSubscribe();
  };

  const handleCancelSubscription = async () => {
    setIsCanceling(true);
    try {
      await onCancelSubscription();
      setShowCancelDialog(false);
      toast.success('Subscription canceled successfully');
    } catch (error) {
      toast.error('Failed to cancel subscription. Please try again.');
    } finally {
      setIsCanceling(false);
    }
  };

  // No subscription - show subscription options
  if (!subscription || subscription.status === 'expired') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5" />
            <span>Subscription</span>
          </CardTitle>
          <CardDescription>
            Choose a plan to access all platform features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Subscription Plans */}
          <div className="space-y-4">
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-200 dark:border-green-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-green-800 dark:text-green-200">2-Day Free Trial</h4>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Full access to all features • Card required • No charge for 48 hours
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-800 dark:text-green-200">Free</div>
                    <div className="text-sm text-green-600 dark:text-green-400">2 days</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 border-blue-200 dark:border-blue-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-blue-800 dark:text-blue-200">Monthly Subscription</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Full platform access • Cancel anytime • Auto-renewal
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">£6.99</div>
                    <div className="text-sm text-blue-600 dark:text-blue-400">per month</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Button 
            onClick={handleSubscribe}
            className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            disabled={isLoading}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Subscribe Now - £6.99/month
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Secure payment processed by Revolut • Cancel anytime
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5" />
            <span>Subscription</span>
          </div>
          {getStatusBadge()}
        </CardTitle>
        <CardDescription>
          Manage your subscription and billing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Subscription Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium">Plan</h4>
            <p className="text-sm text-muted-foreground">
              {subscription.plan} - £{subscription.amount.toFixed(2)}/{subscription.plan.toLowerCase().includes('monthly') ? 'month' : 'year'}
            </p>
          </div>

          {subscription.card_last_four && (
            <div className="space-y-2">
              <h4 className="font-medium">Payment Method</h4>
              <p className="text-sm text-muted-foreground">
                {subscription.card_brand} ending in {subscription.card_last_four}
              </p>
            </div>
          )}

          {subscription.status === 'trial' && subscription.trial_end && (
            <div className="space-y-2">
              <h4 className="font-medium">Trial Period</h4>
              <p className="text-sm text-muted-foreground">
                Ends {formatDate(subscription.trial_end)}
                {subscription.days_remaining !== undefined && (
                  <span className="ml-2 font-medium">
                    ({subscription.days_remaining} days left)
                  </span>
                )}
              </p>
            </div>
          )}

          {subscription.status === 'active' && subscription.current_period_end && (
            <div className="space-y-2">
              <h4 className="font-medium">Next Billing</h4>
              <p className="text-sm text-muted-foreground">
                {subscription.cancel_at_period_end 
                  ? `Expires ${formatDate(subscription.current_period_end)}`
                  : `Renews ${formatDate(subscription.current_period_end)}`
                }
              </p>
            </div>
          )}
        </div>

        {/* Status-specific alerts */}
        {subscription.status === 'trial' && subscription.days_remaining !== undefined && subscription.days_remaining <= 1 && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Your free trial expires in {subscription.days_remaining} day{subscription.days_remaining !== 1 ? 's' : ''}. 
              Subscribe now to continue accessing all features.
            </AlertDescription>
          </Alert>
        )}

        {subscription.cancel_at_period_end && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Your subscription is set to cancel on {formatDate(subscription.current_period_end!)}. 
              You'll continue to have access until then.
            </AlertDescription>
          </Alert>
        )}

        {subscription.status === 'active' && !subscription.cancel_at_period_end && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Your subscription is active and will automatically renew on {formatDate(subscription.current_period_end!)}.
            </AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {subscription.status === 'trial' && (
            <Button 
              onClick={handleSubscribe}
              className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              disabled={isLoading}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Subscribe Now
            </Button>
          )}

          {subscription.card_last_four && (
            <Button 
              variant="outline" 
              onClick={onUpdatePaymentMethod}
              disabled={isLoading}
              className="flex-1"
            >
              Update Payment Method
            </Button>
          )}

          {subscription.status === 'active' && !subscription.cancel_at_period_end && (
            <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="flex-1 text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-950"
                >
                  Cancel Subscription
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <span>Cancel Subscription</span>
                  </DialogTitle>
                  <DialogDescription>
                    Are you sure you want to cancel your subscription? You'll continue to have access until your current billing period ends.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>What happens when you cancel:</strong>
                      <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                        <li>You'll keep access until {formatDate(subscription.current_period_end!)}</li>
                        <li>No more charges will be made</li>
                        <li>You can resubscribe anytime</li>
                        <li>Your data and progress will be saved</li>
                      </ul>
                    </AlertDescription>
                  </Alert>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setShowCancelDialog(false)}
                      className="flex-1"
                      disabled={isCanceling}
                    >
                      Keep Subscription
                    </Button>
                    <Button
                      onClick={handleCancelSubscription}
                      variant="destructive"
                      className="flex-1"
                      disabled={isCanceling}
                    >
                      {isCanceling ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Canceling...
                        </>
                      ) : (
                        <>
                          <X className="w-4 h-4 mr-2" />
                          Yes, Cancel Subscription
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Billing History Link */}
        <div className="pt-4 border-t">
          <Button 
            variant="ghost" 
            className="w-full text-left justify-start"
            onClick={() => window.open('https://checkout.revolut.com/pay/6a73c06d-9231-48cd-ab2e-813d21000903', '_blank')}
          >
            <Calendar className="w-4 h-4 mr-2" />
            View Payment History
            <ExternalLink className="w-4 h-4 ml-auto" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}