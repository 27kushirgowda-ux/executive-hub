import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Upload,
  History,
  MessageSquare,
  Calendar,
  Settings,
  Menu,
  X,
  ShieldCheck,
  User as UserIcon,
  Lock,
  Hourglass,
  LogOut
} from "lucide-react";
import { auth, db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function InternLayout({ dark }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [openSidebar, setOpenSidebar] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- 🎨 💎 THE CRYSTAL CONSOLE ENGINE ---
  const theme = {
    bg: dark 
      ? "bg-[#0a0a0a]" 
      : "bg-gradient-to-br from-[#fdf2f8] via-[#f5f3ff] to-[#eff6ff]",
    side: dark 
      ? "bg-[#0d0d0d]/80 border-white/5 shadow-2xl shadow-black" 
      : "bg-white/70 border-purple-100 shadow-xl shadow-purple-500/10",
    btnActive: dark
      ? "bg-white text-black shadow-lg border-white shadow-white/5"
      : "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-purple-500/20 border-transparent",
    btnIdle: dark
      ? "text-white/40 bg-transparent border-transparent hover:bg-white/5 hover:text-white"
      : "text-slate-400 bg-transparent border-transparent hover:bg-white/80 hover:border-purple-100 hover:text-purple-600",
    profile: dark 
      ? "bg-white/5 border-white/5 hover:bg-white/10 hover:border-amber-500/30" 
      : "bg-white border-purple-50 shadow-lg shadow-purple-500/5 hover:border-purple-200",
    text: dark ? "text-white" : "text-slate-900",
    accent: dark ? "text-amber-500" : "text-purple-600",
    glow: dark ? "bg-orange-600/10" : "bg-pink-400/20",
    card: dark ? "bg-[#111111]/60 border-white/10" : "bg-white/80 border-white shadow-xl"
  };

  useEffect(() => {
    let unsubSnap = () => {};
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        unsubSnap = onSnapshot(userRef, (snap) => {
          if (snap.exists()) setUserData(snap.data());
          setLoading(false);
        });
      } else {
        navigate("/");
      }
    });
    return () => { unsubAuth(); unsubSnap(); };
  }, [navigate]);

  if (loading) return null;

  // --- 🔒 THE RECRUITMENT LOCKSCREEN ---
  // If no mentor has accepted this intern yet (mentorId is null or isApproved is false)
  const isLocked = !userData?.isApproved || !userData?.mentorId;

  if (isLocked) {
    return (
      <div className={`h-screen w-full flex items-center justify-center relative overflow-hidden transition-all duration-700 p-6 ${theme.bg}`}>
        {/* Glow Effects */}
        <div className={`fixed top-[-10%] left-[-10%] w-[600px] h-[600px] blur-[150px] rounded-full pointer-events-none z-0 transition-colors duration-1000 ${theme.glow}`} />

        <div className={`relative z-50 w-full max-w-lg p-12 md:p-16 rounded-[4rem] border text-center overflow-hidden mx-4 backdrop-blur-3xl shadow-2xl ${theme.card}`}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent pointer-events-none z-10"></div>
          
          <div className={`inline-flex p-6 rounded-[2rem] mb-8 animate-bounce transition-all ${dark ? 'bg-amber-500/10 text-amber-500' : 'bg-pink-100 text-pink-500'}`}>
            <Hourglass size={48} />
          </div>
          
          <h2 className={`text-4xl md:text-5xl font-black italic uppercase tracking-tighter mb-4 ${theme.text}`}>
            Awaiting <span className={theme.accent}>Recruitment</span>
          </h2>
          
          <p className={`text-[10px] font-black uppercase tracking-[0.4em] leading-loose opacity-60 mb-10 ${theme.text}`}>
            Your profile has been synchronized with the <span className={theme.accent}>Executive Recruitment Pool</span>. 
            A Mentor will review your credentials and authorize your deployment shortly.
          </p>

          <div className={`py-5 px-8 rounded-3xl inline-block border ${dark ? 'bg-white/5 border-white/10' : 'bg-white border-purple-100 shadow-sm'}`}>
             <p className="text-[9px] font-black uppercase tracking-widest opacity-30 mb-2">Assigned Domain</p>
             <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full animate-pulse ${dark ? 'bg-amber-500' : 'bg-pink-500'}`}></div>
                <p className={`text-sm font-bold uppercase italic tracking-widest ${theme.text}`}>
                  {userData?.domain || "Candidate Intern"}
                </p>
             </div>
          </div>

          <button 
            onClick={() => signOut(auth)}
            className="flex items-center justify-center gap-3 mx-auto mt-12 text-[9px] font-black uppercase tracking-[0.3em] opacity-40 hover:opacity-100 hover:text-red-500 transition-all"
          >
            <LogOut size={16} /> Exit Secure Session
          </button>
        </div>
      </div>
    );
  }

  // --- ✅ AUTHORIZED LAYOUT (Visible after recruitment) ---
  const menu = [
    { icon: LayoutDashboard, name: "Dashboard", path: "/app/dashboard" },
    { icon: Upload, name: "Upload Task", path: "/app/upload" },
    { icon: History, name: "Task History", path: "/app/task-history" },
    { icon: MessageSquare, name: "Remarks", path: "/app/notifications" },
    { icon: Calendar, name: "Schedule", path: "/app/schedule" },
    { icon: Settings, name: "Settings", path: "/app/settings" },
  ];

  return (
    <div className={`h-screen w-full flex flex-col lg:flex-row transition-all duration-700 overflow-hidden ${theme.bg} ${theme.text}`}>
      
      {/* Glow Effect */}
      <div className={`fixed top-[-10%] left-[-10%] w-[600px] h-[600px] blur-[150px] rounded-full pointer-events-none z-0 transition-colors duration-1000 ${theme.glow}`} />

      {/* MOBILE HEADER */}
      <header className={`lg:hidden flex items-center justify-between p-5 sticky top-0 z-[60] backdrop-blur-xl border-b ${dark ? 'bg-black/50 border-white/5' : 'bg-white/50 border-purple-100'}`}>
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg shadow-lg ${dark ? 'bg-amber-500 text-black' : 'bg-pink-500 text-white'}`}>
            <ShieldCheck size={18} />
          </div>
          <h1 className="text-sm font-black tracking-tighter uppercase italic">Inter<span className={dark ? 'text-amber-500' : 'text-purple-600'}>Track</span></h1>
        </div>
        <button onClick={() => setOpenSidebar(!openSidebar)} className={`p-2 rounded-xl border ${dark ? 'border-white/10 bg-white/5' : 'border-purple-100 bg-white shadow-sm'}`}>
          {openSidebar ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {openSidebar && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] lg:hidden" onClick={() => setOpenSidebar(false)} />
      )}

      {/* SIDEBAR */}
      <aside className={`
        fixed lg:sticky top-0 left-0 h-full lg:h-screen z-[100] lg:z-50
        w-72 p-6 flex flex-col border-r backdrop-blur-3xl transition-transform duration-500 ease-in-out
        ${openSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${theme.side}
      `}>
        <div className="hidden lg:flex items-center gap-3 mb-12 px-2">
          <div className={`p-2 rounded-2xl shadow-lg transition-all duration-500 ${dark ? 'bg-amber-500 text-black' : 'bg-gradient-to-tr from-pink-500 to-purple-600 text-white shadow-purple-500/20'}`}>
            <ShieldCheck size={24} />
          </div>
          <h1 className="text-lg font-black tracking-tighter uppercase italic">
            Inter<span className={dark ? 'text-amber-500' : 'text-purple-600'}>Track</span>
          </h1>
        </div>

        <nav className="flex-1 space-y-4">
          {menu.map((item) => (
            <button
              key={item.name}
              onClick={() => { navigate(item.path); setOpenSidebar(false); }}
              className={`w-full flex items-center gap-4 p-4 rounded-[1.8rem] border backdrop-blur-md transition-all duration-500 active:scale-95 ${
                location.pathname === item.path ? theme.btnActive : theme.btnIdle
              }`}
            >
              <item.icon size={20} />
              <span className="text-[10px] font-black uppercase tracking-[0.25em]">{item.name}</span>
            </button>
          ))}
        </nav>

        <div className={`mt-auto pt-6 border-t ${dark ? 'border-white/5' : 'border-purple-100'}`}>
          <button 
            onClick={() => { navigate("/app/profile"); setOpenSidebar(false); }}
            className={`flex w-full items-center gap-3 p-3 rounded-[2rem] border backdrop-blur-xl transition-all duration-500 group shadow-sm ${theme.profile}`}
          >
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-black font-black shadow-lg ${dark ? 'bg-amber-500' : 'bg-gradient-to-tr from-pink-400 to-purple-500 text-white'}`}>
               {userData?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="min-w-0 flex-1">
               <p className="text-[10px] font-black uppercase tracking-tighter truncate">{userData?.name || "Candidate"}</p>
               <p className={`text-[8px] font-bold uppercase tracking-widest ${dark ? 'text-amber-500/60' : 'text-purple-400'}`}>Hub Active</p>
            </div>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 relative z-10 overflow-y-auto">
        <div className="p-4 lg:p-10 lg:pt-14 pb-32">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}