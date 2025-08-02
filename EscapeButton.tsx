import { ArrowLeft, X, Home } from 'lucide-react';
import { Button } from './ui/button';

interface EscapeButtonProps {
  onClick?: () => void;
  variant?: 'back' | 'close' | 'home';
  className?: string;
}

export function EscapeButton({ 
  onClick, 
  variant = 'back', 
  className = '' 
}: EscapeButtonProps) {
  const handleEscape = () => {
    if (onClick) {
      onClick();
    } else {
      // Default behavior: try to go back in history, if not possible go to home
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = '/';
      }
    }
  };

  const getIcon = () => {
    switch (variant) {
      case 'close':
        return <X className="h-4 w-4" />;
      case 'home':
        return <Home className="h-4 w-4" />;
      case 'back':
      default:
        return <ArrowLeft className="h-4 w-4" />;
    }
  };

  const getAriaLabel = () => {
    switch (variant) {
      case 'close':
        return 'Close';
      case 'home':
        return 'Go to home';
      case 'back':
      default:
        return 'Go back';
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleEscape}
      className={`mobile-back-button fixed top-4 left-4 z-50 bg-background/80 backdrop-blur-md border border-border/50 hover:bg-accent/80 transition-all duration-200 touch-target ${className}`}
      aria-label={getAriaLabel()}
    >
      {getIcon()}
      <span className="sr-only">{getAriaLabel()}</span>
    </Button>
  );
}