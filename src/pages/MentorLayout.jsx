import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { 
  LayoutGrid, Settings, ShieldCheck, Menu, X, UserPlus, Lock, Building2, LogOut 
} from "lucide-react";
import { auth, db } from "../firebase";
import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function MentorLayout({ dark }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mentorData, setMentorData] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- 🎨 💎 THE CRYSTAL CONSOLE ENGINE ---
  const theme = {
    bg: dark ? "bg-[#0a0a0a]" : "bg-gradient-to-br from-[#fdf2f8] via-[#f5f3ff] to-[#eff6ff]",
    side: dark ? "bg-[#0d0d0d]/90 lg:bg-[#0d0d0d]/40 border-white/[0.08] shadow-2xl" : "bg-white/90 lg:bg-white/40 border-white shadow-2xl shadow-purple-500/10",
    btnActive: dark ? "bg-white text-black shadow-xl" : "bg-gradient-to-r from-purple-700 to-indigo-700 text-white shadow-xl",
    btnIdle: dark ? "text-white/20 hover:bg-white/5 hover:text-white" : "text-slate-400 hover:bg-purple-50 hover:text-purple-600",
    accent: dark ? "text-amber-500" : "text-purple-600",
    card: dark ? "bg-[#111111]/80 border-white/10" : "bg-white/90 border-white shadow-xl",
    innerShine: "absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent pointer-events-none z-10",
    ambientGlow: dark ? "fixed w-[600px] h-[600px] rounded-full bg-amber-500/5 blur-[120px] -z-10" : "fixed w-[600px] h-[600px] rounded-full bg-purple-500/5 blur-[120px] -z-10"
  };

  useEffect(() => {
    let unsubMentor = () => {};
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        unsubMentor = onSnapshot(doc(db, "users", user.uid), (snap) => {
          if (snap.exists()) setMentorData(snap.data());
          setLoading(false);
        });
      } else {
        navigate("/Login");
      }
    });
    return () => { unsubAuth(); unsubMentor(); };
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/Login");
  };

  if (loading) return null;

  // --- 🔒 MOBILE-READY FULL SCREEN LOCK ---
  if (mentorData && !mentorData.isApproved) {
    return (
      <div className={`h-screen w-full flex items-center justify-center relative overflow-hidden transition-all duration-700 p-6 ${theme.bg}`}>
        <div className={theme.ambientGlow} style={{ top: '10%', left: '10%' }}></div>
        <div className={`relative z-50 w-full max-w-md p-10 md:p-16 rounded-[3.5rem] border text-center overflow-hidden backdrop-blur-3xl shadow-2xl ${theme.card}`}>
          <div className={theme.innerShine}></div>
          
          <div className={`inline-flex p-5 rounded-3xl mb-8 animate-pulse ${dark ? 'bg-amber-500/10 text-amber-500' : 'bg-purple-100 text-purple-600'}`}>
            <Lock size={40} />
          </div>
          
          <h2 className={`text-3xl md:text-4xl font-black italic uppercase tracking-tighter mb-4 ${dark ? 'text-white' : 'text-[#1e1b4b]'}`}>
            Portal <span className={theme.accent}>Locked</span>
          </h2>
          
          <p className={`text-[10px] font-black uppercase tracking-[0.3em] leading-loose opacity-60 mb-10 ${dark ? 'text-white' : 'text-slate-500'}`}>
            Access restricted until a <span className={theme.accent}>System Administrator</span> authorizes your session.
          </p>

          <div className={`py-4 px-6 rounded-2xl inline-block border ${dark ? 'bg-white/5 border-white/10' : 'bg-white border-purple-100'}`}>
             <p className="text-[8px] font-black uppercase tracking-widest opacity-30">Security Domain</p>
             <p className={`text-xs font-bold mt-1 uppercase italic tracking-widest ${dark ? 'text-white' : 'text-[#1e1b4b]'}`}>
               {mentorData.domain || "Awaiting Assignment"}
             </p>
          </div>

          <button 
            onClick={handleLogout}
            className="flex items-center justify-center gap-3 mx-auto mt-10 text-[9px] font-black uppercase tracking-[0.2em] opacity-40 hover:opacity-100 transition-all"
          >
            <LogOut size={14} /> Termination Protocol
          </button>
        </div>
      </div>
    );
  }

  // --- ✅ AUTHORIZED LAYOUT ---
  const menu = [
    { name: "Executive Hub", path: "/mentor/dashboard", icon: LayoutGrid },
    { name: "Recruitment Pool", path: "/mentor/recruit", icon: UserPlus },
    { name: "Control Center", path: "/mentor/settings", icon: Settings },
  ];

  return (
    <div className={`h-screen w-full flex flex-col lg:flex-row transition-all duration-700 overflow-hidden ${theme.bg}`}>
      
      {/* 📱 MOBILE TOP BAR (Visible only on small screens) */}
      <header className={`lg:hidden flex items-center justify-between p-5 sticky top-0 z-[100] backdrop-blur-2xl border-b ${dark ? 'bg-black/40 border-white/10' : 'bg-white/40 border-purple-100'}`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${dark ? 'bg-amber-500 text-black' : 'bg-purple-600 text-white'}`}>
            <ShieldCheck size={20} />
          </div>
          <h1 className={`text-sm font-black tracking-tighter uppercase italic ${dark ? 'text-white' : 'text-[#1e1b4b]'}`}>Mentor<span className={theme.accent}>PRO</span></h1>
        </div>
        
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className={`p-3 rounded-2xl border ${dark ? 'border-white/10 bg-white/5 text-white' : 'border-purple-100 bg-white text-purple-600'}`}
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* 🌑 MOBILE OVERLAY (Blackout behind the drawer) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* --- 🏰 CRYSTAL SIDEBAR --- */}
      <aside className={`
        fixed lg:sticky top-0 left-0 h-full lg:h-screen z-[150] lg:z-50
        w-72 md:w-80 p-6 md:p-8 flex flex-col border-r backdrop-blur-3xl transition-all duration-500 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${theme.side}
      `}>
        <div className={theme.innerShine}></div>
        
        <div className="hidden lg:flex items-center gap-4 mb-16 relative z-20">
          <div className={`p-3 rounded-2xl ${dark ? 'bg-amber-500 text-black' : 'bg-purple-600 text-white'}`}><ShieldCheck size={26} /></div>
          <h1 className={`text-xl font-black tracking-tighter uppercase italic leading-none ${dark ? 'text-white' : 'text-[#1e1b4b]'}`}>Mentor<span className={theme.accent}>PRO</span></h1>
        </div>

        <nav className="flex-1 space-y-3 md:space-y-4 relative z-20">
          {menu.map((item) => (
            <button 
              key={item.name} 
              onClick={() => { navigate(item.path); setIsMobileMenuOpen(false); }} 
              className={`w-full flex items-center gap-4 md:gap-5 p-4 md:p-5 rounded-[2rem] border transition-all duration-500 ${location.pathname === item.path ? theme.btnActive : theme.btnIdle}`}
            >
              <item.icon size={20} /><span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em]">{item.name}</span>
            </button>
          ))}
        </nav>

        {/* IDENTITY DOCK */}
        <div className={`mt-auto pt-6 border-t relative z-20 ${dark ? 'border-white/5' : 'border-purple-100'}`}>
          <button 
            onClick={() => { navigate("/mentor/profile"); setIsMobileMenuOpen(false); }}
            className={`flex w-full items-center gap-4 p-4 rounded-[2rem] border backdrop-blur-2xl transition-all duration-700 ${dark ? 'bg-white/5 border-white/5' : 'bg-white border-purple-50 shadow-lg'}`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-black font-black text-lg ${dark ? 'bg-amber-500' : 'bg-gradient-to-br from-pink-500 to-purple-600 text-white'}`}>
               {mentorData?.name?.charAt(0).toUpperCase() || "M"}
            </div>
            <div className="min-w-0 flex-1 text-left">
               <p className={`text-[10px] font-black uppercase tracking-tight truncate ${dark ? 'text-white' : 'text-[#1e1b4b]'}`}>
                 {mentorData?.name?.split(' ')[0] || "User"}
               </p>
               <p className="text-[7px] font-black uppercase tracking-widest opacity-30 mt-0.5">Profile Hub</p>
            </div>
          </button>
        </div>
      </aside>

      {/* --- 🖥️ SCROLLABLE CONTENT --- */}
      <main className="flex-1 relative z-10 overflow-y-auto">
        <div className="p-4 md:p-10 lg:pt-14 pb-32">
          <Outlet />
        </div>
      </main>
    </div>
  );
}