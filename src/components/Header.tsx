export function Header() {
  return (
    <header className="relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-slate-900 to-cyan-900/20" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent" />
      
      {/* Animated Orbs */}
      <div className="absolute top-10 left-1/4 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-20 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="text-center space-y-6">
          {/* Logo */}
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl blur-lg opacity-50" />
              <div className="relative w-16 h-16 bg-gradient-to-br from-purple-600 to-cyan-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <span className="text-3xl">🎴</span>
              </div>
            </div>
          </div>
          
          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 tracking-tight">
            TCG Scope
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Türkiye'deki <span className="text-purple-400 font-semibold">orijinal TCG</span> satan mağazaları keşfedin.
            <br className="hidden sm:block" />
            Pokémon, One Piece, Magic: The Gathering ve daha fazlası!
          </p>
          
          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50">
              <span className="text-2xl">🏪</span>
              <span className="text-sm text-slate-400">
                <span className="font-bold text-white">29</span> Mağaza
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50">
              <span className="text-2xl">🗺️</span>
              <span className="text-sm text-slate-400">
                <span className="font-bold text-white">3</span> Şehir
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50">
              <span className="text-2xl">🎯</span>
              <span className="text-sm text-slate-400">
                <span className="font-bold text-white">7</span> TCG Türü
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

