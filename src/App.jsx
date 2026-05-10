import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// --- CORE IMPORTS ---
import Landing from "./pages/Landing";
import Signup from "./pages/Signup"; 
import Login from "./pages/Login";
import Dashboard from "./pages/MainDashboard";
import UploadTask from "./pages/UploadTask";
import TaskHistory from "./pages/TaskHistory";
import Notifications from "./pages/Notification";
import Profile from "./pages/Profile";
import Schedule from "./pages/Schedule";
import Settings from "./pages/Settings";
import Chat from "./pages/Chat";
import Layout from "./pages/Layout";

// --- MENTOR IMPORTS ---
import MentorLayout from "./pages/MentorLayout";
import MentorDashboard from "./pages/MentorDashboard";
import InternReview from "./pages/InternReview";
import MentorSettings from "./pages/MentorSettings";
import MentorProfile from "./pages/MentorProfile";
import RecruitPool from "./pages/RecruitPool";

// --- ADMIN IMPORTS ---
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  // This is the "Master Switch" for the Secret Ingredient / Soft Light modes
  const [dark, setDark] = useState(true);

  return (
    <BrowserRouter>
      <Routes>
        {/* ---------------------------------------------------------
            PUBLIC ROUTES
        ---------------------------------------------------------- */}
        <Route path="/" element={<Landing dark={dark} setDark={setDark} />} />
        <Route path="/signup" element={<Signup dark={dark} />} />
        <Route path="/login" element={<Login dark={dark} />} />

        {/* ---------------------------------------------------------
            ⬛ HIDDEN ADMIN GATEWAY 
            (Fixed: Now passing setDark so toggle works)
        ---------------------------------------------------------- */}
        <Route 
          path="/admin" 
          element={<AdminLogin dark={dark} setDark={setDark} />} 
        />
        <Route 
          path="/admin-dashboard" 
          element={<AdminDashboard dark={dark} setDark={setDark} />} 
        />

        {/* ---------------------------------------------------------
            🟦 INTERN PROTECTED ROUTES (Layout Wrap)
        ---------------------------------------------------------- */}
        <Route path="/app" element={<Layout dark={dark} />}>
          <Route index element={<Navigate to="dashboard" replace />} /> 
          <Route path="dashboard" element={<Dashboard dark={dark} />} />
          <Route path="upload" element={<UploadTask dark={dark} />} />
          <Route path="task-history" element={<TaskHistory dark={dark} />} />
          <Route path="notifications" element={<Notifications dark={dark} />} />
          <Route path="profile" element={<Profile dark={dark} />} />
          <Route path="schedule" element={<Schedule dark={dark} />} />
          <Route path="settings" element={<Settings dark={dark} setDark={setDark} />} />
          <Route path="chat/:id" element={<Chat dark={dark} />} />
        </Route>

        {/* ---------------------------------------------------------
            🟪 MENTOR PROTECTED ROUTES (MentorLayout Wrap)
        ---------------------------------------------------------- */}
        <Route path="/mentor" element={<MentorLayout dark={dark} />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<MentorDashboard dark={dark} />} />
          <Route path="settings" element={<MentorSettings dark={dark} setDark={setDark} />} />
          <Route path="profile" element={<MentorProfile dark={dark} />} />
          <Route path="review/:internId" element={<InternReview dark={dark} />} />
          <Route path="recruit" element={<RecruitPool dark={dark} />} />
        </Route>

        {/* ---------------------------------------------------------
            404 CATCH-ALL (Legend Style)
        ---------------------------------------------------------- */}
        <Route path="*" element={
          <div className={`h-screen flex items-center justify-center transition-colors duration-500 ${dark ? 'bg-[#0a0a0a] text-white' : 'bg-[#f4f4f5] text-slate-900'}`}>
            <div className="text-center px-6">
              <h1 className="text-8xl font-black italic mb-2 opacity-10">404</h1>
              <h2 className="text-2xl font-black uppercase tracking-tighter mb-4">
                Page Lost in <span className="text-blue-500">The Matrix</span>
              </h2>
              <p className="text-xs font-bold opacity-40 uppercase tracking-[0.3em] mb-8">
                The requested URL does not exist in the InternTrack ecosystem.
              </p>
              <button 
                onClick={() => window.location.href="/"} 
                className={`px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-xl ${
                  dark ? 'bg-white text-black hover:bg-yellow-500' : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Return to Base
              </button>
            </div>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;