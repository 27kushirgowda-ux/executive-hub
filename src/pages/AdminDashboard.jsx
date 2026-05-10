import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { 
  Search, Trash2, ShieldCheck, UserCheck, UserMinus, 
  Users, Zap, Activity, Globe, Moon, Sun, ChevronRight
} from "lucide-react";

const AdminDashboard = ({ dark, setDark }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [toast, setToast] = useState(null);

  // --- THEME ENGINE ---
  const theme = {
    bg: dark ? "bg-[#0a0a0a]" : "bg-gradient-to-br from-[#fdf2f8] via-[#f5f3ff] to-[#eff6ff]",
    text: dark ? "text-white" : "text-[#2e1065]",
    card: dark ? "bg-[#161616]/60 border-white/5 shadow-2xl" : "bg-white/70 border-white shadow-xl shadow-purple-500/10",
    accent: dark ? "text-amber-500" : "text-pink-500",
    accentBg: dark ? "bg-amber-500" : "bg-gradient-to-r from-pink-500 to-purple-600",
    input: dark ? "bg-white/5 border-white/10" : "bg-white/50 border-white shadow-inner"
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (snap) => {
      setAllUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsubscribe();
  }, []);

  const mentors = allUsers.filter(u => u.role === "Mentor");
  const interns = allUsers.filter(u => u.role === "Intern");
  const pendingMentors = mentors.filter(m => !m.isApproved);
  const activeMentors = mentors.filter(m => m.isApproved && m.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const showNote = (msg, type) => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div className={`min-h-screen p-6 md:p-12 transition-all duration-700 font-sans ${theme.bg} ${theme.text}`}>
      
      {/* 👑 CONSOLE HEADER */}
      <header className="max-w-7xl mx-auto mb-12 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-5">
          <div className={`p-4 rounded-[2rem] shadow-2xl ${theme.accentBg} text-white`}>
            <ShieldCheck size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter">System <span className={theme.accent}>Console</span></h1>
            <p className="text-[10px] font-black tracking-[0.4em] opacity-30 uppercase">Auth Level: Root Administrator</p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-[350px]">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 opacity-20" size={18} />
            <input 
              type="text" placeholder="Search Identity..." 
              className={`w-full pl-14 pr-6 py-4 rounded-2xl border outline-none text-[10px] font-black uppercase tracking-widest transition-all backdrop-blur-xl ${theme.input}`}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button onClick={() => setDark(!dark)} className={`p-4 rounded-2xl border backdrop-blur-xl transition-all ${theme.input}`}>
            {dark ? <Sun size={20} className="text-amber-500" /> : <Moon size={20} className="text-purple-600" />}
          </button>
        </div>
      </header>

      {/* 📊 VITALS BAR */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        <StatBox label="Staff" val={mentors.length} icon={<Users size={16}/>} theme={theme} />
        <StatBox label="Personnel" val={interns.length} icon={<Activity size={16}/>} theme={theme} />
        <StatBox label="Pending" val={pendingMentors.length} icon={<Zap size={16}/>} theme={theme} />
        <StatBox label="Status" val="Live" icon={<Globe size={16}/>} theme={theme} />
      </div>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LEFT: APPROVALS & DIRECTORY */}
        <div className="lg:col-span-4 space-y-10">
          {/* MENTOR AUTHORIZATION */}
          <section className={`p-8 rounded-[3rem] border backdrop-blur-3xl ${theme.card}`}>
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] mb-8 flex items-center gap-2 opacity-40">
              <UserCheck size={16} className={theme.accent} /> Pending Access
            </h2>
            <div className="space-y-4">
              {pendingMentors.map(m => (
                <div key={m.id} className={`p-6 rounded-[2rem] border transition-all ${theme.input} hover:border-amber-500/50`}>
                  <h3 className="font-black uppercase italic text-sm mb-4">{m.name}</h3>
                  <button 
                    onClick={() => updateDoc(doc(db, "users", m.id), { isApproved: true })}
                    className={`w-full py-3 rounded-xl font-black uppercase text-[9px] tracking-widest shadow-lg transition-all active:scale-95 ${theme.accentBg} text-white`}
                  >
                    Authorize Lead
                  </button>
                </div>
              ))}
              {pendingMentors.length === 0 && <p className="text-center py-6 text-[9px] font-black opacity-20 uppercase tracking-widest italic">Encrypted & Secure</p>}
            </div>
          </section>

          {/* ACTIVE DIRECTORY */}
          <section>
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 opacity-30">Active Department Leads</h2>
            <div className="space-y-3">
              {activeMentors.map(m => (
                <div 
                  key={m.id} onClick={() => setSelectedMentor(m)}
                  className={`p-6 rounded-[2rem] border cursor-pointer transition-all flex justify-between items-center ${selectedMentor?.id === m.id ? `border-pink-500 ${dark ? 'bg-amber-500/10' : 'bg-white'}` : `${theme.card} hover:scale-105`}`}
                >
                  <div>
                    <h3 className="font-black italic uppercase text-sm leading-none mb-1">{m.name}</h3>
                    <p className={`text-[8px] font-black uppercase tracking-widest ${theme.accent}`}>{m.domain}</p>
                  </div>
                  <ChevronRight size={16} className="opacity-20" />
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT: DEPARTMENT DRILL-DOWN */}
        <div className="lg:col-span-8">
          {selectedMentor ? (
            <div className={`p-10 rounded-[4rem] border h-full backdrop-blur-3xl ${theme.card}`}>
              <div className="flex justify-between items-start mb-12">
                <div>
                  <h2 className="text-5xl font-black italic uppercase tracking-tighter">
                    Team <span className={theme.accent}>{selectedMentor.name.split(' ')[0]}</span>
                  </h2>
                  <p className="text-[10px] font-black opacity-30 uppercase tracking-[0.4em] mt-2">{selectedMentor.domain} Operations</p>
                </div>
                <button 
                  onClick={() => deleteDoc(doc(db, "users", selectedMentor.id))}
                  className="p-4 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/10"
                >
                  <UserMinus size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.5em] opacity-20 mb-6">Assigned Personnel</h3>
                {interns.filter(i => i.mentorId === selectedMentor.id).map(intern => (
                  <div key={intern.id} className={`p-6 rounded-[2.5rem] border flex items-center justify-between backdrop-blur-xl ${theme.input}`}>
                    <div>
                      <h4 className="font-black uppercase italic text-md">{intern.name}</h4>
                      <p className="text-[9px] font-bold opacity-30 uppercase tracking-widest">{intern.usn}</p>
                    </div>
                    <div className="flex gap-3">
                      <select 
                        onChange={(e) => updateDoc(doc(db, "users", intern.id), { mentorId: e.target.value })}
                        className={`p-3 rounded-xl text-[8px] font-black uppercase outline-none border transition-all ${theme.input}`}
                      >
                        <option value="">Move Dept</option>
                        {mentors.filter(m => m.id !== selectedMentor.id && m.isApproved).map(m => (
                          <option key={m.id} value={m.id}>{m.name}</option>
                        ))}
                      </select>
                      <button 
                        onClick={() => deleteDoc(doc(db, "users", intern.id))}
                        className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className={`h-full min-h-[500px] flex flex-col items-center justify-center rounded-[4rem] border-2 border-dashed ${dark ? 'border-white/5' : 'border-purple-200'} opacity-20`}>
              <Activity size={80} className="mb-6 animate-pulse" />
              <p className="text-[12px] font-black uppercase tracking-[0.6em]">Awaiting Selection</p>
            </div>
          )}
        </div>
      </main>

      {/* TOAST SYSTEM */}
      {toast && (
        <div className={`fixed bottom-10 right-10 p-6 rounded-[2rem] border backdrop-blur-2xl shadow-2xl animate-bounce-in ${theme.card}`}>
          <p className="text-[10px] font-black uppercase tracking-widest">{toast.msg}</p>
        </div>
      )}
    </div>
  );
};

// --- HELPER COMPONENTS ---
const StatBox = ({ label, val, icon, theme }) => (
  <div className={`p-8 rounded-[2.5rem] border backdrop-blur-3xl transition-all hover:-translate-y-2 ${theme.card}`}>
    <div className={`mb-4 p-3 inline-block rounded-2xl ${theme.input} ${theme.accent}`}>
      {icon}
    </div>
    <h3 className="text-3xl font-black italic tracking-tighter mb-1">{val}</h3>
    <p className="text-[9px] font-black uppercase tracking-widest opacity-30">{label}</p>
  </div>
);

export default AdminDashboard;