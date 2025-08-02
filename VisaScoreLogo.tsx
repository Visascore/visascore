import { cn } from './ui/utils';

interface VisaScoreLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'compact' | 'icon-only';
  className?: string;
  onClick?: () => void;
  animated?: boolean;
}

export function VisaScoreLogo({ 
  size = 'md', 
  variant = 'default', 
  className,
  onClick,
  animated = true 
}: VisaScoreLogoProps) {
  const sizeClasses = {
    sm: {
      container: 'px-3 py-1.5',
      iconContainer: 'w-7 h-7',
      text: 'text-sm',
      subtitle: 'text-xs',
      elements: {
        main: 'w-3 h-3',
        accent: 'w-1.5 h-1.5',
        small: 'w-1 h-1'
      }
    },
    md: {
      container: 'px-4 py-2',
      iconContainer: 'w-9 h-9',
      text: 'text-lg',
      subtitle: 'text-xs',
      elements: {
        main: 'w-4 h-4',
        accent: 'w-2 h-2',
        small: 'w-1.5 h-1.5'
      }
    },
    lg: {
      container: 'px-6 py-3',
      iconContainer: 'w-12 h-12',
      text: 'text-xl',
      subtitle: 'text-sm',
      elements: {
        main: 'w-5 h-5',
        accent: 'w-2.5 h-2.5',
        small: 'w-2 h-2'
      }
    },
    xl: {
      container: 'px-8 py-4',
      iconContainer: 'w-16 h-16',
      text: 'text-2xl',
      subtitle: 'text-base',
      elements: {
        main: 'w-6 h-6',
        accent: 'w-3 h-3',
        small: 'w-2.5 h-2.5'
      }
    }
  };

  const sizes = sizeClasses[size];
  
  const LogoIcon = () => (
    <div className="relative">
      {/* Main geometric container */}
      <div className={cn(
        sizes.iconContainer,
        "relative bg-gradient-to-br from-primary/20 via-purple-500/10 to-blue-500/20 rounded-lg border border-primary/30 backdrop-blur-sm overflow-hidden",
        animated && "transition-all duration-500 group-hover:border-primary/50 group-hover:shadow-lg group-hover:shadow-primary/20"
      )}>
        {/* Central diamond/crystal element */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={cn(
            sizes.elements.main,
            "bg-gradient-to-br from-primary via-purple-400 to-blue-400 transform rotate-45 relative shadow-lg",
            animated && "transition-all duration-300 group-hover:rotate-[50deg] group-hover:scale-110"
          )}>
            {/* Inner highlight */}
            <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-white/60 rounded-full"></div>
          </div>
        </div>

        {/* Orbital elements */}
        <div className={cn(
          "absolute top-1 right-1",
          sizes.elements.accent,
          "bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full opacity-80",
          animated && "animate-ping"
        )}></div>
        
        <div className={cn(
          "absolute bottom-1 left-1",
          sizes.elements.accent,
          "bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-70",
          animated && "animate-pulse"
        )}></div>

        {/* Corner accents */}
        <div className={cn(
          "absolute top-0 left-0",
          sizes.elements.small,
          "bg-primary rounded-br-lg opacity-60"
        )}></div>
        
        <div className={cn(
          "absolute bottom-0 right-0",
          sizes.elements.small,
          "bg-secondary rounded-tl-lg opacity-60"
        )}></div>

        {/* Animated border lines */}
        {animated && (
          <>
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-secondary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-purple-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-blue-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </>
        )}

        {/* Floating particles */}
        {animated && (
          <>
            <div className="absolute top-1/4 right-1/4 w-0.5 h-0.5 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 animate-bounce transition-opacity duration-300" style={{ animationDelay: '0.2s' }}></div>
            <div className="absolute bottom-1/4 left-1/4 w-0.5 h-0.5 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 animate-bounce transition-opacity duration-300" style={{ animationDelay: '0.4s' }}></div>
            <div className="absolute top-1/2 left-1/3 w-0.5 h-0.5 bg-pink-400 rounded-full opacity-0 group-hover:opacity-100 animate-bounce transition-opacity duration-300" style={{ animationDelay: '0.6s' }}></div>
          </>
        )}
      </div>

      {/* Glow effect */}
      {animated && (
        <div className={cn(
          "absolute inset-0 rounded-lg bg-gradient-to-br from-primary/30 to-purple-500/30 opacity-0 group-hover:opacity-60 blur-md transition-all duration-500 -z-10",
          sizes.iconContainer
        )}></div>
      )}
    </div>
  );

  const LogoText = () => (
    <div className="flex flex-col items-start">
      {/* Main brand name with unique styling */}
      <div className="relative">
        <span className={cn(
          sizes.text,
          "font-bold relative z-10",
          animated ? "bg-gradient-to-r from-primary via-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent animate-gradient-text" : "text-primary"
        )}>
          Visa Score
        </span>
        
        {/* Underline accent */}
        <div className={cn(
          "absolute -bottom-0.5 left-0 h-0.5 bg-gradient-to-r from-primary to-purple-400 transition-all duration-300",
          animated ? "w-0 group-hover:w-full" : "w-full"
        )}></div>
        
        {/* Text glow effect */}
        {animated && (
          <span className={cn(
            sizes.text,
            "absolute inset-0 font-bold bg-gradient-to-r from-primary via-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent opacity-0 group-hover:opacity-30 blur-sm transition-opacity duration-300 -z-10"
          )}>
            Visa Score
          </span>
        )}
      </div>
      
      {variant !== 'compact' && (
        <div className="relative mt-0.5">
        
          
          {/* Subtitle particles */}
          {animated && (
            <>
              <div className="absolute -left-1 top-1/2 w-1 h-1 bg-primary/40 rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-300"></div>
              <div className="absolute -right-1 top-1/2 w-1 h-1 bg-secondary/40 rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-300" style={{ animationDelay: '0.5s' }}></div>
            </>
          )}
        </div>
      )}
    </div>
  );

  if (variant === 'icon-only') {
    return (
      <button
        onClick={onClick}
        className={cn(
          "group relative rounded-xl transition-all duration-300",
          animated && "hover:scale-105 active:scale-95",
          className
        )}
      >
        <LogoIcon />
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex items-center space-x-3 rounded-xl border border-transparent backdrop-blur-sm transition-all duration-300",
        "bg-gradient-to-r from-background/50 via-card/30 to-background/50",
        animated && [
          "hover:border-primary/20",
          "hover:bg-gradient-to-r hover:from-primary/5 hover:via-purple-500/5 hover:to-blue-500/5",
          "hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/10",
          "active:scale-[0.98]"
        ],
        sizes.container,
        className
      )}
    >
      <LogoIcon />
      {variant !== 'icon-only' && <LogoText />}
      
      {/* Background pattern */}
      {animated && (
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
        </div>
      )}
      
      {/* Additional corner effects for larger sizes */}
      {animated && size !== 'sm' && (
        <>
          <div className="absolute top-0 right-0 w-2 h-2 bg-gradient-to-br from-primary/30 to-transparent rounded-bl-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute bottom-0 left-0 w-2 h-2 bg-gradient-to-tr from-secondary/30 to-transparent rounded-tr-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </>
      )}
    </button>
  );
}