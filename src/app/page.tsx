'use client';

import { useState, useEffect } from 'react';
import { Trophy, Cake, LogOut, LayoutGrid, ShieldCheck } from 'lucide-react';
import LoginView from '@/components/LoginView';
import LeaderboardView from '@/components/LeaderboardView';
import VotingView from '@/components/VotingView';
import RulesView from '@/components/RulesView';
import SimulationToggle from '@/components/SimulationToggle';

export default function Home() {
  const [user, setUser] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'ranking' | 'voto' | 'reglas'>('ranking');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('asado_user');
    if (savedUser) {
      setUser(savedUser);
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('asado_user');
    localStorage.removeItem('asado_wish');
    setUser(null);
  };

  if (loading) return null;

  if (!user) {
    return <LoginView onLogin={(username) => setUser(username)} />;
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 glass-dark border-b border-white/5 py-4 px-6 flex justify-between items-center shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-accent-primary/20 text-accent-primary">
            <LayoutGrid size={24} strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tighter italic">
            Asado<span className="text-gradient">Tracker</span>
          </h1>
        </div>
        <button
          onClick={handleLogout}
          className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-red-500/20 hover:border-red-500/20 transition-all flex items-center gap-2 group"
          title="Cerrar Sesión"
        >
          <span className="text-[10px] font-black uppercase tracking-widest group-hover:block hidden">Salir</span>
          <LogOut size={20} />
        </button>
      </header>

      {/* Main Content Area */}
      <div className="pt-24 px-6 pb-32 max-w-2xl mx-auto">
        {activeTab === 'ranking' && <LeaderboardView />}
        {activeTab === 'voto' && <VotingView username={user} />}
        {activeTab === 'reglas' && <RulesView />}
      </div>

      {/* Admin/Settings (Floating - MOVED TO TOP to avoid overlap) */}
      <div className="fixed top-24 right-6 z-50">
        <SimulationToggle />
      </div>

      {/* Senior-Friendly Bottom Navigation (WhatsApp Style) - 3 TABS */}
      <nav className="fixed bottom-0 left-0 w-full z-50 glass-dark border-t border-white/10 px-4 py-3 pb-8 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <div className="max-w-md mx-auto grid grid-cols-3 gap-3">
          <button
            onClick={() => setActiveTab('ranking')}
            className={`flex flex-col items-center justify-center gap-2 py-4 rounded-[2rem] transition-all relative overflow-hidden ${activeTab === 'ranking'
              ? 'bg-accent-primary text-white shadow-[0_10px_20px_rgba(255,149,0,0.3)]'
              : 'text-white/40 hover:bg-white/5'
              }`}
          >
            <Trophy size={32} strokeWidth={activeTab === 'ranking' ? 3 : 2} />
            <span className="text-xs font-black uppercase tracking-widest">Ranking</span>
          </button>

          <button
            onClick={() => setActiveTab('voto')}
            className={`flex flex-col items-center justify-center gap-2 py-4 rounded-[2rem] transition-all relative overflow-hidden ${activeTab === 'voto'
              ? 'bg-accent-primary text-white shadow-[0_10px_20px_rgba(255,149,0,0.3)]'
              : 'text-white/40 hover:bg-white/5'
              }`}
          >
            <Cake size={32} strokeWidth={activeTab === 'voto' ? 3 : 2} />
            <span className="text-xs font-black uppercase tracking-widest">Votar</span>
          </button>

          <button
            onClick={() => setActiveTab('reglas')}
            className={`flex flex-col items-center justify-center gap-2 py-4 rounded-[2rem] transition-all relative overflow-hidden ${activeTab === 'reglas'
              ? 'bg-accent-primary text-white shadow-[0_10px_20px_rgba(255,149,0,0.3)]'
              : 'text-white/40 hover:bg-white/5'
              }`}
          >
            <ShieldCheck size={32} strokeWidth={activeTab === 'reglas' ? 3 : 2} />
            <span className="text-xs font-black uppercase tracking-widest">Reglas</span>
          </button>
        </div>
      </nav>
    </main>
  );
}
