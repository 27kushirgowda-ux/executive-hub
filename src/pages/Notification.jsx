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
  writeBatch
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { 
  ShieldCheck, 
  Calendar, 
  MessageSquare,
  ChevronRight,
  Inbox,
  Trash2,
  Zap,
  CheckCircle2 // 🎯 Fixed: Imported for the footer
} from "lucide-react";

export default function Remarks({ dark }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [remarks, setRemarks] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- 🎨 💎 THE CRYSTAL CONSOLE ENGINE ---
  const styles = {
    card: dark 
      ? "bg-[#111111]/40 border-white/[0.08] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] backdrop-blur-3xl hover:border-amber-500/30 transition-all duration-700 relative overflow-hidden group" 
      : "bg-white/40 border-white shadow-[0_15px_40px_rgba(120,119,198,0.1)] backdrop-blur-3xl hover:border-purple-300 transition-all duration-700 relative overflow-hidden group",
    text: dark ? "text-white" : "text-[#1e1b4b]",
    sub: dark ? "text-white/20" : "text-slate-400",
    accent: dark ? "text-amber-500" : "text-purple-600",
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
        setLoading(false);
      });

      const q = query(
        collection(db, "notifications"), 
        where("userId", "==", u.uid)
      );

      const unsubRemarks = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        data.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
        setRemarks(data);
      });

      return () => { unsubUser(); unsubRemarks(); };
    });
    return () => unsubAuth();
  }, [navigate]);

  const handleDelete = async (id) => {
    try { await deleteDoc(doc(db, "notifications", id)); } 
    catch (err) { console.error("Purge failed:", err); }
  };

  const handleClearAll = async () => {
    if (!window.confirm("Executive Decision: Wipe all hub remarks?")) return;
    const batch = writeBatch(db);
    remarks.forEach((r) => batch.delete(doc(db, "notifications", r.id)));
    try { await batch.commit(); } 
    catch (err) { alert("System Refusal: Clearance Failed."); }
  };

  if (loading) return null;

  return (
    <div className={`w-full min-h-screen p-4 md:p-8 flex flex-col space-y-10 animate-in fade-in duration-1000 ${styles.text}`}>
      
      {/* 🚨 AMBIENT GLOWS */}
      <div className={styles.ambientGlow} style={{ top: '-100px', right: '-100px' }}></div>
      <div className={styles.ambientGlow} style={{ bottom: '100px', left: '-100px' }}></div>

      {/* --- EXECUTIVE HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-20">
        <div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter italic uppercase leading-none">
            Hub <span className={styles.accent}>Remarks</span>
          </h1>
          <p className={`text-[10px] font-black uppercase tracking-[0.6em] ${styles.sub} mt-3`}>
            Supervisor Feedback & System Directives
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {remarks.length > 0 && (
            <button 
              onClick={handleClearAll}
              className={`px-6 py-3 rounded-full border text-[9px] font-black uppercase tracking-widest transition-all hover:bg-red-500 hover:text-white border-red-500/20 text-red-500`}
            >
              Purge Ledger
            </button>
          )}
          <div className={`inline-flex px-6 py-3 rounded-full border text-[10px] font-black uppercase tracking-widest ${
            dark ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 'bg-white border-white shadow-xl text-purple-600'
          }`}>
            {remarks.length} Dispatches
          </div>
        </div>
      </div>

      {/* --- REMARKS LIST --- */}
      <div className="space-y-6 relative z-20 flex-grow">
        {remarks.length === 0 ? (
          <div className={`${styles.card} py-32 text-center flex flex-col items-center rounded-[4rem]`}>
            <div className={styles.innerShine}></div>
            <Inbox size={64} strokeWidth={1} className="mb-6 opacity-20" />
            <p className="text-[11px] font-black uppercase tracking-[0.4em] opacity-30 text-center">
              No executive remarks recorded in hub archives.
            </p>
          </div>
        ) : (
          remarks.map((r) => (
            <div key={r.id} className={`${styles.card} p-8 md:p-12 rounded-[3.5rem] border group`}>
              <div className={styles.innerShine}></div>
              
              <div className="flex flex-col md:flex-row items-center gap-10 relative z-20">
                <div className={`w-16 h-16 rounded-[1.8rem] flex items-center justify-center transition-all duration-700 group-hover:rotate-12 ${
                  dark ? 'bg-amber-500/10 text-amber-500 shadow-xl' : 'bg-gradient-to-br from-pink-500 to-purple-700 text-white shadow-2xl'
                }`}>
                  <MessageSquare size={28} />
                </div>
                
                <div className="flex-1 text-center md:text-left min-w-0">
                  <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
                    <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${styles.accent}`}>
                      Supervisor Directive
                    </p>
                    <span className="hidden md:block opacity-20">•</span>
                    <div className="flex items-center justify-center md:justify-start gap-2 opacity-30">
                      <Calendar size={12} />
                      <p className="text-[9px] font-black uppercase tracking-widest">
                        {r.createdAt ? new Date(r.createdAt.seconds * 1000).toLocaleDateString().toUpperCase() : "RECENT"}
                      </p>
                    </div>
                  </div>

                  <p className="text-lg md:text-xl font-black italic uppercase tracking-tighter leading-tight">
                    "{r.message}"
                  </p>
                  
                  {/* 🎯 FIXED: Displaying ONLY the Project Name, not file details */}
                  {r.taskTitle && (
                    <div className="mt-6 flex items-center justify-center md:justify-start gap-3 opacity-60">
                      <ShieldCheck size={16} className={styles.accent} /> 
                      <p className="text-[10px] font-black uppercase tracking-widest">
                        Project: {r.taskTitle}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex gap-4 w-full md:w-auto">
                  <button 
                    onClick={() => handleDelete(r.id)}
                    className="flex-1 md:w-16 h-16 rounded-[1.5rem] flex items-center justify-center bg-red-500/5 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-lg"
                  >
                    <Trash2 size={22} />
                  </button>
                  <button 
                    onClick={() => navigate("/app/dashboard")}
                    className={`flex-1 md:w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all active:scale-90 ${
                      dark ? 'bg-white/5 border border-white/10 hover:bg-white/10 text-white' : 'bg-white border-white shadow-xl hover:bg-purple-600 hover:text-white'
                    }`}
                  >
                    <ChevronRight size={26} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 🏁 DOCK FOOTER: Remarks (Stabilized) */}
      <div className="flex justify-center pt-10 pb-12">
         <div className={`${styles.card} px-10 py-6 rounded-full border border-white/[0.08] flex items-center gap-6 shadow-2xl transition-all hover:-translate-y-2`}>
            <div className={styles.innerShine}></div>
            <CheckCircle2 size={24} className={styles.accent}/>
            <p className="text-[11px] font-black uppercase italic tracking-[0.25em] opacity-60 text-center">
              "{user?.lastRemark || "Standing by for executive hub synchronization."}"
            </p>
         </div>
      </div>
    </div>
  );
}