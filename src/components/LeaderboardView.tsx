'use client';

import { Trophy, Flame, TrendingUp, Cake } from 'lucide-react';
import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface LeaderboardItem {
    id?: string;
    username: string;
    points: number;
    wish?: string;
}

const MOCK_DATA: LeaderboardItem[] = [
    { username: 'Dani el Capo (Sim)', points: 1250, wish: 'Chocotorta helada' },
    { username: 'Zunilda (Sim)', points: 980, wish: 'Flan con mucho dulce' },
    { username: 'Mago del Carbón (Sim)', points: 850, wish: 'Queso y dulce' },
];

export default function LeaderboardView() {
    const [data, setData] = useState<LeaderboardItem[]>([]);
    const [isSimulated, setIsSimulated] = useState(true);

    useEffect(() => {
        setIsSimulated(localStorage.getItem('asado_simulated') !== 'false');

        const handleSimChange = () => {
            setIsSimulated(localStorage.getItem('asado_simulated') !== 'false');
        };

        window.addEventListener('simulation-changed', handleSimChange);
        return () => window.removeEventListener('simulation-changed', handleSimChange);
    }, []);

    useEffect(() => {
        if (isSimulated) {
            setData(MOCK_DATA);
            return;
        }

        const q = query(collection(db, 'profiles'), orderBy('asado_points', 'desc'), limit(15));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map(doc => ({
                id: doc.id,
                username: doc.data().username,
                points: doc.data().asado_points || 0,
                wish: doc.data().wish || '',
            }));
            setData(items);
        });

        return () => unsubscribe();
    }, [isSimulated]);

    return (
        <div className="flex flex-col gap-8 w-full max-w-lg mx-auto p-4 pb-20">
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h2 className="text-4xl font-black italic uppercase tracking-tighter">Asado<span className="text-accent-primary">Ranking</span></h2>
                    <p className="text-text-muted text-xs font-bold uppercase tracking-widest mt-1">
                        {isSimulated ? 'Modo Simulación' : 'Sincronizado en Vivo'}
                    </p>
                </div>
                <div className="p-4 rounded-[1.5rem] bg-accent-primary/10 text-accent-primary shadow-inner shadow-accent-primary/5 transform -rotate-6">
                    <Trophy size={36} />
                </div>
            </div>

            <div className="space-y-4">
                {data.length === 0 && !isSimulated && (
                    <div className="glass p-12 rounded-[2rem] text-center border-dashed border-white/10">
                        <p className="text-text-muted font-bold uppercase tracking-[0.2em] text-sm animate-pulse">Buscando asadores...</p>
                    </div>
                )}

                {data.map((item, index) => (
                    <div
                        key={item.id || item.username}
                        className={`glass p-5 rounded-[2rem] flex items-center justify-between group hover:border-accent-primary/30 transition-all duration-300 transform border border-white/5 shadow-xl ${index === 0 ? 'scale-[1.02] border-accent-primary/20 bg-accent-primary/[0.03]' : ''
                            }`}
                        style={{ animation: `slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards ${index * 0.08}s` }}
                    >
                        <div className="flex items-center gap-5">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg ${index === 0 ? 'bg-gradient-to-br from-accent-primary to-accent-secondary text-black shadow-accent-primary/40' :
                                index === 1 ? 'bg-zinc-300 text-black' :
                                    index === 2 ? 'bg-amber-700 text-white' : 'bg-white/5 text-white/40'
                                }`}>
                                {index + 1}
                            </div>
                            <div className="flex flex-col">
                                <p className="font-black text-xl text-white group-hover:text-accent-primary transition-colors leading-none tracking-tight">
                                    {item.username}
                                </p>
                                {item.wish && (
                                    <div className="flex items-center gap-1.5 mt-2 text-accent-primary/60 font-medium italic text-sm">
                                        <Cake size={12} strokeWidth={2.5} />
                                        <span className="truncate max-w-[120px] sm:max-w-[200px]">{item.wish}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="text-right">
                            <div className="flex items-center justify-end gap-1.5 text-white font-black text-2xl mb-1">
                                <span>{item.points}</span>
                                <Flame size={20} className="text-accent-secondary animate-pulse" />
                            </div>
                            <p className="text-[10px] text-text-muted/60 font-black uppercase tracking-widest">Puntos</p>
                        </div>
                    </div>
                ))}
            </div>

            <style jsx>{`
                @keyframes slideIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
