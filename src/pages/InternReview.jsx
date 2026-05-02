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
  ExternalLink,
  TrendingUp,
  Link as LinkIcon,
  ShieldCheck,
  Zap,
  Timer,
  ChevronDown,
  MessageSquare
} from "lucide-react";

export default function InternReview({ dark }) {
  const { internId } = useParams();
  const navigate = useNavigate();
  
  const [intern, setIntern] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [remark, setRemark] = useState("");
  const [processingId, setProcessingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null); // 🎯 Control which day is being reviewed
  const [loading, setLoading] = useState(true);

  // --- 🎨 💎 THE CONDENSED CRYSTAL ENGINE ---
  const styles = {
    card: dark 
      ? "bg-[#111111]/40 border-white/[0.08] shadow-[0_15px_35px_-12px_rgba(0,0,0,0.5)] backdrop-blur-3xl hover:border-amber-500/30 transition-all duration-500 relative overflow-hidden" 
      : "bg-white/40 border-white shadow-[0_10px_25px_rgba(120,119,198,0.1)] backdrop-blur-3xl hover:border-purple-300 transition-all duration-500 relative overflow-hidden",
    text: dark ? "text-white" : "text-[#1e1b4b]",
    sub: dark ? "text-white/20" : "text-slate-400",
    accent: dark ? "text-amber-500" : "text-purple-600",
    input: dark ? "bg-white/5 border-white/10 text-white" : "bg-white/60 border-white shadow-sm text-slate-900",
    innerShine: "absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent pointer-events-none z-10",
    ambientGlow: dark 
      ? "fixed w-[600px] h-[600px] rounded-full bg-amber-500/5 blur-[150px] -z-20 pointer-events-none"
      : "fixed w-[600px] h-[600px] rounded-full bg-purple-500/5 blur-[150px] -z-20 pointer-events-none"
  };

  useEffect(() => {
    getDoc(doc(db, "users", internId)).then(s => s.exists() && setIntern(s.data()));
    const q = query(collection(db, "tasks"), where("userId", "==", internId));
    const unsub = onSnapshot(q, (snap) => {
      const taskList = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setTasks(taskList.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
      setLoading(false);
    });
    return () => unsub();
  }, [internId]);

  const handleReview = async (taskId, status, taskTitle) => {
    if (!remark.trim() && status === "Rejected") return alert("Directive remark required for rejection.");
    setProcessingId(taskId);
    try {
      await updateDoc(doc(db, "tasks", taskId), { status, mentorRemark: remark, reviewedAt: serverTimestamp() });
      await addDoc(collection(db, "notifications"), { userId: internId, message: remark || `Status: ${status}`, taskTitle, status, createdAt: serverTimestamp() });
      
      if (status === "Approved") {
        const duration = intern?.internshipDuration || 90;
        const approvedCount = tasks.filter(t => t.status === "Approved").length + 1;
        await updateDoc(doc(db, "users", internId), { progress: Math.min(Math.round((approvedCount / duration) * 100), 100) });
      }
      setRemark(""); setProcessingId(null); setExpandedId(null);
    } catch (err) { setProcessingId(null); }
  };

  if (loading) return null;

  return (
    <div className={`w-full min-h-screen p-4 md:p-8 flex flex-col space-y-8 animate-in fade-in duration-1000 ${styles.text}`}>
      
      <div className={styles.ambientGlow} style={{ top: '-100px', left: '-100px' }}></div>
      <div className={styles.ambientGlow} style={{ bottom: '100px', right: '-100px' }}></div>

      {/* --- TOP HEADER --- */}
      <div className="flex justify-between items-center px-4 relative z-20">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] opacity-30 hover:opacity-100 transition-all"><ArrowLeft size={16} /> Back</button>
        <div className={`px-4 py-1.5 rounded-full border border-white/10 flex items-center gap-3 ${dark ? 'bg-white/5' : 'bg-black/5'}`}>
          <TrendingUp size={14} className={styles.accent} />
          <span className="text-[10px] font-black uppercase tracking-widest">Mastery: {intern?.progress || 0}%</span>
        </div>
      </div>

      {/* --- CONDENSED INTERN INFO --- */}
      <div className={`${styles.card} p-6 md:p-8 rounded-[2.5rem] border flex items-center gap-6`}>
        <div className={styles.innerShine}></div>
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-black font-black text-xl shadow-xl ${dark ? 'bg-amber-500' : 'bg-gradient-to-br from-pink-500 to-purple-700 text-white'}`}>{intern?.name?.charAt(0)}</div>
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter leading-none">{intern?.name}</h1>
          <p className={`text-[9px] font-black uppercase tracking-[0.3em] ${styles.sub} mt-1`}>{intern?.domain} • {intern?.internshipDuration || 90} DAYS</p>
        </div>
      </div>

      {/* --- 🛡️ THE SCALABLE LEDGER --- */}
      <div className="space-y-3 relative z-20">
        <div className="flex items-center justify-between px-6 opacity-30">
           <p className="text-[9px] font-black uppercase tracking-[0.4em]">Operational Logs ({tasks.length})</p>
           <p className="text-[9px] font-black uppercase tracking-[0.4em]">Timeline Order</p>
        </div>

        <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar" style={{ maxHeight: 'calc(100vh - 400px)' }}>
          {tasks.map((task) => {
            const isExpanded = expandedId === task.id;
            return (
              <div key={task.id} className={`${styles.card} rounded-[1.8rem] border transition-all duration-500 ${isExpanded ? 'ring-1 ring-amber-500/30' : ''}`}>
                <div className={styles.innerShine}></div>
                
                {/* COMPACT ROW */}
                <div 
                  onClick={() => setExpandedId(isExpanded ? null : task.id)}
                  className="p-5 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4 cursor-pointer relative z-20"
                >
                  <div className="flex items-center gap-6 flex-1 min-w-0">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${
                      task.status === 'Approved' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 
                      task.status === 'Rejected' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-amber-500 animate-pulse'
                    }`}></div>
                    <div className="min-w-0">
                      <p className="text-[8px] font-black uppercase opacity-30 mb-0.5 tracking-widest">{task.date}</p>
                      <h3 className="text-sm md:text-base font-black uppercase tracking-tight truncate">{task.title}</h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    {task.links?.map((link, idx) => (
                      <a key={idx} href={link} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className={`w-8 h-8 rounded-lg flex items-center justify-center border border-white/10 hover:border-amber-500 transition-all ${dark ? 'bg-white/5 text-amber-500' : 'bg-slate-100 text-purple-600'}`}>
                        <LinkIcon size={12} />
                      </a>
                    ))}
                    <ChevronDown size={16} className={`opacity-20 transition-transform duration-500 ${isExpanded ? 'rotate-180 opacity-100' : ''}`} />
                  </div>
                </div>

                {/* EXPANDED REVIEW BOX (Only shows when clicked) */}
                {isExpanded && (
                  <div className="px-6 pb-6 pt-2 animate-in slide-in-from-top-2 duration-500 relative z-20 border-t border-white/5 mt-2">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                       <div className="lg:col-span-7 space-y-4">
                          <p className="text-[10px] font-bold opacity-40 leading-relaxed italic">"{task.description}"</p>
                          {task.mentorRemark && (
                            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                               <p className="text-[8px] font-black uppercase opacity-30 mb-1">Previous Remark</p>
                               <p className="text-[10px] font-bold italic opacity-60 text-amber-500">{task.mentorRemark}</p>
                            </div>
                          )}
                       </div>
                       
                       <div className="lg:col-span-5 space-y-4">
                          <textarea 
                            placeholder="Enter directive..."
                            value={remark}
                            onChange={(e) => setRemark(e.target.value)}
                            className={`w-full p-4 rounded-2xl text-xs font-bold outline-none border transition-all h-24 resize-none ${styles.input}`}
                          />
                          <div className="flex gap-3">
                            <button onClick={() => handleReview(task.id, "Rejected", task.title)} className="flex-1 py-3 rounded-xl bg-red-500/10 text-red-500 font-black text-[9px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">Reject</button>
                            <button onClick={() => handleReview(task.id, "Approved", task.title)} className="flex-[2] py-3 rounded-xl bg-green-500/10 text-green-500 font-black text-[9px] uppercase tracking-widest hover:bg-green-500 hover:text-white transition-all">Approve</button>
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

      {/* 🏁 STABILIZED FOOTER */}
      <div className="flex justify-center pt-6 pb-10 relative z-20">
         <div className={`${styles.card} px-10 py-5 rounded-full border border-white/[0.08] flex items-center gap-6 shadow-2xl`}>
            <div className={styles.innerShine}></div>
            <ShieldCheck size={20} className={styles.accent}/>
            <p className="text-[10px] font-black uppercase italic tracking-[0.25em] opacity-40">Operational Review Sync Active.</p>
         </div>
      </div>
    </div>
  );
}