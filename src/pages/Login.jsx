import { useState } from "react";
import { auth, db } from "../firebase";
import { 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail 
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Zap, 
  ArrowLeft 
} from "lucide-react";

export default function Login({ dark }) {
  const navigate = useNavigate();
  
  // --- FORM STATES ---
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [loading, setLoading] = useState(false);

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
    text: dark ? "text-white" : "text-[#1e1b4b]",
    subText: dark ? "text-white/20" : "text-slate-400",
    accent: dark ? "text-amber-500" : "text-purple-600",
    innerShine: "absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent pointer-events-none z-10",
    ambientGlow: dark 
      ? "fixed w-[600px] h-[600px] rounded-full bg-amber-500/5 blur-[150px] -z-20 pointer-events-none"
      : "fixed w-[600px] h-[600px] rounded-full bg-purple-500/5 blur-[150px] -z-20 pointer-events-none"
  };

  // --- 🎯 THE AUTHENTICATION PROTOCOL ---
  const handleLogin = async () => {
    setError("");
    setSuccess("");
    if (!email || !password) return setError("Protocol Error: Credentials Required");
    
    setLoading(true);
    try {
      // 1. Authenticate with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // 2. ⚡ CRITICAL: Fetch the Role directly from Firestore immediately
      const userSnap = await getDoc(doc(db, "users", userCredential.user.uid));

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const role = userData.role;

        setSuccess(`Identity Verified: Initializing ${role} Hub...`);
        
        // 3. Precise Redirection based on Database Role
        setTimeout(() => {
          if (role === "Mentor") {
            navigate("/mentor/dashboard");
          } else {
            navigate("/app/dashboard");
          }
        }, 1000);
      } else {
        setError("Security Alert: Identity not found in Hub Ledger.");
      }
    } catch (e) {
      console.error("Login Error:", e.code);
      setError("Authentication Refused: Invalid Key or Network Failure.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setError("");
    if (!email) return setError("Input Email for Recovery");
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess("Recovery Link Dispatched to Inbox 📩");
    } catch (e) { setError("Recovery Dispatch Failed."); }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center relative overflow-hidden p-6 transition-all duration-700 ${styles.bg}`}>
      
      {/* 🚨 AMBIENT GLOWS */}
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
            {forgotMode ? "System Reset" : "Authenticate"}
          </h2>
          <p className={`text-[10px] font-black uppercase tracking-[0.5em] mt-4 ${styles.subText}`}>
            {forgotMode ? "Identity Recovery Sequence" : "Establish Secure Session"}
          </p>
        </div>

        {/* FEEDBACK SYSTEM */}
        {error && (
          <div className="mb-8 p-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-[0.2em] text-center animate-bounce">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-8 p-5 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-black uppercase tracking-[0.2em] text-center animate-pulse">
            {success}
          </div>
        )}

        <div className="space-y-5 relative z-20">
          {/* EMAIL (Casing Restored) */}
          <div className="relative">
            <Mail className={`absolute left-6 top-1/2 -translate-y-1/2 ${styles.subText}`} size={18} />
            <input
              type="email"
              placeholder="Official Email"
              className={`w-full pl-16 pr-8 py-5 rounded-[2rem] border outline-none font-bold text-sm tracking-tight transition-all ${styles.input}`}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* PASSWORD (Casing Restored) */}
          {!forgotMode && (
            <div className="relative group">
              <Lock className={`absolute left-6 top-1/2 -translate-y-1/2 ${styles.subText}`} size={18} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Access Key"
                className={`w-full pl-16 pr-16 py-5 rounded-[2rem] border outline-none font-bold text-sm tracking-tight transition-all ${styles.input}`}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button 
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-8 top-1/2 -translate-y-1/2 transition-all hover:scale-120 ${styles.subText}`}
                type="button"
              >
                {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
              </button>
            </div>
          )}
        </div>

        {/* SUBMIT BUTTON (Kept Uppercase for style) */}
        <button
          onClick={forgotMode ? handleReset : handleLogin}
          disabled={loading}
          className={`w-full mt-12 py-6 rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.4em] transition-all active:scale-95 shadow-2xl relative z-20 ${
            dark 
            ? 'bg-white text-black hover:bg-amber-500' 
            : 'bg-[#1e1b4b] text-white shadow-purple-900/20'
          }`}
        >
          {loading ? "WIRING..." : (forgotMode ? "Dispatch Recovery" : "Initialize Hub")}
        </button>

        <div className="flex flex-col items-center gap-6 mt-10 relative z-20">
          <button 
            onClick={() => setForgotMode(!forgotMode)}
            className={`text-[9px] font-black uppercase tracking-[0.2em] underline-offset-8 hover:underline transition-all ${styles.subText}`}
          >
            {forgotMode ? "Back to Authentication" : "Lost Hub Access Key?"}
          </button>
          
          <p className={`text-[9px] font-black uppercase tracking-[0.2em] ${styles.subText}`}>
            New Candidate?{" "}
            <span 
              onClick={() => navigate("/Signup")}
              className={`cursor-pointer hover:underline underline-offset-8 decoration-2 ${styles.accent}`}
            >
              Register Identity
            </span>
          </p>
        </div>
      </div>

      {/* BACK TO TERMINAL */}
      <button 
        onClick={() => navigate("/")}
        className="fixed bottom-10 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] opacity-30 hover:opacity-100 hover:text-amber-500 transition-all z-20"
      >
        <ArrowLeft size={16} /> Hub Terminal
      </button>
    </div>
  );
}