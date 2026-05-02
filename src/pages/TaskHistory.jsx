import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  updateDoc,
  serverTimestamp
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { 
  Edit3, 
  Trash2, 
  X, 
  Link as LinkIcon, 
  Calendar, 
  CheckCircle2,
  Search,
  History,
  ShieldCheck,
  Plus,
  Link2 // 🎯 FIXED: Added missing import to stop white screen
} from "lucide-react";

export default function TaskHistory({ dark }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [editTask, setEditTask] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // --- 🎨 💎 THE CRYSTAL CONSOLE ENGINE ---
  const styles = {
    card: dark 
      ? "bg-[#111111]/40 border-white/[0.08] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] backdrop-blur-3xl hover:border-amber-500/40 transition-all duration-700 relative overflow-hidden" 
      : "bg-white/40 border-white shadow-[0_20px_50px_rgba(120,119,198,0.1)] backdrop-blur-3xl hover:border-purple-300 transition-all duration-700 relative overflow-hidden",
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
    const unsubAuth = onAuthStateChanged(auth, (u) => {
      if (!u) return navigate("/Login");
      const unsubUser = onSnapshot(doc(db, "users", u.uid), (snap) => {
        if (snap.exists()) setUser(snap.data());
      });
      const q = query(collection(db, "tasks"), where("userId", "==", u.uid));
      const unsubTasks = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setTasks(data);
        setLoading(false);
      });
      return () => { unsubUser(); unsubTasks(); };
    });
    return () => unsubAuth();
  }, [navigate]);

  const handleDelete = async (id) => {
    if (window.confirm("Permanent Purge: Delete this entry?")) {
      await deleteDoc(doc(db, "tasks", id));
    }
  };

  const handleUpdate = async () => {
    if (!editTask.title || !editTask.description) return;
    try {
      setUpdating(true);
      await updateDoc(doc(db, "tasks", editTask.id), {
        title: editTask.title,
        date: editTask.date,
        description: editTask.description,
        links: editTask.links.filter(l => l.trim() !== ""),
        updatedAt: serverTimestamp()
      });
      setEditTask(null);
    } catch (err) { alert("Update Refused."); }
    finally { setUpdating(false); }
  };

  if (loading) return null;

  return (
    // 🎯 ADDED pt-20 for more space above
    <div className={`w-full min-h-screen p-4 md:p-8 pt-20 flex flex-col space-y-12 animate-in fade-in duration-1000 ${styles.text}`}>
      
      {/* 🚨 AMBIENT GLOWS */}
      <div className={styles.ambientGlow} style={{ top: '-100px', right: '-100px' }}></div>
      <div className={styles.ambientGlow} style={{ bottom: '100px', left: '-100px' }}></div>

      {/* 🚀 HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-20">
        <div>
          <p className={`text-[10px] font-black uppercase tracking-[0.8em] ${styles.sub} mb-4`}>Operational Archives</p>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter italic uppercase leading-none">
            Activity <span className={styles.accent}>Ledger</span>
          </h1>
        </div>

        <div className="relative group max-w-xs w-full">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 opacity-20" size={18} />
          <input 
            placeholder="FILTER ENTRIES..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full pl-14 pr-6 py-5 rounded-3xl border outline-none font-black text-[10px] tracking-widest uppercase transition-all ${styles.input}`}
          />
        </div>
      </div>

      {/* 📋 HISTORY LIST */}
      <div className="space-y-8 relative z-20">
        {tasks.length === 0 ? (
          // 🎯 FIXED: Wrapped the "round circle" in a proper Glassy Card
          <div className={`${styles.card} py-32 text-center flex flex-col items-center rounded-[4rem] border border-white/5`}>
            <div className={styles.innerShine}></div>
            <div className={`w-24 h-24 mb-8 rounded-full flex items-center justify-center ${dark ? 'bg-white/5 text-white/20' : 'bg-purple-50 text-purple-200'}`}>
               <History size={48} />
            </div>
            <p className="text-[11px] font-black uppercase tracking-[0.4em] opacity-30">No verified entries found in ledger.</p>
          </div>
        ) : (
          tasks
            .filter(t => t.title.toLowerCase().includes(search.toLowerCase()))
            .map((task) => (
            <div key={task.id} className={`${styles.card} p-8 md:p-12 rounded-[4rem] border group/item`}>
              <div className={styles.innerShine}></div>
              
              <div className="flex flex-col md:flex-row justify-between items-center gap-10 relative z-20">
                <div className="flex-1 w-full">
                  <div className="flex items-center gap-4 mb-6">
                    <span className={`text-[9px] font-black uppercase tracking-widest px-5 py-2 rounded-full border ${
                      task.status === "Approved" 
                        ? "bg-green-500/10 border-green-500/20 text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.15)]" 
                        : "bg-amber-500/10 border-amber-500/20 text-amber-500 animate-pulse"
                    }`}>
                      {task.status || "Pending Verification"}
                    </span>
                    {task.status === "Approved" && <CheckCircle2 size={16} className="text-green-500" />}
                  </div>
                  
                  <h3 className="text-3xl font-black tracking-tighter uppercase italic mb-4 leading-none">{task.title}</h3>
                  <p className={`text-[12px] font-bold opacity-40 leading-relaxed max-w-3xl`}>{task.description}</p>
                  
                  <div className="flex flex-wrap gap-8 mt-10">
                    <div className="flex items-center gap-3">
                      {task.links && task.links.map((link, idx) => (
                        <a key={idx} href={link} target="_blank" rel="noreferrer" className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-500 hover:scale-110 active:scale-95 ${
                          dark ? 'bg-white/5 border-white/10 text-amber-500 hover:border-amber-500 shadow-xl' : 'bg-purple-50 border-purple-100 text-purple-600 shadow-lg'
                        }`}>
                          <LinkIcon size={18} />
                        </a>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 border-l border-white/10 pl-8">
                       <p className={`text-[10px] font-black uppercase tracking-[0.3em] opacity-30 flex items-center gap-2`}>
                         <Calendar size={14} /> {task.date}
                       </p>
                    </div>
                  </div>
                </div>

                <div className="flex md:flex-col gap-4 w-full md:w-auto">
                  <button onClick={() => setEditTask(task)} className={`flex-1 md:p-7 p-5 rounded-3xl flex items-center justify-center transition-all ${dark ? 'bg-white/5 text-white hover:bg-amber-500 hover:text-black' : 'bg-[#1e1b4b] text-white'}`}><Edit3 size={24} /></button>
                  <button onClick={() => handleDelete(task.id)} className="flex-1 md:p-7 p-5 rounded-3xl flex items-center justify-center bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"><Trash2 size={24} /></button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 🚀 EDIT MODAL (Crystal Engine) */}
      {editTask && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 backdrop-blur-3xl bg-black/60">
          <div className={`${styles.card} p-12 rounded-[4rem] border w-full max-w-2xl`}>
            <div className={styles.innerShine}></div>
            <div className="flex justify-between items-center mb-10 relative z-20">
              <h3 className="text-4xl font-black italic uppercase tracking-tighter">Modify Entry</h3>
              <button onClick={() => setEditTask(null)} className="p-2 opacity-30 hover:opacity-100"><X size={32}/></button>
            </div>
            <div className="space-y-8 relative z-20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <input value={editTask.title} onChange={(e) => setEditTask({ ...editTask, title: e.target.value })} className={`w-full p-6 rounded-2xl border outline-none font-black text-xs uppercase ${styles.input}`} />
                <input type="date" value={editTask.date || ""} onChange={(e) => setEditTask({ ...editTask, date: e.target.value })} className={`w-full p-6 rounded-2xl border outline-none font-black text-xs ${styles.input}`} />
              </div>
              <textarea value={editTask.description} onChange={(e) => setEditTask({ ...editTask, description: e.target.value })} className={`w-full p-8 rounded-3xl border outline-none h-40 resize-none font-bold text-sm leading-relaxed ${styles.input}`} />
              <div className="flex gap-4">
                <button onClick={() => setEditTask(null)} className="flex-1 py-5 rounded-2xl font-black text-[10px] uppercase border border-white/10 opacity-40">Abort</button>
                <button onClick={handleUpdate} disabled={updating} className={`flex-[2] py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.4em] transition-all shadow-2xl ${dark ? 'bg-white text-black hover:bg-amber-500' : 'bg-purple-600 text-white'}`}>{updating ? "SYNCING..." : "Apply Mods"}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🏁 STABILIZED FOOTER */}
      <div className="pt-10 flex justify-center pb-12">
         <div className={`${styles.card} px-12 py-6 rounded-full border border-white/[0.08] flex items-center gap-6 shadow-2xl`}>
            <div className={styles.innerShine}></div>
            <ShieldCheck size={24} className={styles.accent}/>
            <p className="text-[10px] font-black uppercase italic tracking-[0.3em] opacity-60">Verified Ledger synchronization active.</p>
         </div>
      </div>
    </div>
  );
}