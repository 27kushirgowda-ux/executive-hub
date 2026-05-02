import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Upload,
  History,
  MessageSquare, // 🎯 Changed from Bell
  Calendar,
  Settings,
  Menu,
  X,
  ShieldCheck,
  User as UserIcon
} from "lucide-react";
import { auth, db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function InternLayout({ dark }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [openSidebar, setOpenSidebar] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const unsubSnap = onSnapshot(userRef, (snap) => {
          if (snap.exists()) setUserData(snap.data());
        });
        return () => unsubSnap();
      } else {
        navigate("/");
      }
    });
    return () => unsub();
  }, [navigate]);

  const menu = [
    { icon: LayoutDashboard, name: "Dashboard", path: "/app/dashboard" },
    { icon: Upload, name: "Upload Task", path: "/app/upload" },
    { icon: History, name: "Task History", path: "/app/task-history" },
    { icon: MessageSquare, name: "Remarks", path: "/app/notifications" }, // 🎯 Name/Icon changed, path remains 'notifications'
    { icon: Calendar, name: "Schedule", path: "/app/schedule" },
    { icon: Settings, name: "Settings", path: "/app/settings" },
  ];

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
    glow: dark ? "bg-orange-600/10" : "bg-pink-400/20"
  };

  const toggleSidebar = () => setOpenSidebar(!openSidebar);

  return (
    <div className={`min-h-screen flex flex-col lg:flex-row transition-all duration-700 font-sans selection:bg-amber-500/30 ${theme.bg} ${theme.text}`}>

      <div className={`fixed top-[-10%] left-[-10%] w-[600px] h-[600px] blur-[150px] rounded-full pointer-events-none z-0 transition-colors duration-1000 ${theme.glow}`} />

      <header className={`lg:hidden flex items-center justify-between p-5 sticky top-0 z-[60] backdrop-blur-xl border-b transition-colors ${dark ? 'bg-black/50 border-white/5' : 'bg-white/50 border-purple-100'}`}>
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg shadow-lg ${dark ? 'bg-amber-500 text-black' : 'bg-pink-500 text-white'}`}>
            <ShieldCheck size={18} />
          </div>
          <h1 className="text-sm font-black tracking-tighter uppercase italic">Inter<span className={dark ? 'text-amber-500' : 'text-purple-600'}>Track</span></h1>
        </div>
        
        <button onClick={toggleSidebar} className={`p-2 rounded-xl border transition-all ${dark ? 'border-white/10 bg-white/5' : 'border-purple-100 bg-white shadow-sm'}`}>
          {openSidebar ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {openSidebar && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] lg:hidden" onClick={() => setOpenSidebar(false)} />
      )}

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
          {menu.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.name}
                onClick={() => {
                  navigate(item.path);
                  setOpenSidebar(false);
                }}
                className={`w-full flex items-center gap-4 p-4 rounded-[1.8rem] border backdrop-blur-md transition-all duration-500 group active:scale-95 ${
                  isActive ? theme.btnActive : theme.btnIdle
                }`}
              >
                <div className={`transition-transform duration-500 ${isActive ? 'scale-110' : 'group-hover:rotate-12'}`}>
                  <item.icon size={20} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.25em]">
                  {item.name}
                </span>
              </button>
            );
          })}
        </nav>

        <div className={`mt-auto pt-6 border-t space-y-4 ${dark ? 'border-white/5' : 'border-purple-100'}`}>
          <button 
            onClick={() => { navigate("/app/profile"); setOpenSidebar(false); }}
            className={`flex w-full items-center gap-3 p-3 rounded-[2rem] border backdrop-blur-xl transition-all duration-500 group text-left shadow-sm ${theme.profile}`}
          >
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-black font-black shadow-lg transition-all group-hover:scale-110 group-hover:rotate-3 ${
              dark ? 'bg-amber-500 shadow-amber-500/20' : 'bg-gradient-to-tr from-pink-400 to-purple-500 text-white shadow-purple-500/20'
            }`}>
               {userData?.name?.charAt(0).toUpperCase() || "U"}
            </div>

            <div className="min-w-0 flex-1">
               <p className={`text-[10px] font-black uppercase tracking-tighter truncate transition-colors ${dark ? 'group-hover:text-amber-500' : 'group-hover:text-purple-600'}`}>
                 {userData?.name || "Candidate"}
               </p>
               <p className={`text-[8px] font-bold uppercase tracking-widest ${dark ? 'text-amber-500/60' : 'text-purple-400'}`}>
                 {userData?.domain || "Internship"} • Hub Active
               </p>
            </div>
          </button>
        </div>
      </aside>

      <main className="flex-1 relative z-10 overflow-y-auto">
        <div className="lg:h-6 w-full" /> 
        <div className="p-4 lg:p-8 pb-24">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}