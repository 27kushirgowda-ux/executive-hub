import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
  serverTimestamp
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Trash2, 
  Edit2, 
  BellRing, 
  Link2,
  Zap,
  ChevronDown,
  ShieldCheck,
  Calendar,
  AlertTriangle
} from "lucide-react";

export default function Schedule({ dark }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [activeAlert, setActiveAlert] = useState(null); // 🎯 THE NOTIFICATION POP-UP STATE
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [mentorInput, setMentorInput] = useState("");
  const [linking, setLinking] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    priority: "medium",
    category: "general",
  });

  const getLocalDateString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const styles = {
    card: dark 
      ? "bg-[#111111]/40 border-white/[0.08] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] backdrop-blur-3xl hover:border-amber-500/30 transition-all duration-700 relative overflow-hidden group" 
      : "bg-white/40 border-white shadow-[0_20px_50px_rgba(120,119,198,0.1)] backdrop-blur-3xl hover:border-purple-300 transition-all duration-700 relative overflow-hidden group",
    text: dark ? "text-white" : "text-[#1e1b4b]",
    sub: dark ? "text-white/20" : "text-slate-400",
    accent: dark ? "text-amber-500" : "text-purple-600",
    input: dark ? "bg-white/5 border-white/10 text-white placeholder:text-white/10" : "bg-white/60 border-white shadow-sm text-slate-900",
    innerShine: "absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-transparent pointer-events-none z-10",
    ambientGlow: dark 
      ? "fixed w-[600px] h-[600px] rounded-full bg-amber-500/10 blur-[150px] -z-20 pointer-events-none"
      : "fixed w-[600px] h-[600px] rounded-full bg-purple-500/10 blur-[150px] -z-20 pointer-events-none"
  };

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (u) => {
      if (!u) return navigate("/Login");
      const unsubUser = onSnapshot(doc(db, "users", u.uid), (snap) => {
        if (snap.exists()) setUser(snap.data());
        setLoading(false);
      });
      const q = query(collection(db, "scheduledTasks"), where("userId", "==", u.uid));
      const unsubTasks = onSnapshot(q, (snap) => {
        setTasks(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });
      return () => { unsubUser(); unsubTasks(); };
    });
    return () => unsubAuth();
  }, [navigate]);

  // --- ⏰ ALERT ENGINE: MONITORING SYSTEM TIME ---
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const currentTime = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
      const currentDate = getLocalDateString(now);

      tasks.forEach(task => {
        if (task.date === currentDate && task.time === currentTime && !task.alertTriggered) {
          setActiveAlert(task); // 🚀 Trigger the Visual Pop-up
          updateDoc(doc(db, "scheduledTasks", task.id), { alertTriggered: true });
        }
      });
    }, 10000); // Scans ledger every 10 seconds
    return () => clearInterval(timer);
  }, [tasks]);

  const handleJoinHub = async () => {
    if (!mentorInput || mentorInput.trim().length < 5) return alert("Security Alert: Invalid Identifier");
    setLinking(true);
    try {
      const mentorRef = doc(db, "users", mentorInput.trim());
      const mentorSnap = await getDoc(mentorRef);
      if (!mentorSnap.exists() || mentorSnap.data().role !== "Mentor") {
        alert("Mapping Error: Protocol Refused. Target is not a verified Mentor.");
        setLinking(false);
        return;
      }
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        mentorId: mentorInput.trim(),
        mappingDate: new Date().toISOString()
      });
    } catch (err) { alert("Handshake Failed."); } finally { setLinking(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await updateDoc(doc(db, "scheduledTasks", editingTask.id), { ...formData, updatedAt: serverTimestamp(), alertTriggered: false });
      } else {
        await addDoc(collection(db, "scheduledTasks"), { ...formData, userId: user.uid, createdAt: serverTimestamp(), alertTriggered: false });
      }
      setShowModal(false);
      setEditingTask(null);
    } catch (err) { console.error(err); }
  };

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  if (loading) return null;

  // --- 🛡️ GATEKEEPER VIEW ---
  if (!user?.mentorId || user?.mentorId.trim() === "") {
    return (
      <div className="flex items-center justify-center py-20 px-4 min-h-screen">
        <div className={styles.ambientGlow} style={{ top: '20%', left: '30%' }}></div>
        <div className={`${styles.card} p-12 rounded-[3.5rem] border text-center max-w-lg w-full`}>
          <div className={styles.innerShine}></div>
          <Link2 size={40} className={`mx-auto mb-6 ${styles.accent}`} />
          <h2 className={`text-3xl font-black uppercase italic tracking-tighter mb-8 ${styles.text}`}>Establish Hub Link</h2>
          <input placeholder="ENTER MENTOR ID..." value={mentorInput} onChange={(e) => setMentorInput(e.target.value)} className={`w-full p-5 rounded-2xl border outline-none text-center mb-6 z-20 relative ${styles.input}`} />
          <button onClick={handleJoinHub} disabled={linking} className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest z-20 relative ${dark ? 'bg-white text-black hover:bg-amber-500' : 'bg-[#1e1b4b] text-white'}`}>{linking ? "SYNCING..." : "Initialize Mapping"}</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full p-2 md:p-6 space-y-10 animate-in fade-in duration-1000 ${styles.text}`}>
      
      <div className={styles.ambientGlow} style={{ top: '-100px', left: '-100px' }}></div>
      <div className={styles.ambientGlow} style={{ bottom: '100px', right: '-100px' }}></div>

      <div className="px-4">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter italic uppercase leading-none">
          System <span className={styles.accent}>Schedule</span>
        </h1>
        <p className={`text-[10px] font-black uppercase tracking-[0.6em] ${styles.sub} mt-3`}>Strategic Timeline Allocation</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-4">
          <div className={`${styles.card} p-10 rounded-[3.5rem] border`}>
            <div className={styles.innerShine}></div>
            <div className="flex justify-between items-center mb-10 relative z-20">
              <h3 className="text-2xl font-black italic uppercase tracking-tighter px-2">{currentMonth.toLocaleString("default", { month: "long" })}</h3>
              <div className="flex gap-2">
                <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))} className="p-2 opacity-30 hover:opacity-100 transition"><ChevronLeft size={20}/></button>
                <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))} className="p-2 opacity-30 hover:opacity-100 transition"><ChevronRight size={20}/></button>
              </div>
            </div>
            
            <div className="grid grid-cols-7 gap-1 text-center relative z-20">
              {["S","M","T","W","T","F","S"].map(d => <span key={d} className="text-[9px] font-black opacity-20">{d}</span>)}
              {Array.from({ length: firstDay }).map((_, i) => <div key={i}></div>)}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                const isSel = getLocalDateString(d) === getLocalDateString(selectedDate);
                const hasT = tasks.some(t => t.date === getLocalDateString(d));
                return (
                  <button key={day} onClick={() => setSelectedDate(d)} className={`py-4 text-[11px] font-black rounded-2xl transition-all relative ${isSel ? (dark ? "bg-amber-500 text-black shadow-lg" : "bg-purple-600 text-white shadow-xl") : "hover:bg-current/5"}`}>
                    {day}
                    {hasT && !isSel && <span className={`absolute bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${styles.accent} animate-pulse`}></span>}
                  </button>
                );
              })}
            </div>
            
            <button onClick={() => { setFormData({title:"", description:"", date:getLocalDateString(selectedDate), time:"", priority:"medium", category:"general"}); setEditingTask(null); setShowModal(true); }} className={`w-full mt-10 py-6 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl transition-all active:scale-95 z-20 relative ${dark ? 'bg-white text-black hover:bg-amber-500' : 'bg-[#1e1b4b] text-white'}`}>+ New Directive</button>
          </div>
        </div>

        <div className="lg:col-span-8">
          <div className={`${styles.card} p-12 rounded-[4rem] border min-h-[500px]`}>
            <div className={styles.innerShine}></div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter italic uppercase mb-12 relative z-20">
              {selectedDate.toLocaleDateString("default", { weekday: "long", day: "numeric" })}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-20">
              {tasks.filter(t => t.date === getLocalDateString(selectedDate)).length === 0 ? (
                <div className="col-span-full py-20 text-center opacity-20"><Zap size={64} className="mx-auto mb-6" /><p className="text-[11px] font-black uppercase tracking-[0.4em]">Zero operational events</p></div>
              ) : (
                tasks.filter(t => t.date === getLocalDateString(selectedDate)).map(task => (
                  <div key={task.id} className={`${styles.card} p-8 rounded-[3rem] border group transition-all duration-500 hover:scale-[1.03]`}>
                    <div className={styles.innerShine}></div>
                    <div className="flex justify-between items-start mb-6 relative z-20">
                      <h3 className="text-2xl font-black tracking-tighter italic uppercase truncate pr-4">{task.title}</h3>
                      <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <button onClick={() => { setEditingTask(task); setFormData(task); setShowModal(true); }} className={styles.accent}><Edit2 size={18}/></button>
                        <button onClick={async () => { await deleteDoc(doc(db, "scheduledTasks", task.id)); }} className="text-red-500"><Trash2 size={18}/></button>
                      </div>
                    </div>
                    <div className="flex gap-3 relative z-20">
                      <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${dark ? 'bg-amber-500/10 text-amber-500' : 'bg-purple-100 text-purple-600'}`}>{task.time}</span>
                      <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest bg-white/5 opacity-40`}>{task.priority}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 🚀 🎯 PROTOCOL NOTIFICATION POP-UP */}
      {activeAlert && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/80 backdrop-blur-3xl animate-in fade-in duration-500">
          <div className={`${styles.card} p-12 md:p-20 rounded-[4rem] w-full max-w-xl border-2 border-amber-500/50 text-center animate-in zoom-in duration-300 relative`}>
            <div className="absolute inset-0 bg-amber-500/5 animate-pulse pointer-events-none"></div>
            <BellRing size={80} className={`${styles.accent} mx-auto mb-10 animate-bounce`} />
            <h3 className="text-5xl font-black italic uppercase tracking-tighter mb-4 leading-none">System Alert</h3>
            <p className="text-[10px] font-black uppercase tracking-[0.6em] mb-10 opacity-40 italic">Directive Execution Required</p>
            
            <div className={`p-8 rounded-[2.5rem] mb-10 border ${dark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
               <h4 className="text-3xl font-black tracking-tighter uppercase mb-2">{activeAlert.title}</h4>
               <p className="text-xs font-bold leading-relaxed opacity-60">{activeAlert.description || "Refer to Ledger for operational details."}</p>
            </div>

            <button onClick={() => setActiveAlert(null)} className={`w-full py-6 rounded-3xl font-black text-[11px] uppercase tracking-[0.4em] shadow-2xl transition-all active:scale-95 ${dark ? 'bg-white text-black hover:bg-amber-500' : 'bg-[#1e1b4b] text-white'}`}>Acknowledge Protocol</button>
          </div>
        </div>
      )}

      {/* directive modal same as before */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-3xl flex items-center justify-center z-[600] p-6 animate-in fade-in duration-500">
          <div className={`${styles.card} p-12 md:p-16 rounded-[4rem] w-full max-w-2xl border animate-in zoom-in duration-300`}>
            <div className={styles.innerShine}></div>
            <div className="flex justify-between items-center mb-12 relative z-20">
              <h3 className="text-4xl font-black italic uppercase tracking-tighter">{editingTask ? "Update" : "New"} Directive</h3>
              <button onClick={() => setShowModal(false)} className="opacity-30 hover:opacity-100"><X size={40}/></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-8 relative z-20">
              <input required placeholder="EVENT HEADING" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className={`w-full p-6 rounded-[1.8rem] border outline-none font-black text-xs uppercase tracking-widest ${styles.input}`} />
              <textarea placeholder="DESCRIPTION" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className={`w-full p-8 rounded-[2.2rem] border outline-none font-bold text-sm leading-relaxed h-32 resize-none ${styles.input}`} />
              <div className="grid grid-cols-2 gap-8">
                <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className={`w-full p-6 rounded-[1.8rem] border outline-none font-black text-xs ${styles.input}`} />
                <input type="time" required value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className={`w-full p-6 rounded-[1.8rem] border outline-none font-black text-xs ${styles.input}`} />
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div className="relative group">
                  <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})} className={`w-full p-6 rounded-[1.8rem] border outline-none font-black text-[10px] uppercase tracking-widest appearance-none cursor-pointer ${styles.input}`}>
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                  <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 opacity-30 pointer-events-none" size={20} />
                </div>
                <div className="relative group">
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className={`w-full p-6 rounded-[1.8rem] border outline-none font-black text-[10px] uppercase tracking-widest appearance-none cursor-pointer ${styles.input}`}>
                    <option value="general">General Hub</option>
                    <option value="work">Strategic Work</option>
                  </select>
                  <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 opacity-30 pointer-events-none" size={20} />
                </div>
              </div>
              <button type="submit" className={`w-full py-7 rounded-[2.5rem] font-black text-[12px] uppercase tracking-[0.4em] shadow-2xl transition-all active:scale-95 ${dark ? 'bg-white text-black hover:bg-amber-500' : 'bg-[#1e1b4b] text-white'}`}>Finalize Entry</button>
            </form>
          </div>
        </div>
      )}

      <div className="pt-10 flex justify-center pb-12">
         <div className={`${styles.card} px-10 py-6 rounded-full border border-white/[0.08] flex items-center gap-6 shadow-2xl transition-all hover:-translate-y-2`}>
            <div className={styles.innerShine}></div>
            <ShieldCheck size={24} className={styles.accent}/>
            <p className="text-[10px] font-black uppercase italic tracking-[0.25em] opacity-40 text-center leading-none">Verified Strategic Timeline Active.</p>
         </div>
      </div>
    </div>
  );
}