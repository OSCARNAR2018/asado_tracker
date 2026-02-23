'use client';

import { useState, useEffect } from 'react';
import { Cake, CheckCircle2, ChevronRight, Loader2 } from 'lucide-react';
import { doc, getDoc, setDoc, onSnapshot, collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const DESSERTS_LIST = [
    { id: 1, name: 'Chocotorta', description: 'El clásico de toda mesa argentina' },
    { id: 2, name: 'Asado con Dulce de Leche', description: 'Combinación audaz y sorprendente' },
    { id: 3, name: 'Flan Mixto', description: 'Con crema y dulce, como debe ser' },
    { id: 4, name: 'Ensalada de Frutas', description: 'La opción refrescante y ligera' },
];

export default function VotingView() {
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [voted, setVoted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isSimulated, setIsSimulated] = useState(true);
    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
        const savedUser = localStorage.getItem('asado_user');
        setUsername(savedUser);

        const checkSim = () => {
            setIsSimulated(localStorage.getItem('asado_simulated') !== 'false');
        };
        checkSim();

        window.addEventListener('simulation-changed', checkSim);
        return () => window.removeEventListener('simulation-changed', checkSim);
    }, []);

    useEffect(() => {
        if (isSimulated || !username) return;

        // Check if user already voted in Firestore
        const voteRef = doc(db, 'votes', username);
        const unsubscribe = onSnapshot(voteRef, (docSnap) => {
            if (docSnap.exists()) {
                setSelectedId(docSnap.data().dessertId);
                setVoted(true);
            }
        });

        return () => unsubscribe();
    }, [isSimulated, username]);

    const handleVote = async () => {
        if (!selectedId) return;

        if (isSimulated) {
            setVoted(true);
            return;
        }

        setLoading(true);
        try {
            // 1. Record the vote
            await setDoc(doc(db, 'votes', username!), {
                username,
                dessertId: selectedId,
                votedAt: new Date().toISOString()
            }, { merge: true });

            // 2. Incremental Points (MVP simple trick: create or update profile)
            const profileRef = doc(db, 'profiles', username!);
            const profileSnap = await getDoc(profileRef);
            const currentPoints = profileSnap.exists() ? (profileSnap.data().asado_points || 0) : 0;

            await setDoc(profileRef, {
                username,
                asado_points: currentPoints + 10 // Award points for voting
            }, { merge: true });

            setVoted(true);
        } catch (error) {
            console.error("Error voting:", error);
            alert("Error al registrar voto. ¿Activaste Firestore en modo prueba?");
        } finally {
            setLoading(false);
        }
    };

    if (voted) {
        return (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center space-y-6">
                <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center text-green-400 animate-pulse">
                    <CheckCircle2 size={64} />
                </div>
                <div>
                    <h2 className="text-3xl font-black uppercase italic tracking-tighter">¡Voto Registrado!</h2>
                    <p className="text-text-muted mt-2 font-medium">Tu elección ha sido grabada en el registro inmutable de la familia.</p>
                </div>
                <button
                    onClick={() => setVoted(false)}
                    className="text-accent-primary text-xs font-bold uppercase tracking-widest hover:underline"
                >
                    {isSimulated ? 'Simular cambio de voto' : 'Cambiar Voto'}
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 w-full max-w-lg mx-auto p-4">
            <div className="mb-4">
                <h2 className="text-3xl font-black italic uppercase tracking-tighter">Voto<span className="text-accent-primary">Postre</span></h2>
                <p className="text-text-muted text-xs font-bold uppercase tracking-wider">
                    {isSimulated ? 'Modo Simulación Activo' : 'Firestore Real-time'}
                </p>
            </div>

            <div className="grid gap-3">
                {DESSERTS_LIST.map((dessert) => (
                    <button
                        key={dessert.id}
                        disabled={loading}
                        onClick={() => setSelectedId(dessert.id)}
                        className={`flex items-center justify-between p-5 rounded-2xl transition-all duration-300 text-left group ${selectedId === dessert.id
                                ? 'bg-accent-primary/20 border-2 border-accent-primary'
                                : 'glass border border-white/5 hover:border-white/20'
                            }`}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl transition-colors ${selectedId === dessert.id ? 'bg-accent-primary text-black' : 'bg-white/5 text-text-muted'
                                }`}>
                                <Cake size={24} />
                            </div>
                            <div>
                                <p className={`font-bold text-lg ${selectedId === dessert.id ? 'text-white' : 'text-zinc-400'}`}>
                                    {dessert.name}
                                </p>
                                <p className="text-[10px] text-text-muted font-medium uppercase tracking-tight">
                                    {dessert.description}
                                </p>
                            </div>
                        </div>

                        <ChevronRight
                            size={20}
                            className={`transition-transform duration-300 ${selectedId === dessert.id ? 'translate-x-1 text-accent-primary' : 'opacity-0'
                                }`}
                        />
                    </button>
                ))}
            </div>

            <div className="mt-6 pt-6 border-t border-white/5">
                <button
                    disabled={!selectedId || loading}
                    onClick={handleVote}
                    className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-lg transition-all duration-300 flex items-center justify-center gap-2 ${selectedId && !loading
                            ? 'btn-primary shadow-xl shadow-accent-primary/20 scale-100'
                            : 'bg-zinc-800 text-zinc-600 cursor-not-allowed opacity-50 scale-95'
                        }`}
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin" size={24} />
                            Sincronizando...
                        </>
                    ) : 'Confirmar Elección'}
                </button>
            </div>
        </div>
    );
}
