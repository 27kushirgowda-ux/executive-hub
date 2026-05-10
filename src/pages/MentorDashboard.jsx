import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  doc 
} from "firebase/firestore";
import { 
  Users, 
  Search, 
  ArrowRight,
  ShieldCheck,
  Timer,
  AlertCircle,
  Activity,
  Lock,
  LayoutGrid
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MentorDashboard({ dark }) {
  const navigate = useNavigate();
  const [interns, setInterns] = useState([]);
  const [mentorData, setMentorData] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // --- 🎨 💎 THE CRYSTAL CONSOLE ENGINE ---
  const styles = {
    card: dark 
      ? "bg-[#111111]/40 border-white/[0.08] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6)] backdrop-blur-3xl hover:border-amber-500/40 transition-all duration-700 relative overflow-hidden group" 
      : "bg-white/40 border-white shadow-[0_15px_40px_rgba(120,119,198,0.1)] backdrop-blur-2xl hover:border-purple-300 transition-all duration-700 relative overflow-hidden group",
    text: dark ? "text-white" : "text-[#1e1b4b]",
    sub: dark ? "text-white/20" : "text-slate-400",
    accent: dark ? "text-amber-500" : "text-purple-600",
    barBg: dark ? "bg-white/10" : "bg-purple-100",
    barFill: dark ? "bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]" : "bg-gradient-to-r from-purple-500 to-blue-500",
    innerShine: "absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent pointer-events-none z-10",
    ambientGlow: dark 
      ? "fixed w-[600px] h-[600px] rounded-full bg-amber-500/5 blur-[150px] -z-20 pointer-events-none"
      : "fixed w-[600px] h-[600px] rounded-full bg-purple-500/5 blur-[150px] -z-20 pointer-events-none"
  };

  useEffect(() => {
    let unsubInterns = () => {};
    let unsubMentor = () => {};

    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        // 🎯 1. Real-time Mentor Profile Status
        unsubMentor = onSnapshot(doc(db, "users", user.uid), (snap) => {
          if (snap.exists()) {
            setMentorData(snap.data());
          }
        });

        // 🎯 2. Real-time Accepted Interns Only
        const q = query(
          collection(db, "users"), 
          where("role", "==", "Intern"), 
          where("mentorId", "==", user.uid)
        );
        
        unsubInterns = onSnapshot(q, (snap) => {
          const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          setInterns(list.sort((a, b) => a.name.localeCompare(b.name)));
          setLoading(false);
        });
      } else {
        navigate("/Login");
      }
    });

    return () => { unsubAuth(); unsubInterns(); unsubMentor(); };
  }, [navigate]);

  if (loading) return null;

  // --- 🔒 THE LOCKSCREEN SHIELD ---
  // If mentor is not approved, this full-screen glass UI covers everything
  if (mentorData && !mentorData.isApproved) {
    return (
      <div className={`fixed inset-0 z-[999] flex items-center justify-center p-6 backdrop-blur-[80px] transition-all duration-1000 ${dark ? 'bg-black/80' : 'bg-white/60'}`}>
        <div className={styles.ambientGlow} style={{ top: '20%', left: '30%' }}></div>
        <div className={`relative w-full max-w-lg p-12 md:p-16 rounded-[4rem] border text-center overflow-hidden ${styles.card}`}>
          <div className={styles.innerShine}></div>
          
          <div className={`inline-flex p-6 rounded-full mb-8 animate-pulse ${dark ? 'bg-amber-500/10 text-amber-500' : 'bg-purple-100 text-purple-600'}`}>
            <Lock size={48} strokeWidth={1.5} />
          </div>
          
          <h2 className={`text-4xl font-black italic uppercase tracking-tighter mb-4 ${styles.text}`}>
            Portal <span className={styles.accent}>Locked</span>
          </h2>
          
          <p className={`text-[10px] font-black uppercase tracking-[0.5em] leading-loose opacity-60 mb-10 ${styles.text}`}>
            Your executive credentials have been logged. Access to the Hub is restricted until a 
            <span className={styles.accent}> System Administrator</span> authorizes your session.
          </p>

          <div className={`py-4 px-8 rounded-2xl inline-block border ${dark ? 'bg-white/5 border-white/10' : 'bg-white border-purple-100'}`}>
             <p className={`text-[9px] font-black uppercase tracking-widest ${styles.sub}`}>Department Registry</p>
             <p className="text-sm font-bold mt-1 uppercase italic tracking-widest">{mentorData.domain || 'Unassigned'}</p>
          </div>
        </div>
      </div>
    );
  }

  // --- ✅ THE AUTHORIZED DASHBOARD ---
  return (
    <div className={`w-full min-h-screen p-4 md:p-8 space-y-12 animate-in fade-in zoom-in-95 duration-700 ${styles.text}`}>
      <div className={styles.ambientGlow} style={{ top: '-100px', left: '-100px' }}></div>
      <div className={styles.ambientGlow} style={{ bottom: '100px', right: '-100px' }}></div>

      {/* HEADER CONSOLE */}
      <div className={`${styles.card} p-10 md:p-14 rounded-[3.5rem] border flex flex-col md:flex-row justify-between items-center gap-8`}>
        <div className={styles.innerShine}></div>
        <div className="text-center md:text-left relative z-20">
          <p className={`text-[10px] font-black uppercase tracking-[0.6em] ${styles.sub} mb-3`}>Executive Oversight</p>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter italic uppercase leading-none">Hub <span className={styles.accent}>Console</span></h2>
        </div>
        <div className="flex items-center gap-4 relative z-20">
           <div className={`px-8 py-4 rounded-full border border-white/10 flex items-center gap-4 shadow-xl ${dark ? 'bg-white/5' : 'bg-white/80 border-purple-100'}`}>
             <ShieldCheck size={20} className={styles.accent}/>
             <span className="text-[11px] font-black uppercase tracking-[0.3em]">Verified Supervisor</span>
           </div>
        </div>
      </div>

      {/* ANALYTICS STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-20">
         <div className={`${styles.card} p-10 rounded-[3rem] border flex items-center justify-between group`}>
            <div className={styles.innerShine}></div>
            <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center transition-all duration-500 group-hover:scale-110 ${dark ? 'bg-amber-500/10 text-amber-500' : 'bg-purple-600 text-white shadow-2xl shadow-purple-500/30'}`}>
              <Users size={36} />
            </div>
            <div className="text-right">
              <h4 className="text-7xl font-black tracking-tighter italic leading-none">{interns.length}</h4>
              <p className={`text-[11px] font-black uppercase tracking-[0.4em] ${styles.sub} mt-2`}>Accepted Personnel</p>
            </div>
         </div>

         <div className={`${styles.card} p-10 rounded-[3rem] border flex items-center justify-between group`}>
            <div className={styles.innerShine}></div>
            <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center transition-all duration-500 group-hover:scale-110 ${dark ? 'bg-blue-500/10 text-blue-500' : 'bg-blue-600 text-white shadow-2xl shadow-blue-500/30'}`}>
              <Activity size={36} />
            </div>
            <div className="text-right">
              <h4 className="text-7xl font-black tracking-tighter italic leading-none">
                {interns.reduce((acc, curr) => acc + (curr.progress || 0), 0) / (interns.length || 1) | 0}%
              </h4>
              <p className={`text-[11px] font-black uppercase tracking-[0.4em] ${styles.sub} mt-2`}>Avg Productivity</p>
            </div>
         </div>
      </div>

      {/* FILTER & LIST */}
      <div className="space-y-8 relative z-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
           <h3 className="text-2xl font-black italic uppercase tracking-tighter flex items-center gap-3">
             <LayoutGrid size={24} className={styles.accent}/> Active <span className={styles.accent}>Ledger</span>
           </h3>
           <div className="relative group w-full md:w-96">
             <Search className={`absolute left-6 top-1/2 -translate-y-1/2 opacity-20 transition-all group-focus-within:text-amber-500`} size={20} />
             <input 
               placeholder="SEARCH NAME / USN..." 
               value={search} 
               onChange={e => setSearch(e.target.value)} 
               className={`w-full pl-16 pr-8 py-6 rounded-[2.5rem] border outline-none font-black text-[11px] tracking-widest uppercase transition-all shadow-xl ${dark ? 'bg-white/5 border-white/10 text-white placeholder:text-white/10 focus:border-amber-500/40' : 'bg-white/80 border-white text-slate-900 focus:border-purple-300'}`} 
             />
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {interns
            .filter(i => 
              i.name?.toLowerCase().includes(search.toLowerCase()) || 
              i.usn?.toLowerCase().includes(search.toLowerCase())
            )
            .map(intern => (
            <div key={intern.id} className={`${styles.card} p-10 rounded-[3.5rem] border transition-all hover:-translate-y-2`}>
               <div className={styles.innerShine}></div>
               <div className="flex items-center gap-5 mb-10 relative z-20">
                  <div className={`w-16 h-16 rounded-[1.8rem] flex items-center justify-center text-black font-black text-2xl shadow-xl transition-transform group-hover:rotate-6 ${dark ? 'bg-amber-500 shadow-amber-500/20' : 'bg-gradient-to-br from-pink-500 to-purple-700 text-white shadow-purple-500/20'}`}>
                    {intern.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-2xl font-black tracking-tighter italic uppercase truncate leading-none mb-2">{intern.name}</h3>
                    <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${styles.sub}`}>{intern.usn || 'PENDING USN'}</p>
                  </div>
               </div>

               <div className="space-y-6 relative z-20 mb-10">
                 <div className="flex justify-between items-end">
                    <div>
                       <p className={`text-[10px] font-black uppercase tracking-widest ${styles.sub} mb-1`}>Tenure Protocol</p>
                       <div className="flex items-center gap-2">
                          <Timer size={14} className={styles.accent}/>
                          <span className="text-sm font-black italic uppercase">{intern.internshipDuration || 90} Days</span>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className={`text-[11px] font-black uppercase ${styles.accent}`}>{intern.progress || 0}%</p>
                    </div>
                 </div>
                 <div className={`w-full h-3 ${styles.barBg} rounded-full overflow-hidden p-0.5 border border-white/5`}>
                    <div 
                      className={`h-full ${styles.barFill} transition-all duration-[2000ms] ease-out rounded-full`} 
                      style={{ width: `${intern.progress || 0}%` }} 
                    />
                 </div>
               </div>

               <button 
                 onClick={() => navigate(`/mentor/review/${intern.id}`)}
                 className={`w-full py-5 rounded-[1.8rem] flex items-center justify-center gap-4 text-[11px] font-black uppercase tracking-[0.3em] transition-all relative z-20 border ${
                   dark ? 'bg-white/5 border-white/5 text-white hover:bg-amber-500 hover:text-black' : 'bg-slate-100 border-transparent text-[#1e1b4b] hover:bg-[#1e1b4b] hover:text-white shadow-sm'
                 }`}
               >
                 Review Task Ledger <ArrowRight size={16} />
               </button>
            </div>
          ))}
        </div>

        {interns.length === 0 && (
          <div className={`${styles.card} py-32 text-center rounded-[4rem] border border-white/5`}>
            <div className={styles.innerShine}></div>
            <div className="relative z-20 opacity-20">
               <AlertCircle size={64} className="mx-auto mb-6" />
               <p className="font-black uppercase tracking-[0.4em] text-xs">No Active Personnel in Ledger</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-center pt-10 pb-12">
         <div className={`${styles.card} px-12 py-6 rounded-full border border-white/[0.08] flex items-center gap-6 shadow-2xl transition-all hover:-translate-y-1`}>
            <div className={styles.innerShine}></div>
            <ShieldCheck size={24} className={styles.accent}/>
            <p className="text-[10px] font-black uppercase italic tracking-[0.3em] opacity-40 text-center leading-none">
              Verified Executive Session Active. Secure Real-time Task Oversight Enabled.
            </p>
         </div>
      </div>
    </div>
  );
}