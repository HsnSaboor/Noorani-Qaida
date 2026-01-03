
import React, { useEffect } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import Home from './pages/Home';
import LessonPage from './pages/Lesson';
import Dashboard from './pages/Dashboard';
import Practice from './pages/Practice';
import Settings from './pages/Settings';
import Tasbeeh from './pages/Tasbeeh';
import ParentDashboard from './pages/ParentDashboard';
import StudentProfile from './pages/StudentProfile';
import MakhrajGallery from './pages/MakhrajGallery';
import Features from './pages/Features';
import BottomNavigation from './components/BottomNavigation';
import OnboardingModal from './components/OnboardingModal';

const App: React.FC = () => {


  return (
    <AppProvider>
      <OnboardingModal />
      {/* MemoryRouter is used to prevent security errors (Location.assign) in sandboxed blob environments */}
      <Router>
        <div className="min-h-screen bg-surface pb-24 transition-colors duration-300">
          <Header />
          <main className="container mx-auto">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/lesson/:id" element={<LessonPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/practice" element={<Practice />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/tasbeeh" element={<Tasbeeh />} />
              <Route path="/parents" element={<ParentDashboard />} />
              <Route path="/profile" element={<StudentProfile />} />
              <Route path="/makhraj" element={<MakhrajGallery />} />
              <Route path="/features" element={<Features />} />
            </Routes>
          </main>
          <BottomNavigation />
        </div>
      </Router>
    </AppProvider>
  );
};

export default App;
