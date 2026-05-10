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
  CheckCircle2,
  Phone,
  Clock,
  Eye,
  EyeOff,
  Zap,
  ShieldCheck,
  Building2,
  Save
} from "lucide-react";

export default function MentorSettings({ dark, setDark }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saveMessage, setSaveMessage] = useState("");

  const [deadline, setDeadline] = useState("18:00");
  const [mobile, setMobile] = useState("");
  const [showMobile, setShowMobile] = useState(true);

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
        setShowMobile(data.showMobile !== false);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const autoSync = async (updates) => {
    try {
      await updateDoc(doc(db, "users", auth.currentUser.uid), updates);
      setSaveMessage("SYSTEM DATA SYNCHRONIZED ✅");
      setTimeout(() => setSaveMessage(""), 2000);
    } catch (err) {
      console.error("Auto-sync failed:", err);
    }
  };

  const togglePrivacy = () => {
    const newVal = !showMobile;
    setShowMobile(newVal);
    autoSync({ showMobile: newVal });
  };

  const updateDeadline = (val) => {
    setDeadline(val);
    autoSync({ uploadDeadline: val });
  };

  const updateMobile = (val) => {
    setMobile(val);
    autoSync({ mobile: val });
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
      <div className={styles.ambientGlow} style={{ top: '-100px', right: '-100px' }}></div>
      <div className={styles.ambientGlow} style={{ bottom: '100px', left: '-100px' }}></div>

      <div className="relative z-20">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter italic uppercase leading-none">
          Hub <span className={styles.accent}>Settings</span>
        </h1>
        <p className={`text-[10px] font-black uppercase tracking-[0.8em] ${styles.sub} mt-3`}>
          Executive Preferences & Oversight Matrix
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-20">
        <div className="lg:col-span-7 space-y-8">
          <div className={`${styles.card} p-10 rounded-[3.5rem] border`}>
            <div className={styles.innerShine}></div>
            <div className="flex items-center gap-4 mb-8 opacity-40">
               <Building2 size={18}/>
               <h3 className="font-black text-[10px] uppercase tracking-[0.3em]">Corporate Credentials</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-1">
                  <p className="text-[9px] font-black uppercase opacity-30">Full Identity</p>
                  <p className="text-sm font-bold uppercase italic tracking-tight">{user?.name}</p>
               </div>
               <div className="space-y-1">
                  <p className="text-[9px] font-black uppercase opacity-30">Access Role</p>
                  <p className={`text-sm font-bold uppercase italic tracking-tight ${styles.accent}`}>Executive {user?.role}</p>
               </div>
               <div className="space-y-1">
                  <p className="text-[9px] font-black uppercase opacity-30">Department</p>
                  <p className="text-sm font-bold uppercase italic tracking-tight">{user?.domain}</p>
               </div>
               <div className="space-y-1">
                  <p className="text-[9px] font-black uppercase opacity-30">Network ID</p>
                  <p className="text-[10px] font-mono opacity-40 truncate">{auth.currentUser?.uid}</p>
               </div>
            </div>
          </div>

          <div className={`${styles.card} p-10 rounded-[3.5rem] border`}>
            <div className={styles.innerShine}></div>
            <div className="flex items-center justify-between mb-10 relative z-20">
               <div className="flex items-center gap-4">
                 <Clock size={20} className={styles.accent}/>
                 <h3 className="font-black text-sm uppercase tracking-widest">Upload Window</h3>
               </div>
            </div>
            <input 
              type="time"
              value={deadline}
              onChange={(e) => updateDeadline(e.target.value)}
              className={`w-full p-6 rounded-[1.8rem] border outline-none font-black text-2xl tracking-tighter ${styles.input}`}
            />
          </div>
        </div>

        <div className="lg:col-span-5 space-y-8">
          <div className={`${styles.card} p-10 rounded-[3.5rem] border`}>
            <div className={styles.innerShine}></div>
            <div className="flex items-center justify-between mb-8 relative z-20">
               <h3 className="font-black text-sm uppercase tracking-widest italic opacity-40">Privacy Matrix</h3>
               <button 
                 onClick={togglePrivacy}
                 className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${showMobile ? 'border-green-500/20 text-green-500 bg-green-500/5' : 'border-red-500/20 text-red-500 bg-red-500/5'}`}
               >
                 {showMobile ? <Eye size={14}/> : <EyeOff size={14}/>}
                 <span className="text-[9px] font-black uppercase tracking-widest">{showMobile ? 'Public' : 'Secured'}</span>
               </button>
            </div>
            <div className="relative">
              <Phone size={16} className="absolute left-5 top-1/2 -translate-y-1/2 opacity-30"/>
              <input 
                type="tel"
                value={mobile}
                onChange={(e) => updateMobile(e.target.value)}
                className={`w-full p-5 pl-14 rounded-2xl border outline-none font-black text-xs tracking-widest ${styles.input}`}
              />
            </div>
          </div>

          <div className={`${styles.card} p-8 rounded-[2.5rem] border flex items-center justify-between`}>
            {/* 🎯 FIXED LINE BELOW: Changed 'theme' to 'dark' */}
            <div className={dark ? styles.innerShine : ''}></div>
            <div className="flex items-center gap-4 relative z-20">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${dark ? 'bg-amber-500/10 text-amber-500' : 'bg-purple-600 text-white'}`}>
                {dark ? <Moon size={22} /> : <Sun size={22} />}
              </div>
              <h3 className="font-black text-[10px] uppercase tracking-widest">Interface</h3>
            </div>
            <button onClick={() => setDark(!dark)} className={`w-16 h-8 rounded-full relative transition-all duration-500 p-1 z-20 ${dark ? 'bg-amber-500' : 'bg-purple-600'}`}>
              <div className={`w-6 h-6 bg-white rounded-full shadow-xl transition-all duration-500 flex items-center justify-center ${dark ? 'translate-x-8' : 'translate-x-0'}`}>
                  {dark ? <Moon size={12} className="text-amber-500" /> : <Sun size={12} className="text-purple-500" />}
              </div>
            </button>
          </div>

          <div className="flex gap-4">
             <button onClick={handleSignOut} className={`${styles.card} flex-1 p-6 rounded-[2rem] border flex flex-col items-center gap-2 hover:bg-white/5`}>
               <LogOut size={20} className="opacity-40"/>
               <span className="text-[8px] font-black uppercase opacity-40">Sign Out</span>
             </button>
             <button onClick={() => setShowDeleteModal(true)} className={`${styles.card} flex-1 p-6 rounded-[2rem] border border-red-500/10 flex flex-col items-center gap-2 hover:bg-red-500 hover:text-white`}>
               <Trash2 size={20} className="text-red-500 group-hover:text-white"/>
               <span className="text-[8px] font-black uppercase text-red-500 group-hover:text-white">Destroy</span>
             </button>
          </div>
        </div>
      </div>

      {saveMessage && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[1000] animate-in slide-in-from-bottom-10 duration-700">
            <div className={`px-10 py-5 rounded-full border backdrop-blur-3xl shadow-2xl flex items-center gap-4 ${dark ? 'bg-amber-500 border-amber-400 text-black' : 'bg-purple-600 border-purple-500 text-white'}`}>
              <Zap size={20} className="animate-pulse"/>
              <span className="text-[10px] font-black uppercase tracking-widest">{saveMessage}</span>
            </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-6 backdrop-blur-3xl bg-black/60">
          <div className={`${styles.card} max-w-sm w-full p-12 rounded-[4rem] border border-red-500/20 text-center animate-in zoom-in duration-300`}>
            <ShieldAlert size={48} className="text-red-500 mx-auto mb-6 animate-pulse" />
            <h3 className="text-2xl font-black uppercase italic mb-2 tracking-tighter">Final Protocol</h3>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] mb-10 opacity-40">Permanently wipes Console and severs all intern mappings.</p>
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