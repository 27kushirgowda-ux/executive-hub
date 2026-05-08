import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase"; 
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Sun, Moon, ArrowLeft, ShieldCheck } from "lucide-react"; // Optional: if you have lucide-react

const AdminLogin = ({ dark, setDark }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // --- DYNAMIC THEMING ---
  const containerStyle = dark ? "bg-[#0a0a0a] text-white" : "bg-[#f8fafc] text-slate-900";
  const cardStyle = dark 
    ? "bg-[#121212] border-white/5 shadow-2xl" 
    : "bg-white border-slate-200 shadow-xl";
  const inputStyle = dark 
    ? "bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-yellow-500" 
    : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-500";

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
      
      if (userDoc.exists() && userDoc.data().role === "admin") {
        navigate("/admin-dashboard");
      } else {
        alert("Access Denied: Admin role missing.");
        auth.signOut();
      }
    } catch (error) {
      alert("Invalid Admin Credentials");
    }
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 transition-all duration-500 ${containerStyle}`}>
      
      {/* 🌓 THEME TOGGLE BUTTON (Top Right) */}
      <button 
        onClick={() => setDark(!dark)}
        className={`absolute top-6 right-6 p-3 rounded-2xl border transition-all ${dark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'}`}
      >
        {dark ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} className="text-blue-500" />}
      </button>

      {/* 🏷️ TAG */}
      <div className={`mb-6 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border animate-pulse ${
        dark ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500' : 'bg-blue-50 border-blue-200 text-blue-600'
      }`}>
        Oversight Engine v4.0
      </div>

      {/* 🏛️ HEADER */}
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none">
          {dark ? (
            <>INTER<span className="text-yellow-500">TRACK</span></>
          ) : (
            <span className="bg-gradient-to-r from-[#e91e63] to-[#2196f3] bg-clip-text text-transparent">
              INTERTRACK
            </span>
          )}
        </h1>
        <p className="text-[10px] md:text-xs font-bold tracking-[0.5em] uppercase mt-3 opacity-40">
          Administrative Gateway
        </p>
      </div>

      {/* 💳 LOGIN CARD */}
      <div className={`w-full max-w-md p-8 md:p-12 rounded-[2.5rem] border transition-all duration-500 ${cardStyle}`}>
        <div className="flex items-center gap-4 mb-8">
          <div className={`p-3 rounded-2xl ${dark ? 'bg-yellow-500/20' : 'bg-blue-50'}`}>
            <ShieldCheck className={dark ? "text-yellow-500" : "text-blue-500"} />
          </div>
          <h2 className="text-2xl font-black italic uppercase">Login</h2>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2">Identity</label>
            <input 
              type="email" 
              placeholder="admin@interntrack.com" 
              className={`w-full p-4 rounded-2xl border outline-none transition-all font-medium ${inputStyle}`}
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-2">Token</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className={`w-full p-4 rounded-2xl border outline-none transition-all font-medium ${inputStyle}`}
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          <button 
            type="submit" 
            className={`w-full py-5 mt-4 rounded-2xl font-black italic uppercase tracking-widest text-xs transition-all active:scale-95 shadow-xl ${
              dark 
              ? 'bg-white text-black hover:bg-yellow-500 hover:text-black' 
              : 'bg-gradient-to-r from-[#e91e63] to-[#2196f3] text-white hover:opacity-90'
            }`}
          >
            Authorize Entry
          </button>
        </form>

        <button 
          onClick={() => navigate("/")}
          className="w-full mt-8 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-30 hover:opacity-100 transition-opacity"
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </button>
      </div>

      <footer className="mt-12 text-[9px] font-black opacity-20 tracking-[0.6em] uppercase text-center">
        Encrypted Session &bull; Bengaluru Site
      </footer>
    </div>
  );
};

export default AdminLogin;