'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { CheckCircle2, Loader2, Star, Flame, Award, Info, Heart } from 'lucide-react';

interface VotingViewProps {
    username: string;
}

interface AppNameOption {
    id: string;
    name: string;
    image: string;
    description: string;
}

const APP_NAMES: AppNameOption[] = [
    {
        id: 'tranquera_adentro',
        name: 'Tranquera Adentro',
        image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=500',
        description: '"Dejando las preocupaciones del lado de afuera".'
    },
    {
        id: 'fuego_sagrado',
        name: 'Fuego Sagrado',
        image: 'https://images.unsplash.com/photo-1558244661-91eaafc20473?auto=format&fit=crop&q=80&w=600',
        description: 'La mística del ritual que nos une (cordero y brasas).'
    },
    {
        id: 'mesa_grande',
        name: 'Mesa Grande',
        image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=500',
        description: 'Humildad, familia y unión.'
    },
    {
        id: 'brasas_y_abrazos',
        name: 'Brasas y Abrazos',
        image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=600',
        description: 'Parrilla llena y corazón contento con los que más queremos.'
    },
    {
        id: 'la_herencia_del_1',
        name: 'La Herencia del 1°',
        image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=500',
        description: '40 años de tradición familiar.'
    },
    {
        id: 'asado_tracker',
        name: 'AsadoTracker',
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=500',
        description: 'El nombre actual (tecnológico).'
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
                const hasVotedLocal = localStorage.getItem(`asado_voted_name_${username}`);
                if (hasVotedLocal) setVoted(true);
                setLoading(false);
                return;
            }

            try {
                const userDoc = await getDoc(doc(db, 'profiles', username));
                if (userDoc.exists() && userDoc.data().hasVotedName) {
                    setVoted(true);
                }
            } catch (err) {
                console.error("Error checking vote:", err);
            }
            setLoading(false);
        };
        checkVote();
    }, [username]);

    const handleVote = async (nameId: string) => {
        setVotingInProgress(nameId);
        const isSimulated = localStorage.getItem('asado_simulated') !== 'false';

        try {
            if (isSimulated) {
                localStorage.setItem(`asado_voted_name_${username}`, 'true');
            } else {
                // Record the name vote
                await addDoc(collection(db, 'name_votes'), {
                    username,
                    nameId,
                    timestamp: new Date().toISOString()
                });

                // Update user status
                const userRef = doc(db, 'profiles', username);
                await updateDoc(userRef, {
                    asado_points: increment(20), // Double points for naming!
                    hasVotedName: true
                });
            }
            setVoted(true);
        } catch (err) {
            console.error("Error voting:", err);
        } finally {
            setVotingInProgress(null);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="animate-spin text-accent-primary" size={48} />
                <p className="text-text-muted font-bold uppercase tracking-widest text-center">Verificando sufragio del Patriarca...</p>
            </div>
        );
    }

    if (voted) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-8 animate-in fade-in zoom-in duration-500">
                <div className="w-40 h-40 rounded-full bg-accent-primary/20 flex items-center justify-center text-accent-primary border-4 border-accent-primary/30 shadow-[0_0_50px_rgba(255,149,0,0.2)]">
                    <Heart size={80} strokeWidth={2.5} className="animate-pulse" />
                </div>
                <div className="space-y-3">
                    <h2 className="text-5xl font-black uppercase tracking-tighter">¡Gracias, Patriarca!</h2>
                    <p className="text-text-muted text-xl max-w-sm mx-auto leading-tight">
                        Tu voto por el nombre ha sido registrado con honor.
                    </p>
                </div>

                <div className="glass p-8 rounded-[2.5rem] border-accent-primary/20 bg-accent-primary/10 max-w-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <Info className="text-accent-primary" size={24} />
                        <span className="text-xs uppercase font-black tracking-widest text-accent-primary">Nota de la App</span>
                    </div>
                    <p className="text-white font-bold text-lg leading-tight italic">
                        "¡Así de fácil va a ser votar por el Mejor Postre el próximo 1° de Mayo! Solo tocas la foto y listo."
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 pb-32">
            <div className="space-y-3">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-accent-primary/20 text-accent-primary">
                        <Award size={32} />
                    </div>
                    <h2 className="text-4xl font-black uppercase tracking-tighter">Demo Participativa</h2>
                </div>
                <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-white">¿Cómo deberíamos llamarnos?</h3>
                    <p className="text-text-muted text-lg leading-snug">
                        Probá el sistema de voto eligiendo el nombre que mejor nos represente después de 40 años de historia.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {APP_NAMES.map((nameOption) => (
                    <div key={nameOption.id} className="group relative glass rounded-[2.5rem] overflow-hidden border-white/5 shadow-2xl transition-all hover:scale-[1.02] hover:border-accent-primary/30">
                        <div className="h-48 w-full relative overflow-hidden">
                            <img
                                src={nameOption.image}
                                alt={nameOption.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-80" />
                        </div>

                        <div className="p-8 space-y-4">
                            <div>
                                <h3 className="text-3xl font-black uppercase tracking-tight text-white">{nameOption.name}</h3>
                                <p className="text-text-muted text-lg font-medium">{nameOption.description}</p>
                            </div>

                            <button
                                onClick={() => handleVote(nameOption.id)}
                                disabled={votingInProgress !== null}
                                className={`w-full py-6 rounded-3xl font-black uppercase tracking-tighter text-xl flex items-center justify-center gap-3 transition-all ${votingInProgress === nameOption.id
                                    ? 'bg-white/10 text-white/40 cursor-not-allowed'
                                    : 'bg-white text-black hover:bg-accent-primary hover:text-white active:scale-95 shadow-[0_15px_30px_rgba(255,255,255,0.1)]'
                                    }`}
                            >
                                {votingInProgress === nameOption.id ? (
                                    <Loader2 className="animate-spin" size={28} />
                                ) : (
                                    <>
                                        VOTAR ESTE NOMBRE
                                        <Flame size={24} />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="text-center py-6 border-t border-white/5 mt-4">
                <p className="text-[10px] uppercase font-black tracking-[0.3em] text-white/20">
                    SISTEMA DE VOTACIÓN INALTERABLE v4.0 (Patriarcas Edition)
                </p>
            </div>
        </div>
    );
}
