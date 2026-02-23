'use client';

import { useState } from 'react';
import { User, Flame, Cake, Loader2 } from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface LoginViewProps {
    onLogin: (username: string) => void;
}

export default function LoginView({ onLogin }: LoginViewProps) {
    const [username, setUsername] = useState('');
    const [wish, setWish] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedUser = username.trim();
        const trimmedWish = wish.trim();

        if (trimmedUser && trimmedWish) {
            // Optimistic login: Don't wait for Firestore to proceed to the app
            localStorage.setItem('asado_user', trimmedUser);
            localStorage.setItem('asado_wish', trimmedWish);

            // Proceed to app immediately
            onLogin(trimmedUser);

            // Fire and forget Firestore update in the background
            const isSimulated = localStorage.getItem('asado_simulated') !== 'false';
            if (!isSimulated) {
                setDoc(doc(db, 'profiles', trimmedUser), {
                    username: trimmedUser,
                    wish: trimmedWish,
                    asado_points: 0,
                    updatedAt: new Date().toISOString()
                }, { merge: true }).catch(err => console.error("Background sync failed:", err));
            }
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#0a0a0a] overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-30 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-orange-600 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-red-600 rounded-full blur-[120px] animate-pulse delay-1000"></div>
            </div>

            <div className="glass p-10 rounded-[2.5rem] w-full max-w-sm flex flex-col items-center gap-8 shadow-2xl relative border-white/5">
                {/* Animation changed to pulse for subtler senior-friendly UX */}
                <div className="p-5 rounded-3xl bg-accent-primary/20 text-accent-primary animate-pulse">
                    <Flame size={56} strokeWidth={1.5} />
                </div>

                <div>
                    <h1 className="text-5xl font-black uppercase tracking-tighter mb-2 italic">
                        Asado<span className="text-gradient">Tracker</span>
                    </h1>
                    <p className="text-text-muted text-xs font-bold uppercase tracking-widest px-4">
                        Ingreso familiar rápido • Legibilidad Extrema
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="w-full space-y-5">
                    <div className="space-y-2 text-left">
                        <label className="text-[10px] uppercase font-black tracking-[0.2em] text-accent-primary/70 ml-2">entra con tu nombre o apodo</label>
                        <div className="relative group">
                            <User className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent-primary transition-colors" size={24} />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Tu nombre o apodo"
                                className="w-full bg-white/5 border-2 border-white/10 rounded-3xl py-5 pl-14 pr-6 text-white placeholder:text-white/20 focus:ring-4 focus:ring-accent-primary/20 focus:border-accent-primary transition-all outline-none text-xl font-bold font-sans"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2 text-left">
                        <label className="text-[10px] uppercase font-black tracking-[0.2em] text-accent-primary/70 ml-2">¿que postre te gusta?</label>
                        <div className="relative group">
                            <Cake className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent-primary transition-colors" size={24} />
                            <input
                                type="text"
                                value={wish}
                                onChange={(e) => setWish(e.target.value)}
                                placeholder="Ej: Chocotorta, Helado..."
                                className="w-full bg-white/5 border-2 border-white/10 rounded-3xl py-5 pl-14 pr-6 text-white placeholder:text-white/20 focus:ring-4 focus:ring-accent-primary/20 focus:border-accent-primary transition-all outline-none text-xl font-bold font-sans"
                                required
                            />
                        </div>
                        <p className="text-xs text-accent-primary font-bold italic ml-2 mt-2">
                            ... porque después los vamos a votar ...
                        </p>
                    </div>

                    {/* Personalized button text */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full py-6 text-xl uppercase font-black tracking-tighter flex items-center justify-center gap-3 mt-4 leading-tight text-center"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : 'Ingreso a la juntada del 1° de Mayo'}
                    </button>
                </form>

                <div className="pt-4 border-t border-white/5 w-full">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-white/20 font-black text-center">
                        Immutable Social System v2.1
                    </p>
                </div>
            </div>
        </div>
    );
}
