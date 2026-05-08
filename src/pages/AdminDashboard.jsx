import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Sun, Moon, Trash2, ShieldCheck, Users, GraduationCap, Phone, MapPin } from "lucide-react";

const AdminDashboard = ({ dark, setDark }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // --- DYNAMIC STYLES ---
  const containerClass = dark ? "bg-[#0a0a0a] text-white" : "bg-[#f8fafc] text-slate-900";
  const cardClass = dark ? "bg-[#111111] border-white/5" : "bg-white border-slate-200 shadow-xl";
  const itemClass = dark ? "bg-white/5 border-white/5" : "bg-slate-50 border-slate-100";

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // --- SORT BY DOMAIN (As seen in your screenshot) ---
        const sortedData = data.sort((a, b) => 
          (a.domain || "").localeCompare(b.domain || "")
        );
        
        setUsers(sortedData);
      } catch (error) {
        console.error("Firebase Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id, name) => {
    if(window.confirm(`Revoke access for ${name}?`)) {
      try {
        await deleteDoc(doc(db, "users", id));
        setUsers(users.filter(u => u.id !== id));
      } catch (error) { alert("Error removing user."); }
    }
  };

  return (
    <div className={`min-h-screen p-4 md:p-12 transition-all duration-700 ${containerClass}`}>
      
      {/* 🌓 HEADER */}
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-12">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-2xl ${dark ? 'bg-yellow-500/20' : 'bg-blue-100'}`}>
            <ShieldCheck className={dark ? "text-yellow-500" : "text-blue-600"} />
          </div>
          <div>
            <h1 className="text-2xl md:text-4xl font-black italic uppercase tracking-tighter">
              System <span className={dark ? "text-yellow-500" : "text-blue-600"}>Console</span>
            </h1>
            <p className="text-[10px] font-bold tracking-[0.3em] opacity-40 uppercase text-left">Departmental Oversight</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => setDark(!dark)} className={`p-3 rounded-2xl border ${dark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'}`}>
            {dark ? <Sun size={18} className="text-yellow-500" /> : <Moon size={18} className="text-blue-500" />}
          </button>
          <button onClick={() => navigate("/")} className={`px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest ${dark ? 'bg-white text-black' : 'bg-slate-900 text-white'}`}>
            Exit
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 gap-12">
        
        {/* --- MENTORS SECTION (Filtering for "Mentor") --- */}
        <section className={`p-6 md:p-10 rounded-[3rem] border ${cardClass}`}>
          <h2 className="text-2xl font-black italic uppercase mb-8 flex items-center gap-3">
            <Users className="text-blue-500" /> Mentors
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {users.filter(u => u.role === 'Mentor').map(user => (
              <div key={user.id} className={`p-6 rounded-[2rem] border transition-all ${itemClass}`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-black uppercase italic text-lg">{user.name || "Nishtha Singh"}</h3>
                    <span className="text-[9px] font-black px-2 py-1 bg-blue-500/10 text-blue-500 rounded-md border border-blue-500/20 uppercase">
                      Domain: {user.domain || "Computer Science"}
                    </span>
                  </div>
                  <button onClick={() => handleDelete(user.id, user.name)} className="p-2 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="space-y-1 text-[11px] font-bold opacity-60 uppercase">
                  <div className="flex items-center gap-2"><Phone size={12}/> {user.mobile || "N/A"}</div>
                  <div className="flex items-center gap-2"><MapPin size={12}/> {user.email}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- INTERNS SECTION (Filtering for "Intern") --- */}
        <section className={`p-6 md:p-10 rounded-[3rem] border ${cardClass}`}>
          <h2 className="text-2xl font-black italic uppercase mb-8 flex items-center gap-3">
            <GraduationCap className="text-green-500" /> Active Interns
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {users.filter(u => u.role === 'Intern').map(user => (
              <div key={user.id} className={`p-6 rounded-[2rem] border transition-all ${itemClass}`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-black uppercase italic text-lg">{user.name || "Jain"}</h3>
                    <div className="flex gap-2 mt-1">
                      <span className="text-[9px] font-black px-2 py-1 bg-green-500/10 text-green-500 rounded-md border border-green-500/20 uppercase">UID: {user.uid?.substring(0, 8) || "N/A"}</span>
                      <span className="text-[9px] font-black px-2 py-1 bg-purple-500/10 text-purple-500 rounded-md border border-purple-500/20 uppercase">{user.domain}</span>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(user.id, user.name)} className="p-2 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all">
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="space-y-1 text-[11px] font-bold opacity-60 uppercase">
                  <div className="flex items-center gap-2"><Phone size={12}/> {user.mobile || "No Contact"}</div>
                  <div className="flex items-center gap-2"><MapPin size={12}/> {user.email}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default AdminDashboard;