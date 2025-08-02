import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import { Mail, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { VisaAPI } from "../utils/supabase/client";
import { toast } from "sonner@2.0.3";

interface EmailVerificationProps {
  email: string;
  onVerificationComplete: () => void;
  onResendEmail?: () => void; // Made optional since we handle resending internally
}

export function EmailVerification({ email, onVerificationComplete }: EmailVerificationProps) {
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Use Supabase OTP verification
      const result = await VisaAPI.verifyOtp(email, verificationCode, 'signup');
      
      if (result.session) {
        toast.success("Email verified successfully!");
        onVerificationComplete();
      } else {
        setError("Invalid verification code. Please check your email and try again.");
      }
    } catch (error: any) {
      console.error('Email verification error:', error);
      if (error.message?.includes('expired')) {
        setError("Verification code has expired. Please request a new one.");
      } else if (error.message?.includes('invalid')) {
        setError("Invalid verification code. Please check and try again.");
      } else {
        setError("Failed to verify email. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setError("");

    try {
      await VisaAPI.resendVerificationEmail(email);
      toast.success("Verification email sent! Please check your inbox.");
      
      // Start cooldown timer
      setResendCooldown(60);
      const timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
    } catch (error: any) {
      console.error('Resend email error:', error);
      const errorMessage = error.message || "Failed to resend verification email. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  const maskEmail = (email: string) => {
    const [username, domain] = email.split('@');
    const maskedUsername = username.slice(0, 2) + '***' + username.slice(-1);
    return `${maskedUsername}@${domain}`;
  };

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto animate-scale-in">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Mail className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle>Verify Your Email</CardTitle>
          <CardDescription>
            We've sent a 6-digit verification code to {maskEmail(email)}. Please check your email and enter the code below.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="verification-code">Verification Code</Label>
              <Input
                id="verification-code"
                type="text"
                placeholder="000000"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="text-center text-lg tracking-widest font-mono"
                maxLength={6}
                required
                autoComplete="one-time-code"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || verificationCode.length !== 6}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Verify Email
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Didn't receive the code?
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResend}
              disabled={isResending || resendCooldown > 0}
            >
              {isResending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : resendCooldown > 0 ? (
                `Resend in ${resendCooldown}s`
              ) : (
                "Resend Code"
              )}
            </Button>
          </div>

          <div className="mt-6 p-4 bg-accent/50 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium">Tips:</p>
                <ul className="mt-1 space-y-1 text-xs">
                  <li>• Check your spam/junk folder</li>
                  <li>• The code expires in 60 minutes</li>
                  <li>• Make sure {maskEmail(email)} is correct</li>
                  <li>• Enter the 6-digit code from your email</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}