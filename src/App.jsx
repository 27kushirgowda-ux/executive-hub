import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

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

function App() {
  const [dark, setDark] = useState(true);

  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Landing dark={dark} setDark={setDark} />} />
        <Route path="/signup" element={<Signup dark={dark} />} />
        <Route path="/login" element={<Login dark={dark} />} />

        {/* 🟦 INTERN PROTECTED ROUTES */}
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

        {/* 🟪 MENTOR PROTECTED ROUTES */}
        <Route path="/mentor" element={<MentorLayout dark={dark} />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<MentorDashboard dark={dark} />} />
          {/* Settings shared between both roles */}
          <Route path="settings" element={<MentorSettings dark={dark} setDark={setDark} />} />
          <Route path="profile" element={<MentorProfile dark={dark} />} />
          <Route path="review/:internId" element={<InternReview dark={dark} />} />
        </Route>

        {/* 404 CATCH-ALL */}
        <Route path="*" element={
          <div className={`h-screen flex items-center justify-center transition-colors duration-500 ${dark ? 'bg-[#0f172a] text-white' : 'bg-gray-100 text-slate-900'}`}>
            <div className="text-center">
              <h1 className="text-6xl font-black mb-4">404</h1>
              <p className="text-xl font-bold opacity-50 uppercase tracking-widest">Page Not Found 🧐</p>
              <button onClick={() => window.location.href="/"} className="mt-8 px-8 py-3 bg-blue-600 rounded-2xl font-bold text-white uppercase text-xs tracking-widest">Go Home</button>
            </div>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;