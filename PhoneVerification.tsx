import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { VisaAPI } from "../utils/supabase/client";
import { toast } from "sonner@2.0.3";

interface PhoneVerificationProps {
  phone: string;
  onVerificationComplete: () => void;
}

export function PhoneVerification({ phone, onVerificationComplete }: PhoneVerificationProps) {
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [canResend, setCanResend] = useState(false);

  // Countdown timer for resend button
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      toast.error("Please enter the verification code");
      return;
    }

    if (verificationCode.length !== 6) {
      toast.error("Verification code must be 6 digits");
      return;
    }

    setIsVerifying(true);
    try {
      // Try the new verification endpoint first
      try {
        await VisaAPI.verifyPhoneSignup(phone, verificationCode);
        toast.success("Phone verified successfully!");
        onVerificationComplete();
        return;
      } catch (signupError) {
        console.log('New verification failed, trying standard OTP verification:', signupError);
        // Fallback to standard OTP verification
        await VisaAPI.verifyPhoneOTP(phone, verificationCode);
        toast.success("Phone verified successfully!");
        onVerificationComplete();
      }
    } catch (error: any) {
      console.error('Phone verification error:', error);
      if (error.message?.includes('Invalid token') || error.message?.includes('expired')) {
        toast.error("Invalid or expired verification code. Please try again.");
      } else if (error.message?.includes('too many')) {
        toast.error("Too many attempts. Please wait before trying again.");
      } else {
        toast.error("Verification failed. Please check your code and try again.");
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    try {
      // Use sendPhoneOTP instead of resendPhoneOTP for better compatibility
      await VisaAPI.sendPhoneOTP(phone, false);
      toast.success("New verification code sent to your phone!");
      setTimeLeft(30);
      setCanResend(false);
      setVerificationCode('');
    } catch (error: any) {
      console.error('Resend phone OTP error:', error);
      if (error.message?.includes('rate limit') || error.message?.includes('too many')) {
        toast.error("Please wait before requesting another code.");
      } else {
        toast.error("Failed to resend verification code. Please try again.");
      }
    } finally {
      setIsResending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleVerifyCode();
    }
  };

  // Format phone number for display
  const formatPhone = (phone: string) => {
    if (phone.startsWith('+44')) {
      return phone.replace('+44', '+44 ') + ' (Hidden for security)';
    }
    return phone.slice(0, 3) + '****' + phone.slice(-3);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl">📱</span>
            </div>
          </div>
          <CardTitle>Verify Your Phone Number</CardTitle>
          <CardDescription className="space-y-2">
            <p>We've sent a 6-digit verification code to:</p>
            <Badge variant="outline" className="text-sm">
              {formatPhone(phone)}
            </Badge>
            <p className="text-sm">Enter the code below to continue</p>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="verification-code" className="text-sm font-medium">
              Verification Code
            </label>
            <Input
              id="verification-code"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="000000"
              value={verificationCode}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                setVerificationCode(value);
              }}
              onKeyPress={handleKeyPress}
              className="text-center text-lg tracking-widest"
              maxLength={6}
              autoComplete="one-time-code"
            />
            <p className="text-xs text-muted-foreground">
              Enter the 6-digit code sent to your phone
            </p>
          </div>

          <Button 
            onClick={handleVerifyCode}
            disabled={isVerifying || verificationCode.length !== 6}
            className="w-full"
            size="lg"
          >
            {isVerifying ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Verifying...
              </div>
            ) : (
              'Verify Phone Number'
            )}
          </Button>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Didn't receive the code?
            </span>
            {canResend ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResendCode}
                disabled={isResending}
                className="p-0 h-auto"
              >
                {isResending ? 'Sending...' : 'Resend Code'}
              </Button>
            ) : (
              <span className="text-muted-foreground">
                Resend in {timeLeft}s
              </span>
            )}
          </div>

          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h4 className="text-sm font-medium">Having trouble?</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Check that your phone can receive SMS messages</li>
              <li>• Make sure you entered the correct phone number</li>
              <li>• The code expires after 10 minutes</li>
              <li>• Check your spam/junk messages</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}