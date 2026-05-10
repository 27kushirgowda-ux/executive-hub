import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, onSnapshot, updateDoc, deleteDoc } from "firebase/firestore";
import { signOut, deleteUser, sendPasswordResetEmail, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { 
  Sun, 
  Moon, 
  LogOut, 
  Trash2, 
  ShieldAlert, 
  Key, 
  CheckCircle2,
  Hash,
  Briefcase,
  Timer,
  ShieldCheck,
  AlertTriangle,
  Mail,
  Fingerprint,
  Zap
} from "lucide-react";

export default function InternSettings({ dark, setDark }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: "", text: "" });

  // --- 🎨 💎 THE CRYSTAL CONSOLE ENGINE ---
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

  // --- 🎯 IDENTITY SYNC PROTOCOL ---
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const unsubData = onSnapshot(doc(db, "users", firebaseUser.uid), (snap) => {
          if (snap.exists()) {
            setUser(snap.data());
          }
          setLoading(false);
        }, (err) => {
          console.error("Firestore Error:", err);
          setLoading(false);
        });
        return () => unsubData();
      } else {
        navigate("/Login");
        setLoading(false);
      }
    });
    return () => unsubAuth();
  }, [navigate]);

  const triggerFeedback = (type, text) => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback({ type: "", text: "" }), 4000);
  };

  const handleSignOut = async () => {
    await signOut(auth);
    navigate("/Login");
  };

  const handleUpdateDuration = async (days) => {
    try {
      await updateDoc(doc(db, "users", auth.currentUser.uid), { internshipDuration: days });
      triggerFeedback("success", `PROTOCOL UPDATED: ${days} DAY TENURE`);
    } catch {
      triggerFeedback("error", "SYSTEM REFUSAL: UPDATE FAILED");
    }
  };

  const handlePasswordReset = async () => {
    try {
      await sendPasswordResetEmail(auth, user.email);
      triggerFeedback("success", "RESET KEY DISPATCHED TO INBOX");
    } catch {
      triggerFeedback("error", "DISPATCH REFUSED: CHECK NETWORK");
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
    } catch {
      triggerFeedback("error", "SECURITY PROTOCOL: RE-LOGIN REQUIRED");
      setShowDeleteModal(false);
    }
  };

  // --- 🔒 LOADING GUARD ---
  if (loading) {
    return (
      <div className={`h-screen w-full flex items-center justify-center ${dark ? 'bg-[#0a0a0a]' : 'bg-slate-50'}`}>
        <div className={`w-12 h-12 border-4 border-t-transparent rounded-full animate-spin ${dark ? 'border-amber-500 shadow-[0_0_15px_amber]' : 'border-purple-600'}`}></div>
      </div>
    );
  }

  // --- 🛑 IDENTITY GUARD ---
  if (!user) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center p-10 text-center">
        <ShieldAlert size={48} className="text-red-500 mb-4 opacity-20" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Identity Not Synced</p>
        <button onClick={() => navigate("/Login")} className="mt-6 underline text-[10px] font-black uppercase">Initialize Re-Auth</button>
      </div>
    );
  }

  return (
    <div className={`w-full min-h-screen p-4 md:p-8 flex flex-col space-y-10 animate-in fade-in duration-1000 ${styles.text}`}>
      
      <div className={styles.ambientGlow} style={{ top: '-100px', right: '-100px' }}></div>
      <div className={styles.ambientGlow} style={{ bottom: '100px', left: '-100px' }}></div>

      {/* --- FEEDBACK TOAST --- */}
      {feedback.text && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-sm px-6 animate-in slide-in-from-top duration-500">
           <div className={`p-5 rounded-2xl border backdrop-blur-3xl flex items-center gap-4 shadow-2xl ${
             feedback.type === "error" ? "bg-red-500/10 border-red-500/20 text-red-500" : "bg-green-500/10 border-green-500/20 text-green-500"
           }`}>
             {feedback.type === "error" ? <AlertTriangle size={18}/> : <CheckCircle2 size={18}/>}
             <p className="text-[9px] font-black uppercase tracking-[0.2em]">{feedback.text}</p>
           </div>
        </div>
      )}

      {/* --- HEADER --- */}
      <div className="relative z-20">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter italic uppercase leading-none">
          System <span className={styles.accent}>Settings</span>
        </h1>
        <p className={`text-[10px] font-black uppercase tracking-[0.8em] ${styles.sub} mt-3`}>
          Identity Control & Security Configuration
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-20">
        
        {/* --- LEFT: VISUALS & DURATION --- */}
        <div className="lg:col-span-7 space-y-8">
          
          <div className={`${styles.card} p-8 md:p-10 rounded-[3.5rem] border flex items-center justify-between`}>
            <div className={styles.innerShine}></div>
            <div className="flex items-center gap-6 relative z-20">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${dark ? 'bg-amber-500/10 text-amber-500' : 'bg-purple-600 text-white shadow-lg'}`}>
                {dark ? <Moon size={28} /> : <Sun size={28} />}
              </div>
              <div>
                <h3 className="font-black text-sm uppercase tracking-widest">Interface Mode</h3>
                <p className={`text-[9px] font-bold uppercase ${styles.sub}`}>Switch Visual Environment</p>
              </div>
            </div>
            <button onClick={() => setDark(!dark)} className={`w-16 h-8 rounded-full relative transition-all duration-500 p-1 z-20 ${dark ? 'bg-amber-500' : 'bg-purple-600'} shadow-inner`}>
              <div className={`w-6 h-6 bg-white rounded-full shadow-xl transition-all duration-500 flex items-center justify-center ${dark ? 'translate-x-8' : 'translate-x-0'}`}>
                 {dark ? <Moon size={12} className="text-amber-500" /> : <Sun size={12} className="text-purple-500" />}
              </div>
            </button>
          </div>

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
                    ? (dark ? 'bg-amber-500 text-black border-amber-400 shadow-xl' : 'bg-purple-600 text-white border-purple-500 shadow-xl shadow-purple-500/20') 
                    : (dark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200 text-slate-400')
                  }`}
                >
                  {days} Days
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* --- RIGHT: CLEARANCE & SECURITY --- */}
        <div className="lg:col-span-5 space-y-8">
          
          <div className={`${styles.card} p-8 md:p-10 rounded-[3.5rem] border`}>
            <div className={styles.innerShine}></div>
            <div className="flex items-center justify-between mb-8 relative z-20">
               <div className="flex items-center gap-4">
                 <ShieldCheck size={20} className={styles.accent}/>
                 <h3 className="font-black text-sm uppercase tracking-widest">Clearance</h3>
               </div>
               <div className={`px-4 py-1.5 rounded-full border border-green-500/20 bg-green-500/5 text-green-500 text-[8px] font-black uppercase tracking-widest animate-pulse`}>Active Profile</div>
            </div>
            
            <div className="space-y-4 relative z-20">
               <div className={`${styles.item} p-5 rounded-2xl border flex items-center gap-4`}>
                  <Mail size={18} className="opacity-20"/>
                  <div className="min-w-0">
                    <p className="text-[7px] font-black uppercase opacity-40">System Email</p>
                    <p className="text-[10px] font-black uppercase truncate">{user.email}</p>
                  </div>
               </div>
               <div className={`${styles.item} p-5 rounded-2xl border flex items-center gap-4`}>
                  <Fingerprint size={18} className="opacity-20"/>
                  <div>
                    <p className="text-[7px] font-black uppercase opacity-40">Registry ID</p>
                    <p className="text-[10px] font-black uppercase tracking-widest">{user.usn || "N/A"}</p>
                  </div>
               </div>
            </div>
          </div>

          <div className={`${styles.card} p-8 rounded-[3rem] border flex items-center justify-between relative`}>
            <div className={styles.innerShine}></div>
            <button onClick={handlePasswordReset} className="group flex flex-col items-center gap-3 relative z-20">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all bg-white/5 border border-white/5 group-hover:bg-blue-500 group-hover:text-white shadow-xl`}><Key size={22}/></div>
              <p className="text-[8px] font-black uppercase tracking-widest opacity-40">Access Key</p>
            </button>
            <button onClick={handleSignOut} className="group flex flex-col items-center gap-3 relative z-20">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all bg-white/5 border border-white/5 group-hover:bg-white group-hover:text-black shadow-xl`}><LogOut size={22}/></div>
              <p className="text-[8px] font-black uppercase tracking-widest opacity-40">Terminate</p>
            </button>
            <button onClick={() => setShowDeleteModal(true)} className="group flex flex-col items-center gap-3 relative z-20">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all bg-red-500/10 border border-red-500/20 text-red-500 group-hover:bg-red-500 group-hover:text-white shadow-xl`}><Trash2 size={22}/></div>
              <p className="text-[8px] font-black uppercase tracking-widest opacity-40">Destroy</p>
            </button>
          </div>
        </div>
      </div>

      {/* --- FOOTER --- */}
      <div className="flex justify-center pt-10 pb-12 relative z-20">
         <div className={`${styles.card} px-10 py-6 rounded-full border border-white/[0.08] flex items-center gap-6 shadow-2xl transition-all hover:-translate-y-1`}>
            <div className={styles.innerShine}></div>
            <ShieldCheck size={24} className={styles.accent}/>
            <p className="text-[10px] font-black uppercase italic tracking-[0.25em] opacity-40 text-center leading-none">
              Verified Personnel Control Active. Secure Sync Enabled.
            </p>
         </div>
      </div>

      {/* --- DELETE MODAL --- */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-6 backdrop-blur-3xl bg-black/60">
          <div className={`${styles.card} max-w-sm w-full p-12 rounded-[4rem] border border-red-500/20 text-center animate-in zoom-in duration-300`}>
            <ShieldAlert size={48} className="text-red-500 mx-auto mb-6 animate-pulse" />
            <h3 className="text-2xl font-black uppercase italic mb-2 tracking-tighter">Final Protocol</h3>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] mb-10 opacity-40 leading-relaxed">Identity destruction is permanent. All task logs and mentor mappings will be purged.</p>
            <div className="space-y-4">
               <button onClick={handleDeleteAccount} className="w-full py-5 bg-red-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl">Confirm Wipe</button>
               <button onClick={() => setShowDeleteModal(false)} className="w-full py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest border border-white/10 opacity-40">Abort</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}