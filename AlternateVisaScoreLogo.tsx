import { cn } from './ui/utils';

interface AlternateVisaScoreLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'compact' | 'icon-only' | 'minimal';
  className?: string;
  onClick?: () => void;
  animated?: boolean;
  style?: 'geometric' | 'circuit' | 'hexagon' | 'wave';
}

export function AlternateVisaScoreLogo({ 
  size = 'md', 
  variant = 'default',
  style = 'geometric',
  className,
  onClick,
  animated = true 
}: AlternateVisaScoreLogoProps) {
  const sizeClasses = {
    sm: {
      container: 'px-2 py-1',
      iconContainer: 'w-6 h-6',
      text: 'text-sm',
      subtitle: 'text-xs',
      strokeWidth: '1',
      fontSize: '6'
    },
    md: {
      container: 'px-3 py-1.5',
      iconContainer: 'w-8 h-8',
      text: 'text-base',
      subtitle: 'text-xs',
      strokeWidth: '1.5',
      fontSize: '8'
    },
    lg: {
      container: 'px-4 py-2',
      iconContainer: 'w-10 h-10',
      text: 'text-lg',
      subtitle: 'text-sm',
      strokeWidth: '2',
      fontSize: '10'
    },
    xl: {
      container: 'px-6 py-3',
      iconContainer: 'w-14 h-14',
      text: 'text-xl',
      subtitle: 'text-base',
      strokeWidth: '2.5',
      fontSize: '12'
    }
  };

  const sizes = sizeClasses[size];

  const GeometricIcon = () => (
    <div className={cn(
      sizes.iconContainer,
      "relative bg-gradient-to-br from-background to-primary/20 rounded-lg border-2 border-primary/40 overflow-hidden",
      animated && "transition-all duration-500 group-hover:border-primary group-hover:shadow-lg group-hover:shadow-primary/30"
    )}>
      {/* Main V shape */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 32 32">
        <defs>
          <linearGradient id="vGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--primary)" />
            <stop offset="50%" stopColor="var(--secondary)" />
            <stop offset="100%" stopColor="var(--primary)" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Outer V */}
        <path
          d="M8 6 L16 24 L24 6"
          stroke="url(#vGradient)"
          strokeWidth={sizes.strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={animated ? "url(#glow)" : undefined}
          className={animated ? "transition-all duration-300 group-hover:stroke-[3]" : ""}
        />
        
        {/* Inner accent */}
        <path
          d="M12 10 L16 20 L20 10"
          stroke="var(--accent)"
          strokeWidth="1"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.7"
          className={animated ? "transition-opacity duration-300 group-hover:opacity-100" : ""}
        />
        
        {/* Score indicators */}
        <circle cx="10" cy="8" r="1.5" fill="var(--primary)" opacity="0.8" 
          className={animated ? "animate-pulse" : ""} />
        <circle cx="22" cy="8" r="1.5" fill="var(--secondary)" opacity="0.8" 
          className={animated ? "animate-pulse" : ""} style={{ animationDelay: '0.5s' }} />
        <circle cx="16" cy="26" r="1.5" fill="var(--accent)" opacity="0.8" 
          className={animated ? "animate-pulse" : ""} style={{ animationDelay: '1s' }} />
      </svg>
      
      {/* Corner tech elements */}
      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-primary/60 rounded-tr"></div>
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-secondary/60 rounded-bl"></div>
    </div>
  );

  const CircuitIcon = () => (
    <div className={cn(
      sizes.iconContainer,
      "relative bg-gradient-to-br from-background to-primary/10 rounded-lg border border-primary/30 overflow-hidden",
      animated && "transition-all duration-500 group-hover:border-primary/60"
    )}>
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 32 32">
        <defs>
          <linearGradient id="circuitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--primary)" />
            <stop offset="100%" stopColor="var(--secondary)" />
          </linearGradient>
        </defs>
        
        {/* Circuit paths */}
        <path d="M4 8 L12 8 L16 16 L20 8 L28 8" stroke="url(#circuitGradient)" strokeWidth="1" fill="none" 
          className={animated ? "animate-pulse" : ""} />
        <path d="M4 16 L8 16 L16 24 L24 16 L28 16" stroke="url(#circuitGradient)" strokeWidth="1" fill="none" 
          className={animated ? "animate-pulse" : ""} style={{ animationDelay: '0.3s' }} />
        <path d="M4 24 L12 24 L16 16 L20 24 L28 24" stroke="url(#circuitGradient)" strokeWidth="1" fill="none" 
          className={animated ? "animate-pulse" : ""} style={{ animationDelay: '0.6s' }} />
        
        {/* Circuit nodes */}
        <circle cx="8" cy="8" r="2" fill="var(--primary)" opacity="0.8" />
        <circle cx="24" cy="8" r="2" fill="var(--secondary)" opacity="0.8" />
        <circle cx="16" cy="16" r="3" fill="var(--accent)" opacity="0.9" />
        <circle cx="8" cy="24" r="2" fill="var(--secondary)" opacity="0.8" />
        <circle cx="24" cy="24" r="2" fill="var(--primary)" opacity="0.8" />
      </svg>
    </div>
  );

  const HexagonIcon = () => (
    <div className={cn(
      sizes.iconContainer,
      "relative bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg border border-primary/20 overflow-hidden",
      animated && "transition-all duration-500 group-hover:border-primary/50"
    )}>
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 32 32">
        <defs>
          <linearGradient id="hexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--primary)" />
            <stop offset="50%" stopColor="var(--accent)" />
            <stop offset="100%" stopColor="var(--secondary)" />
          </linearGradient>
        </defs>
        
        {/* Outer hexagon */}
        <polygon
          points="16,4 24,9 24,23 16,28 8,23 8,9"
          stroke="url(#hexGradient)"
          strokeWidth={sizes.strokeWidth}
          fill="none"
          className={animated ? "transition-all duration-300 group-hover:fill-primary/10" : ""}
        />
        
        {/* Inner hexagon */}
        <polygon
          points="16,8 20,11 20,21 16,24 12,21 12,11"
          stroke="var(--accent)"
          strokeWidth="1"
          fill="var(--primary)/20"
          className={animated ? "transition-all duration-300 group-hover:fill-primary/30" : ""}
        />
        
        {/* Center element */}
        <circle cx="16" cy="16" r="3" fill="var(--primary)" opacity="0.8"
          className={animated ? "animate-pulse" : ""} />
        
        {/* VS text */}
        <text x="16" y="19" textAnchor="middle" fontSize={sizes.fontSize} fill="var(--primary-foreground)" 
          className="font-bold">VS</text>
      </svg>
    </div>
  );

  const WaveIcon = () => (
    <div className={cn(
      sizes.iconContainer,
      "relative bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 rounded-lg border border-primary/30 overflow-hidden",
      animated && "transition-all duration-500 group-hover:border-primary/60"
    )}>
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 32 32">
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--primary)" />
            <stop offset="50%" stopColor="var(--accent)" />
            <stop offset="100%" stopColor="var(--secondary)" />
          </linearGradient>
        </defs>
        
        {/* Wave paths */}
        <path d="M2 10 Q8 6 16 10 T30 10" stroke="url(#waveGradient)" strokeWidth="2" fill="none" 
          className={animated ? "animate-pulse" : ""} />
        <path d="M2 16 Q8 12 16 16 T30 16" stroke="url(#waveGradient)" strokeWidth="2" fill="none" 
          className={animated ? "animate-pulse" : ""} style={{ animationDelay: '0.2s' }} />
        <path d="M2 22 Q8 18 16 22 T30 22" stroke="url(#waveGradient)" strokeWidth="2" fill="none" 
          className={animated ? "animate-pulse" : ""} style={{ animationDelay: '0.4s' }} />
        
        {/* Peak indicators */}
        <circle cx="8" cy="8" r="1.5" fill="var(--primary)" />
        <circle cx="16" cy="16" r="2" fill="var(--accent)" />
        <circle cx="24" cy="8" r="1.5" fill="var(--secondary)" />
      </svg>
    </div>
  );

  const renderIcon = () => {
    switch (style) {
      case 'circuit': return <CircuitIcon />;
      case 'hexagon': return <HexagonIcon />;
      case 'wave': return <WaveIcon />;
      default: return <GeometricIcon />;
    }
  };

  const LogoText = () => (
    <div className="flex flex-col items-start">
      <div className="relative">
        <span className={cn(
          sizes.text,
          "font-bold tracking-tight relative z-10",
          animated 
            ? "bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent animate-gradient-text" 
            : "text-primary"
        )}>
          Visa Score
        </span>
        
        {/* Modern underline */}
        <div className={cn(
          "absolute -bottom-0.5 left-0 h-px bg-gradient-to-r from-primary via-accent to-secondary",
          animated ? "w-0 group-hover:w-full transition-all duration-500" : "w-full"
        )}></div>
      </div>
      
      {variant !== 'compact' && variant !== 'minimal' && (
        <span className={cn(
          sizes.subtitle,
          "text-muted-foreground font-medium tracking-widest uppercase"
        )}>
          AI Platform
        </span>
      )}
    </div>
  );

  if (variant === 'icon-only') {
    return (
      <button
        onClick={onClick}
        className={cn(
          "group relative rounded-lg transition-all duration-300",
          animated && "hover:scale-110 active:scale-95",
          className
        )}
      >
        {renderIcon()}
      </button>
    );
  }

  if (variant === 'minimal') {
    return (
      <button
        onClick={onClick}
        className={cn(
          "group relative flex items-center space-x-2 transition-all duration-300",
          animated && "hover:scale-105",
          sizes.container,
          className
        )}
      >
        {renderIcon()}
        <span className={cn(
          sizes.text,
          "font-bold text-primary"
        )}>
          VS
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex items-center space-x-3 rounded-lg border border-transparent transition-all duration-300",
        "bg-gradient-to-r from-background/80 to-card/50 backdrop-blur-sm",
        animated && [
          "hover:border-primary/30",
          "hover:bg-gradient-to-r hover:from-primary/5 hover:to-secondary/5",
          "hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/20",
          "active:scale-[0.98]"
        ],
        sizes.container,
        className
      )}
    >
      {renderIcon()}
      <LogoText />
      
      {/* Tech accent line */}
      {animated && (
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-60 transition-opacity duration-500"></div>
      )}
    </button>
  );
}