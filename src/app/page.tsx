'use client';

import { useState, useEffect } from 'react';
import { Trophy, Cake, LogOut, LayoutGrid } from 'lucide-react';
import LoginView from '@/components/LoginView';
import LeaderboardView from '@/components/LeaderboardView';
import VotingView from '@/components/VotingView';
import SimulationToggle from '@/components/SimulationToggle';

export default function Home() {
  const [user, setUser] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'ranking' | 'voto'>('ranking');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('asado_user');
    if (savedUser) setUser(savedUser);
    setLoading(false);
  }, []);

  if (loading) return null;

  if (!user) {
    return (
      <>
        <LoginView onLogin={setUser} />
        <SimulationToggle />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-32 selection:bg-accent-primary selection:text-black">
      {/* Minimal Header */}
      <header className="px-6 py-6 flex items-center justify-between pointer-events-none sticky top-0 z-30 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5">
        <div className="pointer-events-auto">
          <h1 className="text-2xl font-black italic uppercase tracking-tighter">
            Asado<span className="text-gradient">Tracker</span>
          </h1>
          <p className="text-[10px] text-accent-primary font-black uppercase tracking-[0.2em]">{user}</p>
        </div>

        <button
          onClick={() => {
            localStorage.removeItem('asado_user');
            localStorage.removeItem('asado_wish');
            setUser(null);
          }}
          className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-red-500/20 hover:text-red-500 transition-all border border-white/5 pointer-events-auto shadow-lg"
          title="Cerrar Sesión"
        >
          <LogOut size={24} />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="container max-w-lg mx-auto pt-4 px-4">
        <div className="animate-in fade-in duration-700">
          {activeTab === 'ranking' ? <LeaderboardView /> : <VotingView />}
        </div>
      </main>

      {/* Premium WhatsApp-style Bottom Nav */}
      <nav className="fixed bottom-0 left-0 w-full px-4 pb-8 pt-4 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/95 to-transparent z-40">
        <div className="max-w-md mx-auto glass rounded-[2.5rem] p-3 border border-white/10 shadow-2xl flex gap-3 h-24">
          <button
            onClick={() => setActiveTab('ranking')}
            className={`flex-1 rounded-[1.8rem] flex flex-col items-center justify-center gap-1 transition-all duration-500 relative overflow-hidden ${activeTab === 'ranking'
                ? 'bg-accent-primary text-black shadow-xl shadow-accent-primary/30 scale-100'
                : 'text-zinc-500 hover:text-zinc-300 scale-95 opacity-70'
              }`}
          >
            <Trophy size={activeTab === 'ranking' ? 32 : 28} strokeWidth={activeTab === 'ranking' ? 3 : 2} />
            <span className="text-[11px] font-black uppercase tracking-widest">Ranking</span>
            {activeTab === 'ranking' && <div className="absolute inset-0 bg-white/10 animate-pulse"></div>}
          </button>

          <button
            onClick={() => setActiveTab('voto')}
            className={`flex-1 rounded-[1.8rem] flex flex-col items-center justify-center gap-1 transition-all duration-500 relative overflow-hidden ${activeTab === 'voto'
                ? 'bg-accent-primary text-black shadow-xl shadow-accent-primary/30 scale-100'
                : 'text-zinc-500 hover:text-zinc-300 scale-95 opacity-70'
              }`}
          >
            <Cake size={activeTab === 'voto' ? 32 : 28} strokeWidth={activeTab === 'voto' ? 3 : 2} />
            <span className="text-[11px] font-black uppercase tracking-widest">Votar</span>
            {activeTab === 'voto' && <div className="absolute inset-0 bg-white/10 animate-pulse"></div>}
          </button>
        </div>
      </nav>

      <SimulationToggle />
    </div>
  );
}
