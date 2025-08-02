import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { CreditCard, Lock, Shield } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface CardInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartTrial: (cardDetails: CardDetails) => void;
  isLoading?: boolean;
}

interface CardDetails {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  billingAddress: {
    line1: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

export function CardInputModal({ isOpen, onClose, onStartTrial, isLoading = false }: CardInputModalProps) {
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: {
      line1: '',
      city: '',
      postalCode: '',
      country: 'United Kingdom'
    }
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const validateCard = () => {
    const newErrors: Record<string, string> = {};

    // Card number validation (basic Luhn algorithm would be better)
    const cardNumber = cardDetails.cardNumber.replace(/\s/g, '');
    if (!cardNumber || cardNumber.length < 13 || cardNumber.length > 19) {
      newErrors.cardNumber = 'Please enter a valid card number';
    }

    // Expiry validation
    if (!cardDetails.expiryDate || cardDetails.expiryDate.length !== 5) {
      newErrors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
    } else {
      const [month, year] = cardDetails.expiryDate.split('/');
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100;
      const currentMonth = currentDate.getMonth() + 1;
      
      if (parseInt(month) < 1 || parseInt(month) > 12) {
        newErrors.expiryDate = 'Invalid month';
      } else if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
        newErrors.expiryDate = 'Card has expired';
      }
    }

    // CVV validation
    if (!cardDetails.cvv || cardDetails.cvv.length < 3 || cardDetails.cvv.length > 4) {
      newErrors.cvv = 'Please enter a valid CVV';
    }

    // Cardholder name validation
    if (!cardDetails.cardholderName.trim()) {
      newErrors.cardholderName = 'Please enter the cardholder name';
    }

    // Billing address validation
    if (!cardDetails.billingAddress.line1.trim()) {
      newErrors.line1 = 'Please enter your address';
    }
    if (!cardDetails.billingAddress.city.trim()) {
      newErrors.city = 'Please enter your city';
    }
    if (!cardDetails.billingAddress.postalCode.trim()) {
      newErrors.postalCode = 'Please enter your postal code';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateCard()) {
      toast.error('Please correct the errors and try again');
      return;
    }

    onStartTrial(cardDetails);
  };

  const handleInputChange = (field: keyof CardDetails | keyof CardDetails['billingAddress'], value: string) => {
    if (field in cardDetails.billingAddress) {
      setCardDetails(prev => ({
        ...prev,
        billingAddress: {
          ...prev.billingAddress,
          [field]: value
        }
      }));
    } else {
      let processedValue = value;
      
      if (field === 'cardNumber') {
        processedValue = formatCardNumber(value);
      } else if (field === 'expiryDate') {
        processedValue = formatExpiryDate(value);
      } else if (field === 'cvv') {
        processedValue = value.replace(/\D/g, '').substring(0, 4);
      }
      
      setCardDetails(prev => ({
        ...prev,
        [field]: processedValue
      }));
    }

    // Clear error when user starts typing
    if (errors[field as string]) {
      setErrors(prev => ({
        ...prev,
        [field as string]: ''
      }));
    }
  };

  const getCardType = (cardNumber: string) => {
    const number = cardNumber.replace(/\s/g, '');
    if (number.match(/^4/)) return 'Visa';
    if (number.match(/^5[1-5]/) || number.match(/^2[2-7]/)) return 'Mastercard';
    if (number.match(/^3[47]/)) return 'American Express';
    return '';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5 text-primary" />
            <span>Start Your 2-Day Free Trial</span>
          </DialogTitle>
          <DialogDescription>
            Enter your payment details to start your free trial. You won't be charged until the trial period ends.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Trial Information */}
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-200 dark:border-green-800">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-green-800 dark:text-green-200">2-Day Free Trial</h4>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Full access to all features • No charge for 48 hours • Cancel anytime
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Card Details Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Payment Information</CardTitle>
                <CardDescription>Your card details are secured and encrypted</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Card Number */}
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <div className="relative">
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardDetails.cardNumber}
                      onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                      maxLength={19}
                      className={errors.cardNumber ? 'border-red-500' : ''}
                    />
                    {getCardType(cardDetails.cardNumber) && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                        {getCardType(cardDetails.cardNumber)}
                      </div>
                    )}
                  </div>
                  {errors.cardNumber && (
                    <p className="text-sm text-red-500">{errors.cardNumber}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Expiry Date */}
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      placeholder="MM/YY"
                      value={cardDetails.expiryDate}
                      onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                      maxLength={5}
                      className={errors.expiryDate ? 'border-red-500' : ''}
                    />
                    {errors.expiryDate && (
                      <p className="text-sm text-red-500">{errors.expiryDate}</p>
                    )}
                  </div>

                  {/* CVV */}
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      type="password"
                      value={cardDetails.cvv}
                      onChange={(e) => handleInputChange('cvv', e.target.value)}
                      maxLength={4}
                      className={errors.cvv ? 'border-red-500' : ''}
                    />
                    {errors.cvv && (
                      <p className="text-sm text-red-500">{errors.cvv}</p>
                    )}
                  </div>
                </div>

                {/* Cardholder Name */}
                <div className="space-y-2">
                  <Label htmlFor="cardholderName">Cardholder Name</Label>
                  <Input
                    id="cardholderName"
                    placeholder="John Doe"
                    value={cardDetails.cardholderName}
                    onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                    className={errors.cardholderName ? 'border-red-500' : ''}
                  />
                  {errors.cardholderName && (
                    <p className="text-sm text-red-500">{errors.cardholderName}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Billing Address Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Billing Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="line1">Address Line 1</Label>
                  <Input
                    id="line1"
                    placeholder="123 Main Street"
                    value={cardDetails.billingAddress.line1}
                    onChange={(e) => handleInputChange('line1', e.target.value)}
                    className={errors.line1 ? 'border-red-500' : ''}
                  />
                  {errors.line1 && (
                    <p className="text-sm text-red-500">{errors.line1}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="London"
                      value={cardDetails.billingAddress.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className={errors.city ? 'border-red-500' : ''}
                    />
                    {errors.city && (
                      <p className="text-sm text-red-500">{errors.city}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      placeholder="SW1A 1AA"
                      value={cardDetails.billingAddress.postalCode}
                      onChange={(e) => handleInputChange('postalCode', e.target.value)}
                      className={errors.postalCode ? 'border-red-500' : ''}
                    />
                    {errors.postalCode && (
                      <p className="text-sm text-red-500">{errors.postalCode}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={cardDetails.billingAddress.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Security Notice */}
            <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Lock className="w-5 h-5 text-blue-600" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-800 dark:text-blue-200">Your payment is secure</p>
                    <p className="text-blue-700 dark:text-blue-300">
                      All payment data is encrypted and processed securely. We never store your full card details.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="w-full sm:w-auto"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="w-full sm:flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Starting Trial...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    Start 2-Day Free Trial
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}