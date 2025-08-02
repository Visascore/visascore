export function AIVisaScoreLogo({ className = "h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>

      
      {/* Brand Text */}
      <div className="flex flex-col">
        <div className="flex items-center space-x-1">
          <span className="text-xl font-bold text-foreground leading-none tracking-tight">
            VISA
          </span>
          <div className="w-1 h-1 bg-emerald-400 rounded-full animate-gaming-pulse"></div>
          <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent leading-none tracking-tight animate-gradient-text">
            SCORE
          </span>
        </div>

      </div>
    </div>
  );
}