import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { 
  doc, 
  collection, 
  query, 
  where, 
  onSnapshot, 
  updateDoc,
  getDoc 
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  Clock,
  Lock,
  Link2,
  TrendingUp,
  ShieldCheck,
  Zap,
  AlertCircle
} from "lucide-react";

export default function MainDashboard({ dark }) {
  const navigate = useNavigate();
  
  // --- 1. STATES ---
  const [user, setUser] = useState(null);
  const [mentorData, setMentorData] = useState(null); 
  const [tasks, setTasks] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState("SYNCING...");
  const [isLocked, setIsLocked] = useState(false);
  
  // --- 🛠️ MAPPING STATES ---
  const [mentorInput, setMentorInput] = useState("");
  const [linking, setLinking] = useState(false);
  const [hubMessage, setHubMessage] = useState({ type: "", text: "" });

  // --- 2. 💎 THE CRYSTAL CONSOLE STYLES ---
  const styles = {
    card: dark 
      ? "bg-[#111111]/40 border-white/[0.08] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6)] backdrop-blur-3xl hover:border-amber-500/40 transition-all duration-700 relative overflow-hidden group" 
      : "bg-white/40 border-white shadow-[0_15px_40px_rgba(120,119,198,0.1)] backdrop-blur-2xl hover:border-purple-300 transition-all duration-700 relative overflow-hidden group",
    text: dark ? "text-white" : "text-[#1e1b4b]",
    sub: dark ? "text-white/20" : "text-slate-400",
    accent: dark ? "text-amber-500" : "text-purple-600",
    input: dark ? "bg-white/5 border-white/10 text-white placeholder:text-white/10" : "bg-slate-50 border-slate-200 text-slate-900",
    innerShine: "absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-transparent pointer-events-none z-10",
    ambientGlow: dark 
      ? "fixed w-[600px] h-[600px] rounded-full bg-amber-500/10 blur-[150px] -z-20 pointer-events-none transition-all duration-1000"
      : "fixed w-[600px] h-[600px] rounded-full bg-purple-500/10 blur-[150px] -z-20 pointer-events-none transition-all duration-1000"
  };

  // --- 🎯 THE ROLE-GUARD HUB CONNECTION HANDSHAKE ---
  const handleJoinHub = async () => {
    if (!mentorInput || mentorInput.trim().length < 5) {
      setHubMessage({ type: "error", text: "Executive Protocol: Invalid ID Format" });
      return;
    }

    setLinking(true);
    setHubMessage({ type: "loading", text: "Verifying Identity Ledger..." });

    try {
      // 🔍 STEP 1: Strict Verification of the Target UID
      const mentorRef = doc(db, "users", mentorInput.trim());
      const mentorSnap = await getDoc(mentorRef);

      if (!mentorSnap.exists()) {
        setHubMessage({ type: "error", text: "Search Failure: Identifier Not Found" });
        setLinking(false);
        return;
      }

      // 🛡️ STEP 2: Role Shield - Blocks interns from mapping to interns
      if (mentorSnap.data().role !== "Mentor") {
        setHubMessage({ type: "error", text: "Security Alert: Target is Not a Mentor" });
        setLinking(false);
        return;
      }

      // ✅ STEP 3: Handshake Confirmed. Bind Hub.
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        mentorId: mentorInput.trim(),
        mappingDate: new Date().toISOString(),
        internshipDuration: 90
      });

      setHubMessage({ type: "success", text: "Hub Connection Synchronized ✅" });

    } catch (err) {
      setHubMessage({ type: "error", text: "System Refusal: Connection Interrupted" });
    } finally {
      setLinking(false);
    }
  };

  // --- 🔄 PERSISTENT LIVE SYNC ENGINE ---
  useEffect(() => {
    let unsubMentor = () => {};

    const unsubAuth = onAuthStateChanged(auth, (u) => {
      if (!u) return navigate("/Login");
      
      const unsubUser = onSnapshot(doc(db, "users", u.uid), (snap) => {
        if (snap.exists()) {
          const userData = snap.data();
          setUser(userData);

          // Listen to Mentor settings in real-time
          if (userData.mentorId) {
            unsubMentor = onSnapshot(doc(db, "users", userData.mentorId), (mSnap) => {
              if (mSnap.exists()) setMentorData(mSnap.data());
            });
          }
        }
        setLoading(false);
      });

      const q = query(collection(db, "tasks"), where("userId", "==", u.uid));
      const unsubTasks = onSnapshot(q, (snapshot) => {
        setTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });

      return () => { unsubUser(); unsubTasks(); unsubMentor(); };
    });

    return () => unsubAuth();
  }, [navigate]);

  // --- ⏰ TIMER (Mentor Controlled) ---
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const deadlineStr = mentorData?.uploadDeadline || "18:00"; 
      
      try {
        const [hours, minutes] = deadlineStr.split(':');
        const deadline = new Date();
        deadline.setHours(parseInt(hours), parseInt(minutes), 0);
        
        const diff = deadline - now;
        if (diff <= 0) {
          setTimeLeft("PORTAL CLOSED");
          setIsLocked(true);
        } else {
          setIsLocked(false);
          const h = Math.floor(diff / 3600000);
          const m = Math.floor((diff % 3600000) / 60000);
          const s = Math.floor((diff % 60000) / 1000);
          setTimeLeft(`${h}h ${m}m ${s}s`);
        }
      } catch (e) { setTimeLeft("SYNCING..."); }
    }, 1000);
    return () => clearInterval(timer);
  }, [mentorData]);

  // --- 📊 MATH ---
  const duration = user?.internshipDuration || 90;
  const completedTasks = tasks ? tasks.filter(t => t.status === "Approved").length : 0;
  const progressPercent = Math.min(Math.round((completedTasks / duration) * 100), 100);

  const monthName = currentDate.toLocaleString("default", { month: "long" }).toUpperCase();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  if (loading) return null;

  // --- 🛡️ GATEKEEPER VIEW (HUB LINKING) ---
  if (!user?.mentorId || user?.mentorId.trim() === "") {
    return (
      <div className="flex items-center justify-center py-20 px-4 min-h-screen">
        <div className={styles.ambientGlow} style={{ top: '20%', left: '20%' }}></div>
        <div className={`${styles.card} p-12 rounded-[3.5rem] border text-center max-w-lg w-full animate-in zoom-in duration-500`}>
          <div className={styles.innerShine}></div>
          <Link2 size={40} className={`mx-auto mb-6 ${styles.accent}`} />
          <h2 className={`text-3xl font-black uppercase italic tracking-tighter mb-8 ${styles.text}`}>Establish Hub Link</h2>
          
          {/* 🎯 FRONTEND MESSAGE CONSOLE */}
          {hubMessage.text && (
            <div className={`mb-6 p-4 rounded-2xl border text-[10px] font-black uppercase tracking-[0.2em] animate-in fade-in slide-in-from-top-2 ${
              hubMessage.type === "error" ? "bg-red-500/10 border-red-500/20 text-red-500" : 
              hubMessage.type === "success" ? "bg-green-500/10 border-green-500/20 text-green-500" : 
              "bg-amber-500/10 border-amber-500/20 text-amber-500"
            }`}>
              {hubMessage.text}
            </div>
          )}

          <input 
            placeholder="ENTER MENTOR ID..." 
            value={mentorInput} 
            onChange={(e) => setMentorInput(e.target.value)} 
            className={`w-full p-6 rounded-2xl border outline-none text-center mb-6 font-mono text-xs tracking-widest ${styles.input}`} 
          />
          <button 
            onClick={handleJoinHub} 
            disabled={linking} 
            className={`w-full py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] transition-all active:scale-95 z-20 relative ${dark ? 'bg-white text-black hover:bg-amber-500' : 'bg-[#1e1b4b] text-white shadow-2xl'}`}
          >
            {linking ? "PROCESSING..." : "Connect to Hub"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full p-4 md:p-6 min-h-screen flex flex-col space-y-8 animate-in fade-in duration-1000 ${styles.text}`}>
      
      <div className={styles.ambientGlow} style={{ top: '-100px', left: '-100px' }}></div>
      <div className={styles.ambientGlow} style={{ bottom: '100px', right: '-100px' }}></div>
      
      {/* HERO SECTION */}
      <div className={`${styles.card} p-10 md:p-14 rounded-[4rem] border`}>
        <div className={styles.innerShine}></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <p className={`text-[10px] font-black uppercase tracking-[0.6em] ${styles.sub} mb-4`}>Identity Status: <span className={styles.accent}>Verified</span></p>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter italic uppercase leading-none">
              Hello, <span className={dark ? 'text-white' : 'text-[#1e1b4b]'}>{user?.name?.split(' ')[0] || 'Intern'}</span>
            </h1>
          </div>
          <div className={`px-5 py-2 rounded-full border border-white/10 text-[9px] font-black uppercase tracking-widest ${dark ? 'bg-white/5' : 'bg-black/5'}`}>
             Day {completedTasks + 1} of {duration}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className={`${styles.card} p-10 rounded-[3rem] border`}>
            <div className={styles.innerShine}></div>
            <div className="flex justify-between items-end mb-8 relative z-20">
              <div>
                <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${styles.sub} mb-1`}>Completion Rate</p>
                <p className="text-7xl font-black tracking-tighter italic leading-none">{progressPercent}%</p>
              </div>
              <div className="text-right">
                 <p className={`text-[14px] font-black uppercase ${styles.accent}`}>{completedTasks} / {duration} Days</p>
              </div>
            </div>
            <div className={`w-full h-4 rounded-full overflow-hidden p-1 border relative z-20 ${dark ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-white'}`}>
              <div 
                className={`h-full rounded-full transition-all duration-[2000ms] shadow-lg ${dark ? 'bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.5)]' : 'bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600'}`}
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          <div className={`${styles.card} p-10 rounded-[3rem] border flex flex-col md:flex-row items-center justify-between gap-8 group/timer`}>
            <div className={styles.innerShine}></div>
            <div className="flex items-center gap-6 relative z-20">
              <div className={`w-16 h-16 rounded-[2.2rem] flex items-center justify-center transition-transform duration-700 group-hover/timer:rotate-12 ${isLocked ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'}`}>
                {isLocked ? <Lock size={32} /> : <Clock size={32} />}
              </div>
              <div>
                <p className={`text-[11px] font-black uppercase tracking-[0.3em] ${styles.sub}`}>Portal Window</p>
                <h3 className={`text-4xl font-black italic uppercase tracking-tighter ${isLocked ? 'text-red-500' : ''}`}>{timeLeft}</h3>
              </div>
            </div>
            <button disabled={isLocked} onClick={() => navigate("/app/upload")} className={`w-full md:w-auto px-12 py-6 rounded-[2.2rem] font-black text-[11px] uppercase tracking-[0.3em] transition-all active:scale-95 z-20 relative ${isLocked ? 'opacity-20 bg-white/5 grayscale' : `${dark ? 'bg-white text-black hover:bg-amber-500' : 'bg-[#1e1b4b] text-white shadow-xl hover:scale-105'}`}`}>
              {isLocked ? "PORTAL CLOSED" : "DISPATCH REPORT"}
            </button>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col space-y-8">
          <div className={`${styles.card} p-8 rounded-[3rem] border hidden lg:block`}>
            <div className={styles.innerShine}></div>
            <div className="flex justify-between items-center mb-6 relative z-20">
              <h3 className="text-xs font-black uppercase tracking-widest opacity-40 italic">{monthName}</h3>
              <div className="flex gap-2">
                <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className="p-1.5 opacity-30 hover:opacity-100 transition"><ChevronLeft size={16}/></button>
                <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} className="p-1.5 opacity-30 hover:opacity-100 transition"><ChevronRight size={16}/></button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center relative z-20">
              {["S","M","T","W","T","F","S"].map(d => <span key={d} className="text-[8px] font-black opacity-20">{d}</span>)}
              {Array.from({ length: firstDay }).map((_, i) => <div key={i}></div>)}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const isToday = new Date(year, month, day).toDateString() === new Date().toDateString();
                return <div key={i} className={`py-3 text-[10px] font-black rounded-2xl transition-all ${isToday ? (dark ? "bg-amber-500 text-black shadow-lg" : "bg-purple-600 text-white shadow-xl") : "hover:bg-current/5"}`}>{day}</div>
              })}
            </div>
          </div>

          <div className={`${styles.card} p-8 rounded-[3rem] border flex-grow`}>
              <div className={styles.innerShine}></div>
              <h3 className="text-[10px] font-black uppercase tracking-widest mb-6 opacity-30 italic">Submission Logs</h3>
              <div className="space-y-6 relative z-20">
                {tasks.length > 0 ? tasks.slice(0, 3).map((t, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className={`w-2 h-2 rounded-full ${t.status === 'Approved' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]' : 'bg-amber-500 animate-pulse'}`}></div>
                      <p className="text-[10px] font-black uppercase truncate tracking-tighter opacity-80">{t.title}</p>
                    </div>
                    <div className="px-3 py-1 bg-white/5 rounded-md"><p className={`text-[7px] font-black uppercase opacity-40`}>{t.status || 'VERIFIED'}</p></div>
                  </div>
                )) : <div className="py-6 text-center opacity-10"><TrendingUp size={32} className="mx-auto" /></div>}
              </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-8 pb-10 relative z-20">
         <div className={`${styles.card} px-10 py-6 rounded-full border border-white/[0.08] flex items-center gap-6 shadow-2xl transition-all hover:-translate-y-2`}>
            <div className={styles.innerShine}></div>
            <ShieldCheck size={24} className={styles.accent}/>
            <p className="text-[10px] font-black uppercase italic tracking-[0.2em] opacity-60 text-center leading-none">
              Verified Executive Console Session Active.
            </p>
         </div>
      </div>
    </div>
  );
}