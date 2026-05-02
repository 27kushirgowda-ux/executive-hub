import { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  User, 
  Building2, 
  Hash, 
  Eye, 
  EyeOff,
  ChevronDown,
  Sparkles
} from "lucide-react";

export default function Signup({ dark }) {
  const navigate = useNavigate();
  
  // --- FORM STATES ---
  const [role, setRole] = useState("Intern");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [usn, setUsn] = useState("");
  const [domain, setDomain] = useState(""); 
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // --- UI STATES ---
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // --- 🎨 💎 THE CRYSTAL CONSOLE ENGINE ---
  const styles = {
    bg: dark 
      ? "bg-[#0a0a0a]" 
      : "bg-gradient-to-br from-[#fdf2f8] via-[#f5f3ff] to-[#eff6ff]",
    card: dark 
      ? "bg-[#111111]/40 border-white/[0.08] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] backdrop-blur-3xl" 
      : "bg-white/40 border-white shadow-[0_20px_50px_rgba(120,119,198,0.1)] backdrop-blur-3xl",
    input: dark 
      ? "bg-white/5 border-white/10 text-white placeholder:text-white/10 focus:border-amber-500/50" 
      : "bg-white/60 border-white shadow-sm text-slate-900 placeholder:text-slate-300 focus:border-purple-400",
    option: dark ? "bg-[#1a1a1a] text-white" : "bg-white text-[#1e1b4b]",
    text: dark ? "text-white" : "text-[#1e1b4b]",
    subText: dark ? "text-white/20" : "text-slate-400",
    accent: dark ? "text-amber-500" : "text-purple-600",
    innerShine: "absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent pointer-events-none z-10",
    ambientGlow: dark 
      ? "fixed w-[600px] h-[600px] rounded-full bg-amber-500/5 blur-[150px] -z-20 pointer-events-none"
      : "fixed w-[600px] h-[600px] rounded-full bg-purple-500/5 blur-[150px] -z-20 pointer-events-none"
  };

  const handleSignup = async () => {
    setError("");
    
    // 1. Purely Frontend Validation
    if (!name || !email || !password) {
      setError("Registration Denied: All fields required.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Registration Denied: Key mismatch.");
      return;
    }

    setLoading(true);
    try {
      // 2. Auth Instance Creation
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      // 3. Preparation of Local Data Ledger
      const userData = {
        uid: user.uid,
        name: name.trim(),
        email: user.email.toLowerCase(),
        role: role,
        createdAt: serverTimestamp(),
        domain: domain.trim() || "General Systems",
        mentorId: "", 
        mobile: "", 
        showMobile: true,
        uploadDeadline: "18:00",
      };

      if (role === "Intern") {
        userData.usn = usn.trim().toUpperCase() || "N/A";
        userData.progress = 0;
        userData.internshipDuration = 90;
      } else {
        userData.internsCount = 0;
        userData.hubActive = true;
      }

      // 4. Firestore Commit
      await setDoc(doc(db, "users", user.uid), userData);

      // 5. Force session termination to prevent identity bleed
      await signOut(auth); 
      
      navigate("/Login");
      
    } catch (err) {
      // 🎯 THE SILENCE FIX: All backend errors are funneled into one generic frontend message.
      setError("Sync Error: Protocol refused. Check input format.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center relative overflow-hidden p-6 transition-all duration-700 ${styles.bg}`}>
      
      <div className={styles.ambientGlow} style={{ top: '-100px', left: '-100px' }}></div>
      <div className={styles.ambientGlow} style={{ bottom: '100px', right: '-100px' }}></div>

      <div className={`relative z-20 w-full max-w-lg p-10 md:p-14 rounded-[4rem] border transition-all duration-500 overflow-hidden ${styles.card}`}>
        <div className={styles.innerShine}></div>

        {/* HEADER */}
        <div className="text-center mb-12 relative z-20">
          <div className={`inline-flex p-4 rounded-3xl mb-6 shadow-2xl transition-all duration-700 ${dark ? 'bg-amber-500 text-black shadow-amber-500/20' : 'bg-purple-600 text-white shadow-purple-600/20'}`}>
            <ShieldCheck size={36} />
          </div>
          <h2 className={`text-4xl md:text-5xl font-black tracking-tighter italic uppercase leading-none ${styles.text}`}>
            Join <span className={styles.accent}>Hub</span>
          </h2>
          <p className={`text-[10px] font-black uppercase tracking-[0.5em] mt-4 ${styles.subText}`}>Identity Registration Terminal</p>
        </div>

        {/* GENERIC ERROR FEEDBACK */}
        {error && (
          <div className="mb-8 p-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-[0.2em] text-center animate-bounce">
            {error}
          </div>
        )}

        <div className="space-y-5 relative z-20">
          
          {/* ROLE SELECTOR */}
          <div className="relative group">
             <User className={`absolute left-6 top-1/2 -translate-y-1/2 transition-colors ${styles.subText}`} size={18} />
             <select
               value={role}
               onChange={(e) => setRole(e.target.value)}
               className={`w-full pl-16 pr-12 py-5 rounded-[2rem] border outline-none appearance-none font-black text-xs uppercase tracking-widest cursor-pointer transition-all ${styles.input}`}
             >
               <option value="Intern" className={styles.option}>Candidate Intern</option>
               <option value="Mentor" className={styles.option}>Executive Mentor</option>
             </select>
             <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none opacity-30">
                <ChevronDown size={18} />
             </div>
          </div>

          <div className="relative">
            <Sparkles className={`absolute left-6 top-1/2 -translate-y-1/2 ${styles.subText}`} size={18} />
            <input 
              placeholder="Full Legal Name" 
              autoComplete="off"
              onChange={(e) => setName(e.target.value)} 
              className={`w-full pl-16 pr-8 py-5 rounded-[2rem] border outline-none font-bold text-sm tracking-tight transition-all ${styles.input}`} 
            />
          </div>

          <div className="relative">
            <Mail className={`absolute left-6 top-1/2 -translate-y-1/2 ${styles.subText}`} size={18} />
            <input 
              type="email"
              placeholder="Official Email" 
              autoComplete="off"
              onChange={(e) => setEmail(e.target.value)} 
              className={`w-full pl-16 pr-8 py-5 rounded-[2rem] border outline-none font-bold text-sm tracking-tight transition-all ${styles.input}`} 
            />
          </div>
          
          {role === "Intern" ? (
            <div className="relative animate-in slide-in-from-left duration-500">
              <Hash className={`absolute left-6 top-1/2 -translate-y-1/2 ${styles.subText}`} size={18} />
              <input 
                placeholder="College USN / ID" 
                onChange={(e) => setUsn(e.target.value)} 
                className={`w-full pl-16 pr-8 py-5 rounded-[2rem] border outline-none font-bold text-sm tracking-tight transition-all ${styles.input}`} 
              />
            </div>
          ) : (
            <div className="relative animate-in slide-in-from-right duration-500">
              <Building2 className={`absolute left-6 top-1/2 -translate-y-1/2 ${styles.subText}`} size={18} />
              <input 
                placeholder="Expert Domain" 
                onChange={(e) => setDomain(e.target.value)} 
                className={`w-full pl-16 pr-8 py-5 rounded-[2rem] border outline-none font-bold text-sm tracking-tight transition-all ${styles.input}`} 
              />
            </div>
          )}

          <div className="relative">
            <Lock className={`absolute left-6 top-1/2 -translate-y-1/2 ${styles.subText}`} size={18} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Access Key"
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full pl-16 pr-16 py-5 rounded-[2rem] border outline-none font-bold text-sm tracking-tight transition-all ${styles.input}`}
            />
            <button onClick={() => setShowPassword(!showPassword)} className={`absolute right-8 top-1/2 -translate-y-1/2 hover:scale-120 transition-all ${styles.subText}`} type="button">
              {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
            </button>
          </div>

          <div className="relative">
            <Lock className={`absolute left-6 top-1/2 -translate-y-1/2 ${styles.subText}`} size={18} />
            <input 
              type="password" 
              placeholder="Verify Access Key" 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              className={`w-full pl-16 pr-8 py-5 rounded-[2rem] border outline-none font-bold text-sm tracking-tight transition-all ${styles.input}`} 
            />
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          onClick={handleSignup}
          disabled={loading}
          className={`w-full mt-12 py-6 rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.4em] transition-all active:scale-95 shadow-2xl relative z-20 ${
            dark 
            ? 'bg-white text-black hover:bg-amber-500' 
            : 'bg-[#1e1b4b] text-white shadow-purple-900/20'
          }`}
        >
          {loading ? "INITIALIZING..." : (role === "Mentor" ? "Initialize Hub" : "Complete Protocol")}
        </button>

        {/* FOOTER LINK */}
        <p className={`text-center mt-10 text-[9px] font-black uppercase tracking-[0.2em] relative z-20 ${styles.subText}`}>
          Already credentialed?{" "}
          <span onClick={() => navigate("/Login")} className={`cursor-pointer hover:underline underline-offset-8 decoration-2 ${styles.accent}`}>
            Authenticate Hub
          </span>
        </p>
      </div>
    </div>
  );
}