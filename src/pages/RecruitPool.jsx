import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc,
  serverTimestamp 
} from "firebase/firestore";
import { 
  Search, 
  Check, 
  X, 
  UserPlus, 
  Mail, 
  Fingerprint, 
  Building2,
  AlertCircle,
  Zap,
  ShieldCheck
} from "lucide-react";

export default function RecruitPool({ dark }) {
  const [pool, setPool] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // --- 🎨 💎 THE CRYSTAL CONSOLE ENGINE ---
  const theme = {
    card: dark 
      ? "bg-[#111111]/40 border-white/[0.08] shadow-2xl backdrop-blur-3xl" 
      : "bg-white/40 border-white shadow-xl backdrop-blur-2xl",
    text: dark ? "text-white" : "text-[#1e1b4b]",
    sub: dark ? "text-white/20" : "text-slate-400",
    accent: dark ? "text-amber-500" : "text-purple-600",
    accentBg: dark ? "bg-amber-500" : "bg-purple-600",
    tableRow: dark ? "hover:bg-white/[0.03] border-white/5" : "hover:bg-purple-50/50 border-purple-50",
    input: dark ? "bg-white/5 border-white/10 text-white focus:border-amber-500/40" : "bg-white border-slate-200 focus:border-purple-300",
    innerShine: "absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent pointer-events-none z-10",
    ambientGlow: dark 
      ? "fixed w-[600px] h-[600px] rounded-full bg-amber-500/5 blur-[150px] -z-20 pointer-events-none"
      : "fixed w-[600px] h-[600px] rounded-full bg-purple-500/5 blur-[150px] -z-20 pointer-events-none"
  };

  useEffect(() => {
    // 🎯 BULLETPROOF QUERY: Finds interns with NO mentor assigned
    // We check for [null, ""] to catch every unassigned candidate
    const q = query(
      collection(db, "users"),
      where("role", "==", "Intern"),
      where("mentorId", "in", [null, ""]) 
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      setPool(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (err) => {
      console.error("Recruitment Pool Sync Error:", err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // --- 🎯 RECRUITMENT PROTOCOLS ---
  const handleAccept = async (id, name) => {
    try {
      const internRef = doc(db, "users", id);
      await updateDoc(internRef, {
        mentorId: auth.currentUser.uid,
        isApproved: true,
        assignedAt: serverTimestamp()
      });
      // Intern instantly migrates to the Mentor Dashboard
    } catch (err) {
      alert("Protocol Refused: Mapping failed.");
    }
  };

  const handleReject = async (id, name) => {
    if (window.confirm(`CRITICAL: Permanent removal of ${name} from Hub Ledger?`)) {
      await deleteDoc(doc(db, "users", id));
    }
  };

  if (loading) return null;

  return (
    <div className={`w-full min-h-screen p-4 md:p-8 space-y-10 animate-in fade-in duration-1000 ${theme.text}`}>
      <div className={theme.ambientGlow} style={{ top: '-100px', left: '-100px' }}></div>
      <div className={theme.ambientGlow} style={{ bottom: '100px', right: '-100px' }}></div>

      {/* HEADER CONSOLE */}
      <div className={`${theme.card} p-10 md:p-14 rounded-[3.5rem] border flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden`}>
        <div className={theme.innerShine}></div>
        <div className="text-center md:text-left relative z-20">
          <p className={`text-[10px] font-black uppercase tracking-[0.6em] ${theme.sub} mb-3`}>Personnel Acquisition</p>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter italic uppercase leading-none">Recruit <span className={theme.accent}>Pool</span></h2>
        </div>
        
        <div className="relative group w-full md:w-96 z-20">
          <Search className={`absolute left-6 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 transition-all`} size={18} />
          <input 
            placeholder="FILTER BY IDENTITY / USN..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            className={`w-full pl-14 pr-8 py-5 rounded-[2rem] border outline-none font-black text-[10px] tracking-widest uppercase transition-all shadow-xl ${theme.input}`} 
          />
        </div>
      </div>

      {/* RECRUITMENT LEDGER (TABLE) */}
      <div className={`${theme.card} rounded-[3rem] border overflow-hidden relative group`}>
        <div className={theme.innerShine}></div>
        <div className="overflow-x-auto relative z-20">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b ${dark ? 'border-white/5' : 'border-slate-100'}`}>
                <th className={`p-8 text-[10px] font-black uppercase tracking-[0.4em] ${theme.sub}`}>Candidate Identity</th>
                <th className={`p-8 text-[10px] font-black uppercase tracking-[0.4em] ${theme.sub}`}>Department</th>
                <th className={`p-8 text-[10px] font-black uppercase tracking-[0.4em] ${theme.sub}`}>USN Identifier</th>
                <th className={`p-8 text-[10px] font-black uppercase tracking-[0.4em] ${theme.sub} text-center`}>Decision Matrix</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-transparent">
              {pool
                .filter(i => 
                  i.name?.toLowerCase().includes(search.toLowerCase()) || 
                  i.usn?.toLowerCase().includes(search.toLowerCase())
                )
                .map((intern) => (
                <tr key={intern.id} className={`${theme.tableRow} transition-all duration-300 group/row`}>
                  <td className="p-8">
                    <div className="flex items-center gap-5">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm italic shadow-2xl transition-transform group-hover/row:scale-110 ${dark ? 'bg-amber-500 text-black' : 'bg-purple-600 text-white'}`}>
                        {intern.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-black uppercase italic tracking-tight text-lg">{intern.name}</p>
                        <div className="flex items-center gap-2 opacity-40 mt-1">
                          <Mail size={12} />
                          <p className={`text-[9px] font-bold lowercase tracking-wider`}>{intern.email}</p>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-8">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${dark ? 'bg-white/5' : 'bg-purple-50'}`}>
                        <Building2 size={14} className={theme.accent} />
                      </div>
                      <span className="text-[11px] font-black uppercase tracking-widest">{intern.domain || "UNASSIGNED"}</span>
                    </div>
                  </td>
                  <td className="p-8">
                    <div className="flex items-center gap-3">
                      <Fingerprint size={16} className="opacity-20" />
                      <span className="text-[11px] font-black uppercase tracking-[0.2em] opacity-80">{intern.usn || "N/A"}</span>
                    </div>
                  </td>
                  <td className="p-8">
                    <div className="flex items-center justify-center gap-4">
                      <button 
                        onClick={() => handleAccept(intern.id, intern.name)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black uppercase text-[9px] tracking-[0.2em] transition-all active:scale-95 shadow-xl hover:-translate-y-1 ${
                          dark ? 'bg-white text-black hover:bg-amber-500' : 'bg-purple-600 text-white hover:bg-purple-700 shadow-purple-500/20'
                        }`}
                      >
                        <Check size={14} strokeWidth={3} /> Confirm
                      </button>
                      <button 
                        onClick={() => handleReject(intern.id, intern.name)}
                        className={`p-3 rounded-2xl border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all active:scale-90 shadow-lg`}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {pool.length === 0 && (
            <div className="py-40 text-center relative">
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.03]">
                <Zap size={200} />
              </div>
              <AlertCircle size={48} className={`mx-auto mb-6 ${theme.accent} opacity-20`} />
              <p className="text-[12px] font-black uppercase tracking-[0.6em] opacity-20 italic">Recruitment Pool Cleared</p>
            </div>
          )}
        </div>
      </div>

      {/* SYSTEM VERIFICATION DOCK */}
      <div className="flex justify-center pt-6">
         <div className={`${theme.card} px-12 py-5 rounded-full border border-white/[0.08] flex items-center gap-6 shadow-2xl transition-all hover:-translate-y-1`}>
            <div className={theme.innerShine}></div>
            <ShieldCheck size={24} className={theme.accent}/>
            <p className="text-[10px] font-black uppercase italic tracking-[0.3em] opacity-40 text-center leading-none">
              Direct Personnel Assignment Protocol Enabled. Verified Sync Active.
            </p>
         </div>
      </div>
    </div>
  );
}