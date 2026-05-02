import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, onSnapshot, updateDoc, deleteDoc } from "firebase/firestore";
import { signOut, deleteUser } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { 
  Sun, 
  Moon, 
  LogOut, 
  Trash2, 
  ShieldAlert, 
  User, 
  Link2, 
  CheckCircle2,
  Hash,
  Briefcase,
  Timer,
  ShieldCheck,
  AlertTriangle
} from "lucide-react";

export default function InternSettings({ dark, setDark }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // 🎯 UNIFIED FRONTEND FEEDBACK ENGINE
  const [feedback, setFeedback] = useState({ type: "", text: "" });

  const styles = {
    card: dark 
      ? "bg-[#111111]/40 border-white/[0.08] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] backdrop-blur-3xl hover:border-amber-500/30 transition-all duration-700 relative overflow-hidden group" 
      : "bg-white/40 border-white shadow-[0_20px_50px_rgba(120,119,198,0.1)] backdrop-blur-3xl hover:border-purple-300 transition-all duration-700 relative overflow-hidden group",
    text: dark ? "text-white" : "text-[#1e1b4b]",
    sub: dark ? "text-white/20" : "text-slate-400",
    accent: dark ? "text-amber-500" : "text-purple-600",
    item: dark ? "bg-white/5 border-white/5" : "bg-white/60 border-white shadow-sm",
    innerShine: "absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-transparent pointer-events-none z-10",
    ambientGlow: dark 
      ? "fixed w-[600px] h-[600px] rounded-full bg-amber-500/10 blur-[150px] -z-20 pointer-events-none"
      : "fixed w-[600px] h-[600px] rounded-full bg-purple-500/10 blur-[150px] -z-20 pointer-events-none"
  };

  useEffect(() => {
    if (!auth.currentUser) return;
    const unsub = onSnapshot(doc(db, "users", auth.currentUser.uid), (snap) => {
      if (snap.exists()) setUser(snap.data());
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // --- HELPER: TRIGGER FEEDBACK ---
  const triggerFeedback = (type, text) => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback({ type: "", text: "" }), 4000);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/Login");
    } catch {
      triggerFeedback("error", "TERMINAL ERROR: LOGOUT SEQUENCE FAILED");
    }
  };

  const handleUpdateDuration = async (days) => {
    try {
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        internshipDuration: days
      });
      triggerFeedback("success", `PROTOCOL UPDATED: ${days} DAY TENURE ACTIVE`);
    } catch {
      triggerFeedback("error", "SYSTEM REFUSAL: TENURE UPDATE FAILED");
    }
  };

  const handleDisconnect = async () => {
    try {
      await updateDoc(doc(db, "users", auth.currentUser.uid), { mentorId: "" });
      triggerFeedback("success", "HUB SEVERED: CONNECTION TERMINATED");
      setTimeout(() => navigate("/app/dashboard"), 1500);
    } catch {
      triggerFeedback("error", "SECURITY ALERT: HUB DISCONNECTION FAILED");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        await deleteDoc(doc(db, "users", currentUser.uid));
        await deleteUser(currentUser);
        navigate("/Signup");
      }
    } catch (err) {
      // 🎯 SANITIZED: We don't show the Firebase "Requires recent login" string
      triggerFeedback("error", "SECURITY PROTOCOL: RE-AUTHENTICATION REQUIRED");
      setShowDeleteModal(false);
    }
  };

  if (loading) return null;

  return (
    <div className={`w-full min-h-screen p-4 md:p-8 flex flex-col space-y-10 animate-in fade-in duration-1000 ${styles.text}`}>
      
      <div className={styles.ambientGlow} style={{ top: '-100px', right: '-100px' }}></div>
      <div className={styles.ambientGlow} style={{ bottom: '100px', left: '-100px' }}></div>

      {/* --- FEEDBACK CONSOLE (Replacing backend alerts) --- */}
      {feedback.text && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-md px-6 animate-in slide-in-from-top duration-500">
           <div className={`p-6 rounded-[2rem] border backdrop-blur-3xl flex items-center gap-4 shadow-2xl ${
             feedback.type === "error" ? "bg-red-500/10 border-red-500/20 text-red-500" : "bg-green-500/10 border-green-500/20 text-green-500"
           }`}>
             {feedback.type === "error" ? <AlertTriangle size={20}/> : <CheckCircle2 size={20}/>}
             <p className="text-[10px] font-black uppercase tracking-[0.2em]">{feedback.text}</p>
           </div>
        </div>
      )}

      {/* --- HEADER --- */}
      <div className="relative z-20">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter italic uppercase leading-none">
          System <span className={styles.accent}>Settings</span>
        </h1>
        <p className={`text-[10px] font-black uppercase tracking-[0.8em] ${styles.sub} mt-3`}>
          Identity Control & Environment Config
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-20">
        
        <div className="space-y-8">
          {/* THEME TOGGLE */}
          <div className={`${styles.card} p-8 md:p-10 rounded-[3.5rem] border flex items-center justify-between`}>
            <div className={styles.innerShine}></div>
            <div className="flex items-center gap-6 relative z-20">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${dark ? 'bg-amber-500/10 text-amber-500' : 'bg-purple-100 text-purple-600'}`}>
                {dark ? <Moon size={28} /> : <Sun size={28} />}
              </div>
              <div>
                <h3 className="font-black text-sm uppercase tracking-widest">Interface Mode</h3>
                <p className={`text-[9px] font-bold uppercase ${styles.sub}`}>Switch Visual Environment</p>
              </div>
            </div>
            <button onClick={() => setDark(!dark)} className={`w-20 h-10 rounded-full relative transition-all duration-500 p-1.5 z-20 ${dark ? 'bg-amber-500' : 'bg-purple-400'} shadow-inner`}>
              <div className={`w-7 h-7 bg-white rounded-full shadow-xl transition-all duration-500 flex items-center justify-center ${dark ? 'translate-x-10' : 'translate-x-0'}`}>
                 {dark ? <Moon size={14} className="text-amber-500" /> : <Sun size={14} className="text-purple-500" />}
              </div>
            </button>
          </div>

          {/* TENURE CONTROL */}
          <div className={`${styles.card} p-8 md:p-10 rounded-[3.5rem] border`}>
            <div className={styles.innerShine}></div>
            <div className="flex items-center gap-4 mb-8 relative z-20">
               <Timer size={20} className={styles.accent}/>
               <h3 className="font-black text-sm uppercase tracking-widest">Internship Tenure</h3>
            </div>
            
            <div className="grid grid-cols-3 gap-3 relative z-20">
              {[30, 45, 90].map((days) => (
                <button 
                  key={days}
                  onClick={() => handleUpdateDuration(days)}
                  className={`py-4 rounded-2xl font-black text-[10px] uppercase transition-all border ${
                    user.internshipDuration === days 
                    ? (dark ? 'bg-amber-500 text-black border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)]' : 'bg-purple-600 text-white border-purple-500') 
                    : (dark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-slate-50 border-slate-200 text-slate-400')
                  }`}
                >
                  {days} Days
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* IDENTITY SUMMARY */}
          <div className={`${styles.card} p-8 md:p-10 rounded-[3.5rem] border`}>
            <div className={styles.innerShine}></div>
            <div className="flex items-center gap-4 mb-8 relative z-20">
               <User size={20} className={styles.accent}/>
               <h3 className="font-black text-sm uppercase tracking-widest">Authorized Identity</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-20">
               <div className={`${styles.item} p-5 rounded-2xl border flex items-center gap-4`}>
                  <Hash size={18} className="opacity-20"/>
                  <div>
                    <p className="text-[7px] font-black uppercase opacity-40">Registration ID</p>
                    <p className="text-[10px] font-black uppercase">{user.usn || "UNSET"}</p>
                  </div>
               </div>
               <div className={`${styles.item} p-5 rounded-2xl border flex items-center gap-4`}>
                  <Briefcase size={18} className="opacity-20"/>
                  <div>
                    <p className="text-[7px] font-black uppercase opacity-40">Operational Domain</p>
                    <p className="text-[10px] font-black uppercase">{user.domain || "GENERAL"}</p>
                  </div>
               </div>
            </div>
          </div>

          {/* SECURITY ACTIONS */}
          <div className={`${styles.card} p-8 rounded-[3.5rem] border flex items-center justify-around`}>
            <div className={styles.innerShine}></div>
            <button onClick={handleDisconnect} className="group flex flex-col items-center gap-2 relative z-20">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all bg-white/5 border border-white/5 group-hover:bg-amber-500 group-hover:text-black shadow-xl`}><Link2 size={20}/></div>
              <p className="text-[8px] font-black uppercase tracking-widest opacity-40">Sever Hub</p>
            </button>
            <button onClick={handleSignOut} className="group flex flex-col items-center gap-2 relative z-20">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all bg-white/5 border border-white/5 group-hover:bg-white group-hover:text-black shadow-xl`}><LogOut size={20}/></div>
              <p className="text-[8px] font-black uppercase tracking-widest opacity-40">Logout</p>
            </button>
            <button onClick={() => setShowDeleteModal(true)} className="group flex flex-col items-center gap-2 relative z-20">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all bg-red-500/10 border border-red-500/20 text-red-500 group-hover:bg-red-500 group-hover:text-white shadow-xl`}><Trash2 size={20}/></div>
              <p className="text-[8px] font-black uppercase tracking-widest opacity-40">Destroy</p>
            </button>
          </div>
        </div>
      </div>

      {/* --- PROTOCOL MODAL --- */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 backdrop-blur-3xl bg-black/60">
          <div className={`${styles.card} max-w-sm w-full p-12 rounded-[4rem] border border-red-500/20 text-center animate-in zoom-in duration-300`}>
            <ShieldAlert size={48} className="text-red-500 mx-auto mb-6 animate-pulse" />
            <h3 className="text-2xl font-black uppercase italic mb-2 tracking-tighter">Final Protocol</h3>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] mb-10 opacity-40">Identity destruction cannot be reversed.</p>
            <div className="space-y-4">
               <button onClick={handleDeleteAccount} className="w-full py-5 bg-red-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl">Confirm Wipe</button>
               <button onClick={() => setShowDeleteModal(false)} className="w-full py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest border border-white/10 opacity-40">Abort</button>
            </div>
          </div>
        </div>
      )}

      {/* 🏁 DOCK FOOTER */}
      <div className="flex justify-center pt-10 pb-12">
         <div className={`${styles.card} px-10 py-5 rounded-full border border-white/[0.08] flex items-center gap-6 shadow-2xl transition-all hover:-translate-y-1`}>
            <div className={styles.innerShine}></div>
            <ShieldCheck size={20} className={styles.accent}/>
            <p className="text-[10px] font-black uppercase italic tracking-[0.25em] opacity-40 text-center leading-none">
              Verified Identity Controller Active.
            </p>
         </div>
      </div>
    </div>
  );
}