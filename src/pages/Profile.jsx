import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot, updateDoc } from "firebase/firestore"; // 🎯 Removed getDoc, added onSnapshot
import { useNavigate } from "react-router-dom";
import { 
  Phone, 
  Briefcase, 
  BookOpen, 
  User as UserIcon, 
  Edit2, 
  Save, 
  X, 
  Mail, 
  GraduationCap,
  ShieldCheck,
  Zap,
  Link2,
  Fingerprint,
  Globe
} from "lucide-react";

export default function Profile({ dark }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [mentorData, setMentorData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    college: "",
    domain: "",
    branch: ""
  });

  // --- 🎨 💎 THE CRYSTAL CONSOLE ENGINE ---
  const styles = {
    card: dark 
      ? "bg-[#0c0c0c]/40 border-white/[0.08] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] backdrop-blur-3xl hover:border-amber-500/40 transition-all duration-700 relative overflow-hidden group" 
      : "bg-white/40 border-white shadow-[0_20px_50px_rgba(120,119,198,0.1)] backdrop-blur-3xl hover:border-purple-300 transition-all duration-700 relative overflow-hidden group",
    text: dark ? "text-white" : "text-[#1e1b4b]",
    sub: dark ? "text-white/20" : "text-slate-400",
    accent: dark ? "text-amber-500" : "text-purple-600",
    input: dark ? "bg-white/5 border-white/10 text-white placeholder:text-white/10" : "bg-white/60 border-white shadow-sm text-slate-900",
    innerShine: "absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-transparent pointer-events-none z-10",
    ambientGlow: dark 
      ? "fixed w-[600px] h-[600px] rounded-full bg-amber-500/10 blur-[150px] -z-20 pointer-events-none"
      : "fixed w-[600px] h-[600px] rounded-full bg-purple-500/10 blur-[150px] -z-20 pointer-events-none"
  };

  useEffect(() => {
    let unsubMentor = () => {}; // Cleanup variable

    const unsubAuth = onAuthStateChanged(auth, (u) => {
      if (!u) return navigate("/Login");

      // 1. Listen to Intern's Profile
      const unsubUser = onSnapshot(doc(db, "users", u.uid), (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setUser(data);
          setFormData({
            name: data.name || "",
            mobile: data.mobile || "",
            college: data.college || "",
            domain: data.domain || "",
            branch: data.branch || ""
          });

          // 🎯 2. REAL-TIME MENTOR PRIVACY BRIDGE
          if (data.mentorId && data.mentorId.trim() !== "") {
            // We create a live listener for the mentor's document
            unsubMentor = onSnapshot(doc(db, "users", data.mentorId), (mSnap) => {
              if (mSnap.exists()) {
                setMentorData(mSnap.data());
              } else {
                setMentorData({ name: "Hub Unavailable", email: "N/A", mobile: "N/A", showMobile: false });
              }
            });
          } else {
            setMentorData(null);
          }
        }
        setLoading(false);
      });

      return () => { unsubUser(); unsubMentor(); };
    });
    return () => unsubAuth();
  }, [navigate]);

  const handleSave = async () => {
    if (!auth.currentUser) return;
    setIsSaving(true);
    try {
      await updateDoc(doc(db, "users", auth.currentUser.uid), { ...formData });
      setSaveMessage("Identity Synchronized ✅");
      setIsEditing(false);
    } catch (err) { setSaveMessage("Sync Error ❌"); }
    finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(""), 3000);
    }
  };

  if (loading) return null;

  return (
    <div className={`w-full min-h-screen p-4 md:p-8 pt-10 flex flex-col space-y-10 animate-in fade-in duration-1000 ${styles.text}`}>
      
      <div className={styles.ambientGlow} style={{ top: '-100px', left: '-100px' }}></div>
      <div className={styles.ambientGlow} style={{ bottom: '100px', right: '-100px' }}></div>

      {/* --- HEADER CARD --- */}
      <div className={`${styles.card} p-10 md:p-14 rounded-[4rem] border flex flex-col md:flex-row items-center gap-10`}>
        <div className={styles.innerShine}></div>
        <div className={`w-32 h-32 md:w-40 md:h-40 rounded-[3rem] flex items-center justify-center text-5xl font-black shadow-2xl relative z-20 transition-transform hover:rotate-3 ${
          dark ? 'bg-amber-500 text-black' : 'bg-gradient-to-br from-pink-500 to-purple-600 text-white'
        }`}>
          {formData.name?.charAt(0).toUpperCase() || "U"}
        </div>

        <div className="flex-1 text-center md:text-left relative z-20">
          <p className={`text-[10px] font-black uppercase tracking-[0.6em] ${styles.sub} mb-4`}>User Identity Console</p>
          <h2 className="text-5xl md:text-6xl font-black tracking-tighter italic uppercase leading-none mb-4">{formData.name || "Candidate"}</h2>
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
             <div className={`px-4 py-1.5 rounded-full border border-white/10 text-[9px] font-black uppercase tracking-widest ${dark ? 'bg-white/5' : 'bg-black/5'}`}>
               Executive {user?.role || "Intern"}
             </div>
             <div className={`px-4 py-1.5 rounded-full border border-amber-500/20 text-[9px] font-black uppercase tracking-widest ${styles.accent} bg-amber-500/5`}>
               {formData.domain || "Domain Pending"}
             </div>
          </div>
          {saveMessage && <p className="mt-6 text-[10px] font-black uppercase tracking-widest text-green-500 animate-pulse">{saveMessage}</p>}
        </div>

        <div className="relative z-20">
          {isEditing ? (
            <div className="flex gap-4">
              <button onClick={handleSave} className="p-6 bg-green-500 text-white rounded-3xl shadow-xl hover:scale-105 transition active:scale-95"><Save size={24}/></button>
              <button onClick={() => setIsEditing(false)} className="p-6 bg-red-500 text-white rounded-3xl shadow-xl hover:scale-105 transition active:scale-95"><X size={24}/></button>
            </div>
          ) : (
            <button onClick={() => setIsEditing(true)} className={`flex items-center gap-3 px-10 py-6 rounded-[2.2rem] font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl transition-all hover:-translate-y-1 active:scale-95 ${dark ? 'bg-white text-black hover:bg-amber-500' : 'bg-[#1e1b4b] text-white'}`}>
              <Edit2 size={16}/> Modify Profile
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-20">
        
        {/* --- 👤 PERSONAL LEDGER --- */}
        <div className={`${styles.card} p-10 md:p-12 rounded-[4rem] border space-y-10`}>
          <div className={styles.innerShine}></div>
          <div className="flex items-center gap-4 opacity-40">
            <Fingerprint size={20}/>
            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] italic">Authorized Details</h3>
          </div>
          
          <div className="space-y-6">
            {[
              { label: "Operational ID", value: auth.currentUser?.uid, icon: <Zap size={14}/>, readonly: true },
              { label: "Mobile Access", key: "mobile", icon: <Phone size={14}/> },
              { label: "Institutional Hub", key: "college", icon: <Globe size={14}/> },
              { label: "Academic Stream", key: "branch", icon: <BookOpen size={14}/> }
            ].map((field, idx) => (
              <div key={idx} className="space-y-2">
                <p className={`${styles.sub} text-[9px] font-black uppercase tracking-widest flex items-center gap-2`}>
                  {field.icon} {field.label}
                </p>
                {isEditing && !field.readonly ? (
                  <input
                    value={formData[field.key]}
                    onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                    className={`w-full p-4 rounded-2xl border outline-none font-black text-xs uppercase tracking-widest ${styles.input}`}
                  />
                ) : (
                  <p className="font-black text-sm uppercase tracking-tight truncate">
                    {field.readonly ? field.value : (formData[field.key] || "NOT DECLARED")}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* --- 🛡️ MENTOR SYNC (FIXED LOGIC) --- */}
        <div className={`${styles.card} p-10 md:p-12 rounded-[4rem] border flex flex-col`}>
          <div className={styles.innerShine}></div>
          <div className="flex items-center gap-4 mb-10 opacity-40">
            <Fingerprint size={20}/>
            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] italic">Executive Support</h3>
          </div>
          
          <div className="flex-1">
            {mentorData ? (
              <div className="space-y-10 animate-in fade-in duration-700">
                <div className="space-y-2">
                   <p className={`${styles.sub} text-[9px] font-black uppercase tracking-widest flex items-center gap-2`}><UserIcon size={14}/> Supervisor Identity</p>
                   <p className="font-black text-2xl uppercase tracking-tighter italic">{mentorData.name}</p>
                </div>
                <div className="space-y-2">
                   <p className={`${styles.sub} text-[9px] font-black uppercase tracking-widest flex items-center gap-2`}><Mail size={14}/> Official Channel</p>
                   <p className={`font-black text-xs uppercase tracking-widest ${styles.accent}`}>{mentorData.email}</p>
                </div>
                <div className="space-y-2">
                   <p className={`${styles.sub} text-[9px] font-black uppercase tracking-widest flex items-center gap-2`}><Phone size={14}/> Priority Contact</p>
                   {/* 🎯 FIXED PRIVACY LOGIC: Checks Mentor's Live showMobile boolean */}
                   <p className="font-black text-sm tracking-[0.2em] uppercase">
                     {mentorData.showMobile === true ? (mentorData.mobile || "NOT SET") : "SECURED"}
                   </p>
                </div>

                <div className={`mt-10 p-8 rounded-[3rem] border flex items-center gap-6 ${dark ? 'bg-green-500/10 border-green-500/20 shadow-green-500/5' : 'bg-green-50 border-green-200'}`}>
                   <div className="w-14 h-14 rounded-2xl bg-green-500 flex items-center justify-center text-white shadow-xl shadow-green-500/20">
                     <ShieldCheck size={28} />
                   </div>
                   <div>
                     <p className="text-[10px] font-black text-green-500 uppercase tracking-[0.3em]">Hub Connection</p>
                     <p className={`text-sm font-black uppercase ${dark ? 'text-white' : 'text-slate-800'}`}>Verified Integrity</p>
                   </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30">
                <Link2 size={64} className="mb-6" />
                <p className="text-[12px] font-black uppercase tracking-[0.4em] max-w-[250px]">No Operational Hub Linked.</p>
                <button onClick={() => navigate("/app/dashboard")} className={`mt-8 px-8 py-4 rounded-full border text-[10px] font-black uppercase tracking-widest hover:bg-current hover:text-white transition-all`}>Join Hub</button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}