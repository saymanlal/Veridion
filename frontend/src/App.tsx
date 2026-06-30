import { useEffect, useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Toasts from './components/Toasts';
import LockOverlay from './components/LockOverlay';
import TeamModal from './components/TeamModal';
import Preloader from './components/Preloader';
import CustomCursor from './components/CustomCursor';
import VectorBackground from './components/VectorBackground';
import Home from './views/Home';
import About from './views/About';
import KnowUs from './views/KnowUs';
import Contact from './views/Contact';
import Login from './views/Login';
import Register from './views/Register';
import Forgot from './views/Forgot';
import Profile from './views/Profile';
import Dashboard from './views/Dashboard';

function AppShell() {
  const { currentView, currentSession } = useApp();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Preloader />;
  }

  return (
    <div className="min-h-screen text-zinc-100 bg-[#0a0a0c] flex flex-col font-sans transition-all selection:bg-[#c29943]/30 selection:text-[#c29943]">
      <VectorBackground />
      <CustomCursor />
      <Toasts />
      <LockOverlay />
      <TeamModal />
      <Header />

      <main className="flex-grow z-10 relative">
        {currentView === 'home' && <Home />}
        {currentView === 'about' && <About />}
        {currentView === 'know-us' && <KnowUs />}
        {currentView === 'contact' && <Contact />}
        {currentView === 'login' && <Login />}
        {currentView === 'register' && <Register />}
        {currentView === 'forgot' && <Forgot />}
        {currentView === 'profile' && currentSession && <Profile />}
        {currentView === 'dashboard' && currentSession && <Dashboard />}
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
