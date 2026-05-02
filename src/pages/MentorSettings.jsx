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
  X,
  CheckCircle2,
  Phone,
  Clock,
  Eye,
  EyeOff,
  Zap,
  ShieldCheck,
  Save
} from "lucide-react";

export default function MentorSettings({ dark, setDark }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saveMessage, setSaveMessage] = useState("");

  // LOCAL FORM STATES
  const [deadline, setDeadline] = useState("18:00");
  const [mobile, setMobile] = useState("");
  const [showMobile, setShowMobile] = useState(true);

  // --- 🎨 💎 THE CRYSTAL CONSOLE ENGINE ---
  const styles = {
    card: dark 
      ? "bg-[#111111]/40 border-white/[0.08] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] backdrop-blur-3xl hover:border-amber-500/30 transition-all duration-700 relative overflow-hidden group" 
      : "bg-white/40 border-white shadow-[0_20px_50px_rgba(120,119,198,0.1)] backdrop-blur-3xl hover:border-purple-300 transition-all duration-700 relative overflow-hidden group",
    text: dark ? "text-white" : "text-[#1e1b4b]",
    sub: dark ? "text-white/20" : "text-slate-400",
    accent: dark ? "text-amber-500" : "text-purple-600",
    input: dark ? "bg-white/5 border-white/10 text-white placeholder:text-white/10 focus:border-amber-500/40" : "bg-white/60 border-white shadow-sm text-slate-900",
    innerShine: "absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-transparent pointer-events-none z-10",
    ambientGlow: dark 
      ? "fixed w-[600px] h-[600px] rounded-full bg-amber-500/10 blur-[150px] -z-20 pointer-events-none"
      : "fixed w-[600px] h-[600px] rounded-full bg-purple-500/10 blur-[150px] -z-20 pointer-events-none"
  };

  useEffect(() => {
    if (!auth.currentUser) return;
    const unsub = onSnapshot(doc(db, "users", auth.currentUser.uid), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setUser(data);
        setDeadline(data.uploadDeadline || "18:00");
        setMobile(data.mobile || "");
        setShowMobile(data.showMobile !== false); // Default to true
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleGlobalUpdate = async () => {
    try {
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        uploadDeadline: deadline,
        mobile: mobile,
        showMobile: showMobile
      });
      setSaveMessage("HUB DIRECTIVES SYNCHRONIZED ✅");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (err) { alert("System Refusal: Sync failed."); }
  };

  const handleSignOut = async () => { await signOut(auth); navigate("/Login"); };

  const handleDeleteAccount = async () => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        await deleteDoc(doc(db, "users", currentUser.uid));
        await deleteUser(currentUser);
        navigate("/Signup");
      }
    } catch (err) { alert("Security Protocol: Re-login required."); }
  };

  if (loading) return null;

  return (
    <div className={`w-full min-h-screen p-4 md:p-8 flex flex-col space-y-10 animate-in fade-in duration-1000 ${styles.text}`}>
      
      {/* 🚨 AMBIENT GLOWS */}
      <div className={styles.ambientGlow} style={{ top: '-100px', right: '-100px' }}></div>
      <div className={styles.ambientGlow} style={{ bottom: '100px', left: '-100px' }}></div>

      {/* --- HEADER --- */}
      <div className="relative z-20">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter italic uppercase leading-none">
          Hub <span className={styles.accent}>Settings</span>
        </h1>
        <p className={`text-[10px] font-black uppercase tracking-[0.8em] ${styles.sub} mt-3`}>
          Executive Preferences & Oversight Matrix
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-20">
        
        {/* --- 👈 LEFT: DIRECTIVES & APPEARANCE (7 COLS) --- */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* 🎯 OPERATIONAL DIRECTIVES (UPLOAD TIME) */}
          <div className={`${styles.card} p-10 rounded-[3.5rem] border`}>
            <div className={styles.innerShine}></div>
            <div className="flex items-center justify-between mb-10 relative z-20">
               <div className="flex items-center gap-4">
                 <Clock size={20} className={styles.accent}/>
                 <h3 className="font-black text-sm uppercase tracking-widest">Upload Window</h3>
               </div>
               <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-white/10 ${dark ? 'bg-white/5' : 'bg-black/5'}`}>Daily Cut-off</span>
            </div>
            
            <div className="space-y-6 relative z-20">
               <p className={`text-[10px] font-black uppercase tracking-widest opacity-40 mb-2`}>Set Intern Dispatch Deadline</p>
               <input 
                 type="time"
                 value={deadline}
                 onChange={(e) => setDeadline(e.target.value)}
                 className={`w-full p-6 rounded-[1.8rem] border outline-none font-black text-2xl tracking-tighter ${styles.input}`}
               />
               <p className={`text-[9px] font-bold italic opacity-30`}>* Portals will automatically lock for all mapped interns at this time.</p>
            </div>
          </div>

          {/* THEME TOGGLE */}
          <div className={`${styles.card} p-10 rounded-[3.5rem] border flex items-center justify-between`}>
            <div className={styles.innerShine}></div>
            <div className="flex items-center gap-6 relative z-20">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${dark ? 'bg-amber-500/10 text-amber-500 shadow-xl' : 'bg-purple-600 text-white shadow-2xl'}`}>
                {dark ? <Moon size={28} /> : <Sun size={28} />}
              </div>
              <div>
                <h3 className="font-black text-sm uppercase tracking-widest">Interface Mode</h3>
                <p className={`text-[9px] font-bold uppercase ${styles.sub}`}>Switch Console Environment</p>
              </div>
            </div>
            <button onClick={() => setDark(!dark)} className={`w-20 h-10 rounded-full relative transition-all duration-500 p-1.5 z-20 ${dark ? 'bg-amber-500' : 'bg-purple-600'} shadow-inner`}>
              <div className={`w-7 h-7 bg-white rounded-full shadow-xl transition-all duration-500 flex items-center justify-center ${dark ? 'translate-x-10' : 'translate-x-0'}`}>
                 {dark ? <Moon size={14} className="text-amber-500" /> : <Sun size={14} className="text-purple-500" />}
              </div>
            </button>
          </div>
        </div>

        {/* --- 👉 RIGHT: IDENTITY & PRIVACY (5 COLS) --- */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* 🛡️ PRIVACY MATRIX (MOBILE SETTINGS) */}
          <div className={`${styles.card} p-10 rounded-[3.5rem] border`}>
            <div className={styles.innerShine}></div>
            <div className="flex items-center justify-between mb-8 relative z-20">
               <h3 className="font-black text-sm uppercase tracking-widest italic opacity-40">Privacy Matrix</h3>
               <button 
                 onClick={() => setShowMobile(!showMobile)}
                 className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${showMobile ? 'border-green-500/20 text-green-500 bg-green-500/5' : 'border-red-500/20 text-red-500 bg-red-500/5'}`}
               >
                 {showMobile ? <Eye size={14}/> : <EyeOff size={14}/>}
                 <span className="text-[9px] font-black uppercase tracking-widest">{showMobile ? 'Public' : 'Secured'}</span>
               </button>
            </div>

            <div className="space-y-6 relative z-20">
               <div className="space-y-2">
                 <p className={`text-[9px] font-black uppercase tracking-widest ${styles.sub}`}>Contact Identification</p>
                 <div className="relative">
                    <Phone size={16} className="absolute left-5 top-1/2 -translate-y-1/2 opacity-30"/>
                    <input 
                      type="tel"
                      placeholder="ENTER HUB CONTACT..."
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      className={`w-full p-5 pl-14 rounded-2xl border outline-none font-black text-xs tracking-widest ${styles.input}`}
                    />
                 </div>
               </div>
               <p className="text-[9px] font-bold italic opacity-20">When 'Secured', interns will see "SECURED" on their Hub profile instead of your digits.</p>
            </div>
          </div>

          {/* SYSTEM SYNC BUTTON */}
          <button 
            onClick={handleGlobalUpdate}
            className={`w-full py-8 rounded-[2.5rem] border group relative overflow-hidden transition-all active:scale-95 ${dark ? 'bg-white text-black hover:bg-amber-500' : 'bg-[#1e1b4b] text-white shadow-2xl'}`}
          >
            <div className={styles.innerShine}></div>
            <div className="flex flex-col items-center gap-2 relative z-20">
              <Save size={24}/>
              <span className="text-[12px] font-black uppercase tracking-[0.4em]">Synchronize Hub</span>
            </div>
          </button>

          {/* DANGER AREA */}
          <div className="flex gap-4">
             <button onClick={handleSignOut} className={`${styles.card} flex-1 p-6 rounded-[2rem] border flex flex-col items-center gap-2 hover:bg-white/5`}>
               <LogOut size={20} className="opacity-40"/>
               <span className="text-[8px] font-black uppercase opacity-40">Terminate Session</span>
             </button>
             <button onClick={() => setShowDeleteModal(true)} className={`${styles.card} flex-1 p-6 rounded-[2rem] border border-red-500/10 flex flex-col items-center gap-2 hover:bg-red-500 hover:text-white`}>
               <Trash2 size={20} className="text-red-500 group-hover:text-white"/>
               <span className="text-[8px] font-black uppercase text-red-500 group-hover:text-white">Destroy Console</span>
             </button>
          </div>
        </div>
      </div>

      {/* --- SAVE TOAST --- */}
      {saveMessage && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[1000] animate-in slide-in-from-bottom-10 duration-700">
           <div className={`px-10 py-5 rounded-full border backdrop-blur-3xl shadow-2xl flex items-center gap-4 ${dark ? 'bg-amber-500 border-amber-400 text-black' : 'bg-purple-600 border-purple-500 text-white'}`}>
             <CheckCircle2 size={20}/>
             <span className="text-[10px] font-black uppercase tracking-widest">{saveMessage}</span>
           </div>
        </div>
      )}

      {/* --- PROTOCOL MODAL --- */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-6 backdrop-blur-3xl bg-black/60">
          <div className={`${styles.card} max-w-sm w-full p-12 rounded-[4rem] border border-red-500/20 text-center animate-in zoom-in duration-300`}>
            <ShieldAlert size={48} className="text-red-500 mx-auto mb-6 animate-pulse" />
            <h3 className="text-2xl font-black uppercase italic mb-2 tracking-tighter">Final Protocol</h3>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] mb-10 opacity-40">This action permanently wipes your Hub Console and severs all intern mappings.</p>
            <div className="space-y-4">
               <button onClick={handleDeleteAccount} className="w-full py-5 bg-red-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl">Confirm Wipe</button>
               <button onClick={() => setShowDeleteModal(false)} className="w-full py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest border border-white/10 opacity-40">Abort</button>
            </div>
          </div>
        </div>
      )}

      {/* 🏁 DOCK FOOTER */}
      <div className="flex justify-center pt-10 pb-12">
         <div className={`${styles.card} px-10 py-6 rounded-full border border-white/[0.08] flex items-center gap-6 shadow-2xl transition-all hover:-translate-y-1`}>
            <div className={styles.innerShine}></div>
            <ShieldCheck size={24} className={styles.accent}/>
            <p className="text-[10px] font-black uppercase italic tracking-[0.25em] opacity-40 text-center">Verified Executive Oversight Credentials Active.</p>
         </div>
      </div>
    </div>
  );
}