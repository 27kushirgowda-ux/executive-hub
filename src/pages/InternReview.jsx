import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { 
  doc, 
  getDoc, 
  collection, 
  query, 
  where, 
  onSnapshot, 
  updateDoc, 
  addDoc, 
  serverTimestamp 
} from "firebase/firestore";
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  TrendingUp,
  Link as LinkIcon,
  ShieldCheck,
  Zap,
  ChevronDown,
  History,
  RotateCcw
} from "lucide-react";

export default function InternReview({ dark }) {
  const { internId } = useParams();
  const navigate = useNavigate();
  
  const [intern, setIntern] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [remark, setRemark] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- 🎨 💎 THE CRYSTAL CONSOLE ENGINE ---
  const styles = {
    card: dark 
      ? "bg-[#111111]/40 border-white/[0.08] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6)] backdrop-blur-3xl hover:border-amber-500/30 transition-all duration-500 relative overflow-hidden" 
      : "bg-white/40 border-white shadow-[0_15px_40px_rgba(120,119,198,0.1)] backdrop-blur-3xl hover:border-purple-300 transition-all duration-500 relative overflow-hidden",
    text: dark ? "text-white" : "text-[#1e1b4b]",
    sub: dark ? "text-white/20" : "text-slate-400",
    accent: dark ? "text-amber-500" : "text-purple-600",
    input: dark ? "bg-white/5 border-white/10 text-white placeholder:text-white/20" : "bg-white/60 border-white shadow-sm text-slate-900",
    innerShine: "absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent pointer-events-none z-10",
    ambientGlow: dark 
      ? "fixed w-[600px] h-[600px] rounded-full bg-amber-500/5 blur-[150px] -z-20 pointer-events-none"
      : "fixed w-[600px] h-[600px] rounded-full bg-purple-500/5 blur-[150px] -z-20 pointer-events-none"
  };

  useEffect(() => {
    // 1. Fetch Intern Details
    getDoc(doc(db, "users", internId)).then(s => s.exists() && setIntern(s.data()));
    
    // 2. Fetch ALL tasks for this intern (Sorted: Newest on Top)
    const q = query(collection(db, "tasks"), where("userId", "==", internId));
    const unsub = onSnapshot(q, (snap) => {
      const taskList = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      // 🎯 Precision Sorting: Newest tasks always at the top
      setTasks(taskList.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
      setLoading(false);
    });
    return () => unsub();
  }, [internId]);

  // --- 🎯 THE DYNAMIC REVIEW ENGINE ---
  const handleReview = async (taskId, status, taskTitle) => {
    if (!remark.trim() && status === "Rejected") return alert("Directive remark required for rejection.");
    
    try {
      // 1. Update the specific task decision
      await updateDoc(doc(db, "tasks", taskId), { 
        status, 
        mentorRemark: remark || (status === "Approved" ? "Task Accepted" : "Revision Required"), 
        reviewedAt: serverTimestamp() 
      });

      // 2. Dispatch the Remark/Notification
      await addDoc(collection(db, "notifications"), { 
        userId: internId, 
        message: remark || `Status Update: ${status}`, 
        taskTitle, 
        status, 
        createdAt: serverTimestamp() 
      });
      
      // 3. RECALCULATE PROGRESS (Dynamic Logic)
      const duration = intern?.internshipDuration || 90;
      
      // We look at the ENTIRE local task list and adjust based on our new choice
      const approvedCount = tasks.reduce((acc, t) => {
        if (t.id === taskId) return status === "Approved" ? acc + 1 : acc;
        return t.status === "Approved" ? acc + 1 : acc;
      }, 0);

      await updateDoc(doc(db, "users", internId), { 
        progress: Math.min(Math.round((approvedCount / duration) * 100), 100) 
      });

      setRemark(""); 
      setExpandedId(null); 
    } catch (err) { console.error("Sync Error:", err); }
  };

  if (loading) return null;

  return (
    <div className={`w-full min-h-screen p-4 md:p-8 flex flex-col space-y-8 animate-in fade-in duration-1000 ${styles.text}`}>
      
      <div className={styles.ambientGlow} style={{ top: '-100px', left: '-100px' }}></div>
      <div className={styles.ambientGlow} style={{ bottom: '100px', right: '-100px' }}></div>

      {/* --- TOP HEADER --- */}
      <div className="flex justify-between items-center px-4 relative z-20">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] opacity-30 hover:opacity-100 transition-all"><ArrowLeft size={16} /> Back</button>
        <div className={`px-5 py-2 rounded-full border border-white/10 flex items-center gap-3 ${dark ? 'bg-white/5' : 'bg-white shadow-xl'}`}>
          <TrendingUp size={14} className={styles.accent} />
          <span className="text-[10px] font-black uppercase tracking-widest">Mastery: {intern?.progress || 0}%</span>
        </div>
      </div>

      {/* --- INTERN BANNER --- */}
      <div className={`${styles.card} p-8 md:p-10 rounded-[3.5rem] border flex items-center gap-8`}>
        <div className={styles.innerShine}></div>
        <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center text-black font-black text-3xl shadow-2xl ${dark ? 'bg-amber-500' : 'bg-gradient-to-br from-pink-500 to-purple-700 text-white shadow-purple-500/20'}`}>
          {intern?.name?.charAt(0)}
        </div>
        <div>
          <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter leading-none">{intern?.name}</h1>
          <p className={`text-[10px] font-black uppercase tracking-[0.4em] ${styles.sub} mt-2 italic`}>{intern?.domain} Division</p>
        </div>
      </div>

      {/* --- 🛡️ OPERATIONAL LEDGER --- */}
      <div className="space-y-4 relative z-20">
        <div className="flex items-center justify-between px-8 opacity-30">
           <p className="text-[10px] font-black uppercase tracking-[0.5em]">Submission Ledger ({tasks.length})</p>
           <div className="flex items-center gap-2"><History size={12}/> <p className="text-[10px] font-black uppercase tracking-[0.5em]">Newest on Top</p></div>
        </div>

        <div className="space-y-4">
          {tasks.map((task) => {
            const isExpanded = expandedId === task.id;
            return (
              <div key={task.id} className={`${styles.card} rounded-[2.5rem] border transition-all duration-500 ${isExpanded ? 'ring-1 ring-amber-500/30' : ''}`}>
                <div className={styles.innerShine}></div>
                
                <div 
                  onClick={() => { setExpandedId(isExpanded ? null : task.id); setRemark(task.mentorRemark || ""); }}
                  className="p-6 md:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 cursor-pointer relative z-20"
                >
                  <div className="flex items-center gap-6 flex-1 min-w-0">
                    <div className={`w-3 h-3 rounded-full shrink-0 ${
                      task.status === 'Approved' ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)]' : 
                      task.status === 'Rejected' ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]' : 'bg-amber-500 animate-pulse'
                    }`}></div>
                    <div className="min-w-0">
                      <p className="text-[9px] font-black uppercase opacity-30 mb-1 tracking-widest">{task.date}</p>
                      <h3 className="text-xl font-black uppercase tracking-tight italic truncate">{task.title}</h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-5 shrink-0">
                    {task.status && (
                      <div className={`px-4 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest ${
                        task.status === 'Approved' ? 'border-green-500/20 text-green-500' : 'border-red-500/20 text-red-500'
                      }`}>
                        {task.status}
                      </div>
                    )}
                    <div className="flex gap-2">
                       {task.links?.map((link, idx) => (
                         <a key={idx} href={link} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className={`w-10 h-10 rounded-xl flex items-center justify-center border border-white/10 hover:border-amber-500 transition-all ${dark ? 'bg-white/5 text-amber-500' : 'bg-slate-100 text-purple-600'}`}>
                           <LinkIcon size={16} />
                         </a>
                       ))}
                    </div>
                    <ChevronDown size={20} className={`opacity-20 transition-transform duration-700 ${isExpanded ? 'rotate-180 opacity-100' : ''}`} />
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-8 pb-10 pt-4 animate-in slide-in-from-top-4 duration-500 relative z-20 border-t border-white/5 mt-2">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                       <div className="lg:col-span-6 space-y-6">
                          <p className="text-[10px] font-black uppercase tracking-widest opacity-20">Intern Description</p>
                          <p className="text-sm font-bold opacity-60 leading-relaxed italic">"{task.description}"</p>
                          
                          {task.status && (
                            <div className="inline-flex items-center gap-3 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10">
                               <RotateCcw size={16} className={styles.accent}/>
                               <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Status Override Enabled</p>
                            </div>
                          )}
                       </div>
                       
                       <div className="lg:col-span-6 space-y-5">
                          <p className="text-[10px] font-black uppercase tracking-widest opacity-20">Review Remark</p>
                          <textarea 
                            placeholder="Enter directive..."
                            value={remark}
                            onChange={(e) => setRemark(e.target.value)}
                            className={`w-full p-6 rounded-[2rem] text-sm font-bold outline-none border transition-all h-32 resize-none ${styles.input}`}
                          />
                          <div className="grid grid-cols-2 gap-4">
                            <button onClick={() => handleReview(task.id, "Rejected", task.title)} className="py-5 rounded-2xl bg-red-500/10 text-red-500 font-black text-[11px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-xl">Reject</button>
                            <button onClick={() => handleReview(task.id, "Approved", task.title)} className="py-5 rounded-2xl bg-green-500/10 text-green-500 font-black text-[11px] uppercase tracking-widest hover:bg-green-500 hover:text-white transition-all shadow-xl shadow-green-500/10">Approve</button>
                          </div>
                       </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}