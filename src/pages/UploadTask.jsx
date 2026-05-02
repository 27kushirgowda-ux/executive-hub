import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, addDoc, collection, onSnapshot } from "firebase/firestore";
import { 
  Link as LinkIcon, 
  Send, 
  X, 
  Plus,
  Lock,
  Clock,
  ShieldCheck,
  Zap,
  CheckCircle2
} from "lucide-react";

export default function UploadTask({ dark }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [mentorData, setMentorData] = useState(null); // 🎯 Added to track Mentor's live deadline
  const [loading, setLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const [timeLeft, setTimeLeft] = useState("SYNCING...");

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [links, setLinks] = useState([""]); 

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // --- 🎨 💎 THE CRYSTAL CONSOLE ENGINE ---
  const styles = {
    card: dark 
      ? "bg-[#111111]/40 border-white/[0.08] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6)] backdrop-blur-3xl transition-all duration-700 relative overflow-hidden group" 
      : "bg-white/40 border-white shadow-[0_15px_40px_rgba(120,119,198,0.1)] backdrop-blur-2xl transition-all duration-700 relative overflow-hidden group",
    text: dark ? "text-white" : "text-[#1e1b4b]",
    sub: dark ? "text-white/20" : "text-slate-400",
    accent: dark ? "text-amber-500" : "text-purple-600",
    input: dark ? "bg-white/5 border-white/10 text-white placeholder:text-white/10" : "bg-purple-50 border-purple-100 text-[#2e1065]",
    innerShine: "absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-transparent pointer-events-none z-10",
    ambientGlow: dark 
      ? "fixed w-[600px] h-[600px] rounded-full bg-amber-500/10 blur-[150px] -z-20 pointer-events-none"
      : "fixed w-[600px] h-[600px] rounded-full bg-purple-500/10 blur-[150px] -z-20 pointer-events-none"
  };

  // --- 🔄 LIVE MENTOR SYNC ---
  useEffect(() => {
    let unsubMentor = () => {};

    const unsubAuth = onAuthStateChanged(auth, (u) => {
      if (!u) return navigate("/Login");
      
      const unsubUser = onSnapshot(doc(db, "users", u.uid), (snap) => {
        if (snap.exists()) {
          const userData = snap.data();
          setUser(userData);

          // 🎯 CRITICAL FIX: Listen to Mentor's profile for the Real Deadline
          if (userData.mentorId) {
            unsubMentor = onSnapshot(doc(db, "users", userData.mentorId), (mSnap) => {
              if (mSnap.exists()) setMentorData(mSnap.data());
            });
          }
        }
        setLoading(false);
      });

      return () => { unsubUser(); unsubMentor(); };
    });

    return () => unsubAuth();
  }, [navigate]);

  // --- ⏰ THE MASTER LOCK TIMER ---
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      // 🎯 Use Mentor's actual set deadline
      const deadlineStr = mentorData?.uploadDeadline || "18:00"; 
      
      try {
        const [hours, minutes] = deadlineStr.split(':');
        const deadline = new Date();
        deadline.setHours(parseInt(hours), parseInt(minutes), 0);
        
        const diff = deadline - now;
        if (diff <= 0) {
          setIsLocked(true);
          setTimeLeft("PORTAL CLOSED");
        } else {
          setIsLocked(false);
          const h = Math.floor(diff / 3600000);
          const m = Math.floor((diff % 3600000) / 60000);
          const s = Math.floor((diff % 60000) / 1000);
          setTimeLeft(`${h}H ${m}M ${s}S`);
        }
      } catch (e) { setTimeLeft("SYNCING..."); }
    }, 1000);

    return () => clearInterval(timer);
  }, [mentorData]);

  const handleSubmit = async () => {
    // 🛑 HARD LOCK: Stop submission if time is up
    if (isLocked) {
      setError("Executive Blockade: Deadline has passed. Transmission refused.");
      return;
    }

    if (!title || !date || !description || links.every(l => l.trim() === "")) {
      setError("Incomplete Ledger: All fields required.");
      return;
    }

    try {
      setSubmitting(true);
      await addDoc(collection(db, "tasks"), {
        userId: auth.currentUser.uid,
        userName: user.name,
        mentorId: user.mentorId,
        title,
        date,
        description,
        links: links.filter(l => l.trim() !== ""),
        status: "Pending",
        createdAt: new Date()
      });
      setMessage("Report Dispatched Successfully! 🚀");
      setTitle(""); setDate(""); setDescription(""); setLinks([""]);
    } catch (err) { setError("Synchronization Failure."); } 
    finally { setSubmitting(false); }
  };

  if (loading) return null;

  return (
    <div className={`w-full p-4 md:p-6 min-h-screen flex flex-col space-y-8 pb-12 animate-in fade-in duration-1000 ${styles.text}`}>
      
      <div className={styles.ambientGlow} style={{ top: '-100px', left: '-100px' }}></div>
      <div className={styles.ambientGlow} style={{ bottom: '100px', right: '-100px' }}></div>

      {/* 🚀 HEADER */}
      <div className={`${styles.card} p-10 md:p-14 rounded-[4rem] border`}>
        <div className={styles.innerShine}></div>
        <div className="relative z-20 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <p className={`text-[10px] font-black uppercase tracking-[0.6em] ${styles.sub} mb-4`}>
              Communication Link: <span className={styles.accent}>{isLocked ? "SECURED" : "OPEN"}</span>
            </p>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter italic uppercase leading-none">
              Post <span className={styles.accent}>Report</span>
            </h1>
          </div>
          <div className={`px-6 py-3 rounded-full border flex items-center gap-3 transition-colors duration-500 ${isLocked ? 'border-red-500/20 bg-red-500/10 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.1)]' : 'border-amber-500/20 bg-amber-500/10 text-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.1)]'}`}>
            {isLocked ? <Lock size={18} className="animate-pulse"/> : <Clock size={18}/>}
            <span className="text-[11px] font-black uppercase tracking-widest">{timeLeft}</span>
          </div>
        </div>
      </div>

      {/* 🛠️ FORM CONTAINER */}
      <div className="relative">
        {/* 🎯 THE GLASS LOCK: Visually disables the UI when time expires */}
        {isLocked && (
          <div className="absolute inset-0 z-[60] flex items-center justify-center backdrop-blur-md rounded-[3.5rem] bg-black/40 animate-in fade-in duration-700">
             <div className="bg-black/90 p-12 rounded-[3rem] border border-red-500/30 text-center shadow-2xl scale-110">
                <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Lock size={48} className="text-red-500" />
                </div>
                <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white">Directive Expired</h3>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-400 mt-4 opacity-70">Window for Daily Dispatch is Closed.</p>
             </div>
          </div>
        )}

        <div className={`${styles.card} p-8 md:p-12 rounded-[3.5rem] border`}>
          <div className={styles.innerShine}></div>
          <div className="relative z-20 space-y-10">
            {message && <div className="p-5 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-black uppercase text-center tracking-[0.3em] animate-pulse">{message}</div>}
            {error && <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase text-center tracking-[0.3em]">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2">Task Identifier</label>
                <input type="text" placeholder="E.G., MODULE CALIBRATION" value={title} onChange={(e) => setTitle(e.target.value)} className={`w-full p-6 rounded-[1.5rem] border outline-none font-black text-xs uppercase tracking-widest ${styles.input}`} />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2">Timeline Date</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={`w-full p-6 rounded-[1.5rem] border outline-none font-black text-xs ${styles.input}`} />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2">Operational Summary</label>
              <textarea placeholder="LOG YOUR ACHIEVEMENTS FOR THIS SESSION..." value={description} onChange={(e) => setDescription(e.target.value)} rows="4" className={`w-full p-8 rounded-[2rem] border outline-none resize-none font-bold text-sm leading-relaxed ${styles.input}`} />
            </div>

            <div className="space-y-6">
              <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2">Project Resources (Max 3)</label>
              <div className="grid grid-cols-1 gap-4">
                {links.map((link, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="relative flex-1">
                      <LinkIcon size={18} className="absolute left-6 top-1/2 -translate-y-1/2 opacity-30"/>
                      <input type="url" placeholder="HTTPS://RESOURCE-LINK.COM" value={link} onChange={(e) => {
                        const n = [...links]; n[index] = e.target.value; setLinks(n);
                      }} className={`w-full p-6 pl-16 rounded-[1.5rem] border outline-none font-bold text-xs ${styles.input}`} />
                    </div>
                    {links.length > 1 && <button onClick={() => setLinks(links.filter((_, i) => i !== index))} className="p-6 rounded-2xl bg-red-500/5 text-red-500 hover:bg-red-500 hover:text-white transition-all"><X size={20}/></button>}
                  </div>
                ))}
              </div>
              {links.length < 3 && (
                <button onClick={() => setLinks([...links, ""])} className={`mt-2 flex items-center gap-3 px-8 py-4 rounded-full border border-dashed transition-all hover:bg-current/[0.05] ${dark ? 'border-white/10 text-white/40' : 'border-purple-200 text-purple-400'}`}>
                  <Plus size={16}/> <span className="text-[10px] font-black uppercase tracking-[0.2em]">Add Source Link</span>
                </button>
              )}
            </div>

            <button 
              onClick={handleSubmit} 
              disabled={submitting || isLocked} 
              className={`w-full py-8 rounded-[2.5rem] font-black text-[12px] uppercase tracking-[0.4em] transition-all active:scale-95 flex items-center justify-center gap-4 shadow-2xl ${
                isLocked 
                ? 'opacity-10 cursor-not-allowed bg-white/5' 
                : `${dark ? 'bg-white text-black hover:bg-amber-500 shadow-amber-500/20' : 'bg-[#1e1b4b] text-white shadow-purple-600/30 hover:scale-[1.02]'}`
              }`}
            >
              {submitting ? "TRANSMITTING..." : isLocked ? "LOCKED" : "Dispatch Report"} <Send size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* 🏁 FOOTER */}
      <div className="flex justify-center pt-8">
         <div className={`${styles.card} px-10 py-5 rounded-full border border-white/[0.08] flex items-center gap-6 shadow-2xl transition-all hover:-translate-y-1`}>
            <div className={styles.innerShine}></div>
            <ShieldCheck size={24} className={styles.accent}/>
            <p className="text-[10px] font-black uppercase italic tracking-[0.25em] opacity-40 text-center leading-none">
              Daily verification required for hub synchronization.
            </p>
         </div>
      </div>
    </div>
  );
}