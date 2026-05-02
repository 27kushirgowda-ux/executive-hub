import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { 
  LayoutGrid, 
  Settings, 
  ShieldCheck, 
  Menu, 
  X,
  User as UserIcon,
  Zap,
  Globe
} from "lucide-react";
import { auth } from "../firebase";
import { useState } from "react";

export default function MentorLayout({ dark }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menu = [
    { name: "Executive Hub", path: "/mentor/dashboard", icon: LayoutGrid },
    { name: "Control Center", path: "/mentor/settings", icon: Settings },
  ];

  // --- 🎨 💎 THE CRYSTAL CONSOLE ENGINE ---
  const theme = {
    bg: dark 
      ? "bg-[#0a0a0a]" 
      : "bg-gradient-to-br from-[#fdf2f8] via-[#f5f3ff] to-[#eff6ff]",
    // Card styling with Secret Ingredient (Shine + Blur)
    side: dark 
      ? "bg-[#0d0d0d]/40 border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.8)]" 
      : "bg-white/40 border-white shadow-2xl shadow-purple-500/10",
    btnActive: dark
      ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.1)] border-white/20"
      : "bg-gradient-to-r from-purple-700 to-indigo-700 text-white shadow-xl",
    btnIdle: dark
      ? "text-white/20 border-transparent hover:bg-white/5 hover:text-white"
      : "text-slate-400 border-transparent hover:bg-purple-50 hover:text-purple-600",
    innerShine: "absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent pointer-events-none z-10",
    ambientGlow: dark 
      ? "fixed w-[800px] h-[800px] rounded-full bg-amber-500/5 blur-[180px] -z-10 pointer-events-none"
      : "fixed w-[800px] h-[800px] rounded-full bg-purple-500/5 blur-[180px] -z-10 pointer-events-none"
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    // 🎯 FIXED: Main wrapper is h-screen and overflow-hidden to prevent body scroll
    <div className={`h-screen w-full flex flex-col lg:flex-row transition-all duration-700 overflow-hidden ${theme.bg}`}>
      
      {/* 🚨 AMBIENT GLOWS */}
      <div className={theme.ambientGlow} style={{ top: '-200px', left: '-200px' }}></div>
      <div className={theme.ambientGlow} style={{ bottom: '-200px', right: '-100px' }}></div>
      
      {/* 📱 MOBILE HEADER */}
      <header className={`lg:hidden flex items-center justify-between p-5 sticky top-0 z-[100] backdrop-blur-2xl border-b ${dark ? 'bg-black/40 border-white/10' : 'bg-white/40 border-purple-100'}`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${dark ? 'bg-amber-500 text-black' : 'bg-purple-600 text-white shadow-lg'}`}>
            <ShieldCheck size={20} />
          </div>
          <h1 className={`text-sm font-black tracking-tighter uppercase italic ${dark ? 'text-white' : 'text-[#1e1b4b]'}`}>Mentor<span className={dark ? 'text-amber-500' : 'text-purple-600'}>PRO</span></h1>
        </div>
        
        <button onClick={toggleMobileMenu} className={`p-2.5 rounded-2xl border ${dark ? 'border-white/10 bg-white/5 text-white' : 'border-purple-100 bg-white text-purple-600 shadow-sm'}`}>
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* 🌑 MOBILE OVERLAY */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[110] lg:hidden animate-in fade-in duration-500" onClick={toggleMobileMenu} />
      )}

      {/* --- 🏰 CRYSTAL SIDEBAR (Pinned to viewport) --- */}
      <aside className={`
        fixed lg:sticky top-0 left-0 h-full lg:h-screen z-[150] lg:z-50
        w-80 p-8 flex flex-col border-r backdrop-blur-3xl transition-all duration-700 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${theme.side}
      `}>
        <div className={theme.innerShine}></div>
        
        {/* LOGO SECTION */}
        <div className="hidden lg:flex items-center gap-4 mb-16 relative z-20">
          <div className={`p-3 rounded-2xl shadow-2xl ${dark ? 'bg-amber-500 text-black shadow-amber-500/20' : 'bg-gradient-to-br from-purple-600 to-blue-700 text-white shadow-purple-600/30'}`}>
            <ShieldCheck size={26} />
          </div>
          <div className="flex flex-col">
            <h1 className={`text-xl font-black tracking-tighter uppercase italic leading-none ${dark ? 'text-white' : 'text-[#1e1b4b]'}`}>Mentor<span className={dark ? 'text-amber-500' : 'text-purple-600'}>PRO</span></h1>
            <p className="text-[8px] font-black uppercase tracking-[0.4em] opacity-30 mt-1">Operational Oversight</p>
          </div>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="flex-1 space-y-4 relative z-20">
          {menu.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.name}
                onClick={() => { navigate(item.path); setIsMobileMenuOpen(false); }}
                className={`w-full group flex items-center gap-5 p-5 rounded-[2.2rem] border transition-all duration-500 relative overflow-hidden active:scale-95 ${
                  isActive ? theme.btnActive : theme.btnIdle
                }`}
              >
                {isActive && <div className={theme.innerShine}></div>}
                <div className={`transition-transform duration-500 group-hover:scale-110 ${isActive ? 'scale-110' : 'opacity-40'}`}>
                  <item.icon size={22} />
                </div>
                <span className="text-[11px] font-black uppercase tracking-[0.3em]">
                  {item.name}
                </span>
                {isActive && <div className="absolute right-6 w-1.5 h-1.5 rounded-full bg-current animate-pulse"></div>}
              </button>
            );
          })}
        </nav>

        {/* --- 👤 IDENTITY DOCK (Profile Card) --- */}
        <div className={`mt-auto pt-8 border-t relative z-20 ${dark ? 'border-white/5' : 'border-purple-100'}`}>
          <button 
            onClick={() => { navigate("/mentor/profile"); setIsMobileMenuOpen(false); }}
            className={`flex w-full items-center gap-4 p-5 rounded-[2.5rem] border backdrop-blur-2xl transition-all duration-700 group relative overflow-hidden hover:-translate-y-1 ${
              dark ? 'bg-white/5 border-white/5 hover:border-amber-500/30' : 'bg-white/80 border-white shadow-xl hover:border-purple-300'
            }`}
          >
            <div className={theme.innerShine}></div>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-black font-black text-xl shadow-2xl transition-all duration-700 group-hover:rotate-6 ${
              dark ? 'bg-amber-500 shadow-amber-500/20' : 'bg-gradient-to-br from-pink-500 to-purple-600 text-white'
            }`}>
               {auth.currentUser?.email?.charAt(0).toUpperCase() || "M"}
            </div>
            <div className="min-w-0 flex-1">
               <p className={`text-[11px] font-black uppercase tracking-tight truncate ${dark ? 'text-white' : 'text-[#1e1b4b]'}`}>
                 {auth.currentUser?.email?.split('@')[0]}
               </p>
               <div className="flex items-center gap-2 mt-1">
                  <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${dark ? 'bg-amber-500' : 'bg-purple-600'}`}></div>
                  <p className={`text-[8px] font-black uppercase tracking-widest opacity-40`}>
                    Hub Active
                  </p>
               </div>
            </div>
          </button>
        </div>
      </aside>

      {/* --- 🖥️ MAIN CONTENT AREA (The only area that scrolls) --- */}
      <main className="flex-1 relative z-10 overflow-y-auto custom-scrollbar">
        <div className="p-4 lg:p-10 lg:pt-14 pb-32">
          <Outlet />
        </div>
      </main>

    </div>
  );
}