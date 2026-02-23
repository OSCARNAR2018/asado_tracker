'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { CheckCircle2, Loader2, Star, Flame, Award } from 'lucide-react';

interface VotingViewProps {
    username: string;
}

interface Dessert {
    id: string;
    name: string;
    image: string;
    description: string;
}

const DESSERTS: Dessert[] = [
    {
        id: 'chocotorta',
        name: 'Chocotorta',
        image: 'https://images.unsplash.com/photo-1579306194872-64d3b7bac4c2?auto=format&fit=crop&q=80&w=500',
        description: 'La reina de las fiestas.'
    },
    {
        id: 'flan',
        name: 'Flan con Dulce',
        image: 'https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?auto=format&fit=crop&q=80&w=500',
        description: 'Clásico imperecedero.'
    },
    {
        id: 'helado',
        name: 'Helado Variado',
        image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&q=80&w=500',
        description: 'Refrescante y para todos.'
    },
    {
        id: 'vigilante',
        name: 'Queso y Dulce',
        image: 'https://images.unsplash.com/photo-1623934199716-bc34495ed18a?auto=format&fit=crop&q=80&w=500',
        description: 'El postre de los campeones.'
    }
];

export default function VotingView({ username }: VotingViewProps) {
    const [voted, setVoted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [votingInProgress, setVotingInProgress] = useState<string | null>(null);

    useEffect(() => {
        const checkVote = async () => {
            const isSimulated = localStorage.getItem('asado_simulated') !== 'false';
            if (isSimulated) {
                const hasVotedLocal = localStorage.getItem(`asado_voted_${username}`);
                if (hasVotedLocal) setVoted(true);
                setLoading(false);
                return;
            }

            try {
                const userDoc = await getDoc(doc(db, 'profiles', username));
                if (userDoc.exists() && userDoc.data().hasVoted) {
                    setVoted(true);
                }
            } catch (err) {
                console.error("Error checking vote:", err);
            }
            setLoading(false);
        };
        checkVote();
    }, [username]);

    const handleVote = async (dessertId: string) => {
        setVotingInProgress(dessertId);
        const isSimulated = localStorage.getItem('asado_simulated') !== 'false';

        try {
            if (isSimulated) {
                localStorage.setItem(`asado_voted_${username}`, 'true');
            } else {
                // 1. Record the vote
                await addDoc(collection(db, 'votes'), {
                    username,
                    dessertId,
                    timestamp: new Date().toISOString()
                });

                // 2. Update user points (10 points per vote)
                const userRef = doc(db, 'profiles', username);
                await updateDoc(userRef, {
                    asado_points: increment(10),
                    hasVoted: true
                });
            }
            setVoted(true);
        } catch (err) {
            console.error("Error voting:", err);
            alert("Error al registrar el voto. Intenta de nuevo.");
        } finally {
            setVotingInProgress(null);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="animate-spin text-accent-primary" size={48} />
                <p className="text-text-muted font-bold uppercase tracking-widest">Verificando votos...</p>
            </div>
        );
    }

    if (voted) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-8 animate-in fade-in zoom-in duration-500">
                <div className="w-32 h-32 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 border-4 border-green-500/30">
                    <CheckCircle2 size={64} strokeWidth={2.5} />
                </div>
                <div className="space-y-2">
                    <h2 className="text-4xl font-black uppercase tracking-tighter">¡Voto Registrado!</h2>
                    <p className="text-text-muted text-xl">Sumaste <span className="text-accent-primary font-black">10 Asado Points</span>.</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-6 rounded-3xl max-w-xs transition-transform hover:scale-105">
                    <p className="text-sm font-bold text-white/60">
                        "Tu opinión es inmutable y ha sido grabada en el Gran Registro del Asador."
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 pb-24">
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-accent-primary/20 text-accent-primary">
                        <Award size={28} />
                    </div>
                    <h2 className="text-4xl font-black uppercase tracking-tighter">El Gran Jurado</h2>
                </div>
                <p className="text-text-muted text-lg">Seleccioná el postre que merece el podio del 1° de Mayo.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {DESSERTS.map((dessert) => (
                    <div key={dessert.id} className="group relative glass rounded-[2.5rem] overflow-hidden border-white/5 shadow-2xl transition-all hover:scale-[1.02] hover:border-accent-primary/30">
                        {/* Image Container */}
                        <div className="h-56 w-full relative overflow-hidden">
                            <img
                                src={dessert.image}
                                alt={dessert.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-80" />

                            {/* Floating tag */}
                            <div className="absolute top-4 right-4 py-1.5 px-4 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-2">
                                <Star className="text-yellow-500 fill-yellow-500" size={14} />
                                <span className="text-[10px] font-black uppercase tracking-widest text-white">Favorito</span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-8 space-y-4">
                            <div>
                                <h3 className="text-2xl font-black uppercase tracking-tight text-white">{dessert.name}</h3>
                                <p className="text-text-muted text-sm font-medium">{dessert.description}</p>
                            </div>

                            <button
                                onClick={() => handleVote(dessert.id)}
                                disabled={votingInProgress !== null}
                                className={`w-full py-5 rounded-3xl font-black uppercase tracking-tighter text-lg flex items-center justify-center gap-3 transition-all ${votingInProgress === dessert.id
                                        ? 'bg-white/10 text-white/40 cursor-not-allowed'
                                        : 'bg-white text-black hover:bg-accent-primary hover:text-white active:scale-95 shadow-[0_15px_30px_rgba(255,255,255,0.1)]'
                                    }`}
                            >
                                {votingInProgress === dessert.id ? (
                                    <Loader2 className="animate-spin" size={24} />
                                ) : (
                                    <>
                                        VOTAR ESTE
                                        <Flame size={20} />
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Visual accent */}
                        <div className="absolute top-0 left-0 w-2 h-full bg-accent-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                ))}
            </div>

            <div className="text-center py-6 border-t border-white/5 mt-4">
                <p className="text-[10px] uppercase font-black tracking-[0.3em] text-white/20">
                    SISTEMA DE VOTACIÓN INALTERABLE v3.0
                </p>
            </div>
        </div>
    );
}
