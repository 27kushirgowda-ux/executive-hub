import { Link } from "react-router-dom";
import {
  BarChart3,
  Users,
  CheckCircle,
  ClipboardList,
  MessageSquare,
  TrendingUp,
  ShieldCheck,
  Zap
} from "lucide-react";

export default function Landing({ dark, setDark }) {

  // 🎨 THEME ENGINE
  const theme = {
    bg: dark 
      ? "bg-[#0a0a0a]" 
      : "bg-gradient-to-br from-[#fdf2f8] via-[#f5f3ff] to-[#eff6ff]",
    text: dark ? "text-white" : "text-[#2e1065]",
    card: dark 
      ? "bg-[#161616]/60 border-white/5 shadow-2xl shadow-black/50" 
      : "bg-white/70 border-white shadow-xl shadow-purple-500/10",
    accent: dark ? "text-amber-500" : "text-pink-500",
    button: dark 
      ? "bg-white text-black hover:bg-amber-500 transition-all" 
      : "bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/20",
    glow: dark ? "bg-orange-600/10" : "bg-purple-400/10"
  };

  return (
    <div className={`${theme.bg} ${theme.text} min-h-screen transition-all duration-700 relative overflow-hidden font-sans`}>

      {/* 🟠 DYNAMIC BACKGROUND GLOWS */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className={`absolute w-[800px] h-[800px] blur-[150px] top-[-200px] left-[-200px] rounded-full transition-colors duration-1000 ${theme.glow}`}></div>
        <div className={`absolute w-[600px] h-[600px] blur-[150px] bottom-[-200px] right-[-200px] rounded-full transition-colors duration-1000 ${dark ? 'bg-amber-500/5' : 'bg-blue-400/10'}`}></div>
      </div>

      {/* 🔥 ALIGNED NAVBAR (Matches Hero Width) */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 pt-6">
        <div className={`max-w-7xl mx-auto flex items-center justify-between px-8 py-3 rounded-[1.8rem] backdrop-blur-3xl border transition-all ${dark ? 'bg-white/5 border-white/10' : 'bg-white/60 border-white shadow-sm'}`}>
          <div className="flex items-center gap-3">
            <div className={`p-1.5 rounded-lg shadow-lg ${dark ? 'bg-amber-500 text-black' : 'bg-gradient-to-tr from-pink-500 to-purple-600 text-white'}`}>
              <ShieldCheck size={20} />
            </div>
            <h1 className="font-black text-lg tracking-tighter uppercase italic">
              Inter<span className={dark ? 'text-amber-500' : 'text-purple-600'}>Track</span>
            </h1>
          </div>

          <div className="hidden md:flex gap-10 text-[10px] font-black uppercase tracking-[0.2em] opacity-50">
            <a href="#hero" className="hover:text-amber-500 transition-colors">Home</a>  
            <a href="#platform" className="hover:text-amber-500 transition-colors">Platform</a>
            <a href="#howitworks" className="hover:text-amber-500 transition-colors">Workflow</a>
          </div>

          <button 
              onClick={() => setDark(!dark)} 
              className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all ${dark ? 'bg-white/5 border-white/10 text-amber-500 hover:bg-white/10' : 'bg-white border-slate-100 text-blue-500 shadow-sm'}`}
          >
            {dark ? "🌙" : "☀️"}
          </button>
        </div>
      </nav>

      {/* 🚀 MAIN WRAPPER (max-w-7xl) */}
      <main className="max-w-7xl mx-auto px-6 pt-[160px] pb-20">

        {/* HERO SECTION */}
        <section id="hero" className="min-h-[70vh] flex flex-col justify-center mb-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="text-left">
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-6 ${dark ? 'bg-white/5 border-white/10 text-amber-500' : 'bg-purple-50 border-purple-100 text-purple-600'}`}>
                <Zap size={12} className="animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-widest">Next-Gen Oversight Engine</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter italic mb-8 uppercase">
                Track Like <br /> 
                <span className={`text-transparent bg-clip-text ${dark ? 'bg-gradient-to-r from-white to-white/40' : 'bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500'}`}>
                  A Legend.
                </span>
              </h1>
              <p className={`text-lg md:text-xl font-medium max-w-lg leading-relaxed mb-10 ${dark ? 'opacity-40' : 'opacity-60'}`}>
                High-performance workspace for elite interns and mentors. Precision tracking with AI-enhanced oversight.
              </p>
              
              <div className="flex flex-wrap items-center gap-5">
                <Link to="/Signup">
                  <button className={`px-8 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl transition-all hover:scale-105 active:scale-95 ${theme.button}`}>
                    Get Started Now
                  </button>
                </Link>
                <Link to="/login">
                  <button className={`px-8 py-4 rounded-[1.5rem] border font-black text-[10px] uppercase tracking-[0.2em] transition-all hover:bg-white/5 ${dark ? 'border-white/10' : 'border-slate-200 text-slate-500'}`}>
                    Member Login
                  </button>
                </Link>
              </div>
            </div>

            {/* WOW GLOW IMAGE */}
            <div className="relative group">
              <div className={`absolute -inset-10 blur-[100px] opacity-20 group-hover:opacity-40 transition duration-1000 rounded-full ${dark ? 'bg-amber-500' : 'bg-purple-500'}`}></div>
              <div className={`${theme.card} relative rounded-[3rem] p-3 backdrop-blur-3xl overflow-hidden`}>
                <img
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71"
                    alt="Dashboard Preview"
                    className={`rounded-[2rem] w-full shadow-2xl transition-all duration-700 group-hover:scale-105 ${dark ? 'grayscale hover:grayscale-0' : ''}`}
                />
              </div>
            </div>
          </div>
        </section>

        {/* 🌟 PERFORMANCE SECTION (Bold Italic Style) */}
        <section id="platform" className="py-24 scroll-mt-20">
          <div className="flex flex-col items-center text-center mb-16">
            <h2 className="text-5xl font-black tracking-tighter italic mb-4 uppercase text-center">The Performance</h2>
            <div className={`h-1.5 w-16 rounded-full ${dark ? 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]' : 'bg-gradient-to-r from-pink-500 to-blue-500'}`}></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <StatCard icon={<BarChart3 />} val="5k+" label="Tasks Managed" color={dark ? "from-amber-500" : "from-pink-500"} theme={theme} />
            <StatCard icon={<Users />} val="1k+" label="Active Interns" color={dark ? "from-amber-500" : "from-purple-500"} theme={theme} />
            <StatCard icon={<CheckCircle />} val="95%" label="Completion Rate" color={dark ? "from-amber-500" : "from-blue-500"} theme={theme} />
          </div>
        </section>

        {/* 🛠 WORKFLOW SECTION */}
        <section id="howitworks" className="py-24 scroll-mt-20">
          <div className="flex flex-col items-center text-center mb-16">
            <h2 className="text-5xl font-black tracking-tighter italic mb-4 uppercase text-center">The Workflow</h2>
            <div className={`h-1.5 w-16 rounded-full ${dark ? 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]' : 'bg-gradient-to-r from-pink-500 to-blue-500'}`}></div>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            <FeatureCard icon={<ClipboardList size={28} />} title="90-Day Ledger" desc="Comprehensive task tracking from day 1 to 90." theme={theme} />
            <FeatureCard icon={<MessageSquare size={28} />} title="Executive Remarks" desc="Direct feedback with instant notification alerts." theme={theme} />
            <FeatureCard icon={<TrendingUp size={28} />} title="AI Oversight" desc="Optional automated verification via AI Mentor mode." theme={theme} />
          </div>
        </section>

      </main>
    </div>
  );
}

// Sub-components
function StatCard({ icon, val, label, color, theme }) {
  return (
    <div className={`p-10 rounded-[3rem] ${theme.card} backdrop-blur-3xl relative overflow-hidden transition-all hover:-translate-y-2 group`}>
      <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${color} to-transparent opacity-50 group-hover:opacity-100 transition-opacity`}></div>
      <div className="flex items-center gap-6">
        <div className={`p-4 rounded-2xl ${theme.bg} border border-white/5 text-amber-500`}>{icon}</div>
        <div>
          <h3 className="text-4xl font-black tracking-tighter italic">{val}</h3>
          <p className="text-[10px] font-black uppercase tracking-widest opacity-40">{label}</p>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc, theme }) {
  return (
    <div className={`p-10 rounded-[3rem] ${theme.card} backdrop-blur-3xl relative overflow-hidden transition-all hover:-translate-y-2 group`}>
      <div className={`mb-6 p-4 inline-block rounded-2xl ${theme.bg} border border-white/5 text-amber-500 transition-transform group-hover:rotate-12`}>
        {icon}
      </div>
      <h3 className="text-xl font-black uppercase tracking-tighter mb-3 italic">{title}</h3>
      <p className="text-[10px] font-bold opacity-40 leading-relaxed uppercase tracking-widest">{desc}</p>
    </div>
  );
}