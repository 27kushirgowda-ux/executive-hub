import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { 
  User, 
  Mail, 
  Building2, 
  ShieldCheck, 
  IdCard, 
  Phone,
  ArrowLeft,
  Edit3,
  Check,
  X,
  AlertCircle,
  Fingerprint,
  Globe,
  Zap
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MentorProfile({ dark }) {
  const navigate = useNavigate();
  
  // --- STATES ---
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    domain: "",
    phone: ""
  });

  // --- 🎨 💎 THE CRYSTAL CONSOLE ENGINE ---
  const styles = {
    card: dark 
      ? "bg-[#111111]/40 border-white/[0.08] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] backdrop-blur-3xl hover:border-amber-500/30 transition-all duration-700 relative overflow-hidden group" 
      : "bg-white/40 border-white shadow-[0_20px_50px_rgba(120,119,198,0.1)] backdrop-blur-3xl hover:border-purple-300 transition-all duration-700 relative overflow-hidden group",
    text: dark ? "text-white" : "text-[#1e1b4b]",
    sub: dark ? "text-white/20" : "text-slate-400",
    accent: dark ? "text-amber-500" : "text-purple-600",
    input: dark ? "bg-white/5 border-white/10 text-white placeholder:text-white/10 focus:border-amber-500/50" : "bg-white/60 border-white shadow-sm text-slate-900",
    innerShine: "absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-transparent pointer-events-none z-10",
    ambientGlow: dark 
      ? "fixed w-[600px] h-[600px] rounded-full bg-amber-500/10 blur-[150px] -z-20 pointer-events-none transition-all duration-1000"
      : "fixed w-[600px] h-[600px] rounded-full bg-purple-500/10 blur-[150px] -z-20 pointer-events-none transition-all duration-1000"
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (auth.currentUser) {
        const docRef = doc(db, "users", auth.currentUser.uid);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data();
          setProfile(data);
          setFormData({
            name: data.name || "",
            domain: data.domain || "",
            phone: data.phone || ""
          });
        }
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    const cleanPhone = formData.phone.replace(/\D/g, "");

    // 🛑 VALIDATION: India Mobile Standards
    if (cleanPhone.length !== 10) {
      setError("ENTER VALID 10-DIGIT INDIAN MOBILE");
      setTimeout(() => setError(""), 4000);
      return;
    }

    setLoading(true);
    try {
      const docRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(docRef, {
        name: formData.name,
        domain: formData.domain,
        phone: cleanPhone
      });
      
      setProfile({ ...profile, ...formData, phone: cleanPhone });
      setIsEditing(false);
      setError("");
    } catch (err) {
      setError("SYNC REFUSED. CHECK CONNECTION.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`w-full min-h-screen p-4 md:p-8 pt-10 flex flex-col space-y-10 animate-in fade-in duration-1000 ${styles.text}`}>
      
      {/* 🚨 AMBIENT GLOWS */}
      <div className={styles.ambientGlow} style={{ top: '-100px', right: '-100px' }}></div>
      <div className={styles.ambientGlow} style={{ bottom: '100px', left: '-100px' }}></div>

      {/* --- TOP NAV ACTIONS --- */}
      <div className="flex justify-between items-center px-4 relative z-20">
        <button 
          onClick={() => navigate(-1)}
          className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] opacity-30 hover:opacity-100 transition-all ${styles.text}`}
        >
          <ArrowLeft size={16} /> Back to Hub
        </button>

        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all hover:-translate-y-1 active:scale-95 shadow-2xl ${
              dark ? 'bg-white text-black hover:bg-amber-500' : 'bg-[#1e1b4b] text-white'
            }`}
          >
            <Edit3 size={14} /> Edit Identity
          </button>
        ) : (
          <div className="flex gap-4">
            <button 
              onClick={() => setIsEditing(false)}
              className={`${styles.card} p-4 rounded-2xl flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white`}
            >
              <X size={20} />
            </button>
            <button 
              onClick={handleSave}
              disabled={loading}
              className={`flex items-center gap-3 px-8 py-4 bg-green-600 rounded-2xl text-white text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-green-500/20`}
            >
              <Check size={14} /> {loading ? "Syncing..." : "Commit Changes"}
            </button>
          </div>
        )}
      </div>

      {/* --- MAIN HEADER CARD --- */}
      <div className={`${styles.card} p-10 md:p-16 rounded-[4rem] border flex flex-col md:flex-row items-center gap-10`}>
        <div className={styles.innerShine}></div>
        
        {/* Mentor Avatar */}
        <div className={`w-32 h-32 md:w-40 md:h-40 rounded-[3rem] flex items-center justify-center text-black text-5xl font-black shadow-2xl relative z-20 transition-transform hover:rotate-3 ${
          dark ? 'bg-amber-500 shadow-amber-500/20' : 'bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-purple-500/20'
        }`}>
          {formData.name?.charAt(0).toUpperCase() || "M"}
        </div>
        
        <div className="text-center md:text-left flex-1 z-20">
          {isEditing ? (
            <div className="mb-4">
              <p className={`text-[9px] font-black uppercase tracking-widest ${styles.sub} mb-2`}>Full Name</p>
              <input 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="text-4xl md:text-6xl font-black tracking-tighter bg-transparent border-b border-amber-500/30 outline-none w-full italic uppercase"
                placeholder="Enter Identity"
              />
            </div>
          ) : (
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter italic uppercase leading-none mb-4">
              {profile?.name || "Executive Mentor"}
            </h1>
          )}
          
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
             <div className={`px-5 py-2 rounded-full border border-amber-500/20 text-[10px] font-black uppercase tracking-widest ${styles.accent} bg-amber-500/5`}>
               Expertise: {profile?.domain || "General"}
             </div>
             <div className={`px-5 py-2 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest ${dark ? 'bg-white/5' : 'bg-black/5'}`}>
               Master Supervisor
             </div>
          </div>
        </div>
      </div>

      {/* --- ERROR FEEDBACK --- */}
      {error && (
        <div className="px-4 animate-bounce">
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-4 text-red-500">
            <AlertCircle size={20} />
            <p className="text-[10px] font-black uppercase tracking-[0.2em]">{error}</p>
          </div>
        </div>
      )}

      {/* --- DETAILS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-20">
        
        {/* PRIMARY INFO */}
        <div className={`${styles.card} p-10 md:p-12 rounded-[3.5rem] border space-y-10`}>
          <div className={styles.innerShine}></div>
          <div className="flex items-center gap-4 opacity-40">
            <Fingerprint size={20}/>
            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] italic">Identity Credentials</h3>
          </div>

          <div className="space-y-8">
            <div className="space-y-2">
              <p className={`${styles.sub} text-[9px] font-black uppercase tracking-widest flex items-center gap-2`}><Mail size={14}/> Communication Hub</p>
              <p className="font-black text-sm uppercase tracking-tight opacity-80 truncate">{auth.currentUser?.email}</p>
            </div>

            <div className="space-y-2">
              <p className={`${styles.sub} text-[9px] font-black uppercase tracking-widest flex items-center gap-2`}><Building2 size={14}/> Oversight Domain</p>
              {isEditing ? (
                <input 
                  value={formData.domain}
                  onChange={(e) => setFormData({...formData, domain: e.target.value})}
                  className={`w-full p-4 rounded-2xl border outline-none font-black text-xs uppercase tracking-widest ${styles.input}`}
                  placeholder="e.g. SOFTWARE ARCHITECTURE"
                />
              ) : (
                <p className="font-black text-sm uppercase tracking-tight">{profile?.domain || "NOT SET"}</p>
              )}
            </div>
          </div>
        </div>

        {/* SECURE DATA */}
        <div className={`${styles.card} p-10 md:p-12 rounded-[3.5rem] border space-y-10`}>
          <div className={styles.innerShine}></div>
          <div className="flex items-center gap-4 opacity-40">
            <Globe size={20}/>
            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] italic">Access & Security</h3>
          </div>

          <div className="space-y-8">
            <div className="space-y-2">
              <p className={`${styles.sub} text-[9px] font-black uppercase tracking-widest flex items-center gap-2`}><Phone size={14}/> Mobile (India +91)</p>
              {isEditing ? (
                <div className="flex items-center gap-4">
                  <span className="text-xs font-black opacity-30">+91</span>
                  <input 
                    maxLength={10}
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, "")})}
                    className={`w-full p-4 rounded-2xl border outline-none font-black text-xs tracking-[0.3em] ${styles.input}`}
                    placeholder="00000 00000"
                  />
                </div>
              ) : (
                <p className="font-black text-sm tracking-[0.2em]">
                  {profile?.phone ? `+91 ${profile.phone}` : "SECURED / NOT SET"}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <p className={`${styles.sub} text-[9px] font-black uppercase tracking-widest flex items-center gap-2`}><IdCard size={14}/> System Executive ID</p>
              <p className="text-[11px] font-mono font-black opacity-40 truncate">{auth.currentUser?.uid}</p>
            </div>
          </div>
        </div>

      </div>

      {/* 🏁 DOCK FOOTER */}
      <div className="flex justify-center pt-10 pb-12 relative z-20">
         <div className={`${styles.card} px-10 py-6 rounded-full border border-white/[0.08] flex items-center gap-6 shadow-2xl transition-all hover:-translate-y-1`}>
            <div className={styles.innerShine}></div>
            <ShieldCheck size={24} className={styles.accent}/>
            <p className="text-[10px] font-black uppercase italic tracking-[0.25em] opacity-40 text-center leading-none">
              Verified Mentor Protocol Enabled.
            </p>
         </div>
      </div>
    </div>
  );
}