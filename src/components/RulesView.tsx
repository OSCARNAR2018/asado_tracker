'use client';

import { Shield, Flame, GlassWater, Clock, Award, Info } from 'lucide-react';

export default function RulesView() {
    const rules = [
        {
            id: 1,
            icon: <Flame className="text-orange-500" size={32} />,
            title: "El Asador es Ley",
            description: "Nadie toca la carne ni las brasas sin permiso del asador. Se respeta el punto de cocción elegido."
        },
        {
            id: 2,
            icon: <Award className="text-yellow-500" size={32} />,
            title: "El Aplauso",
            description: "Es obligatorio el aplauso para el asador al momento de servir la primera tanda de carne."
        },
        {
            id: 3,
            icon: <GlassWater className="text-blue-400" size={32} />,
            title: "Copa Llena",
            description: "Nadie debe tener la copa vacía. El encargado de la bebida debe estar atento a la sed de los comensales."
        },
        {
            id: 4,
            icon: <Clock className="text-purple-400" size={32} />,
            title: "Puntualidad",
            description: "El asado no espera. La carne sale cuando sale, y el que llega tarde come frío."
        },
        {
            id: 5,
            icon: <Shield className="text-green-500" size={32} />,
            title: "Inmutabilidad",
            description: "Los votos son sagrados. No se aceptan reclamos sobre el ranking de postres una vez cerrado el evento."
        }
    ];

    return (
        <div className="flex flex-col gap-6 pb-24">
            <div className="flex items-center gap-4 mb-2">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                    <Shield className="text-accent-primary" size={28} />
                </div>
                <h2 className="text-3xl font-black uppercase tracking-tighter">Reglas de Oro</h2>
            </div>

            <div className="space-y-4">
                {rules.map((rule) => (
                    <div key={rule.id} className="glass p-8 rounded-[2.5rem] border-white/5 flex gap-6 items-start">
                        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 shrink-0">
                            {rule.icon}
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-white leading-tight">
                                <span className="text-accent-primary mr-2">{rule.id}.</span>
                                {rule.title}
                            </h3>
                            <p className="text-text-muted text-lg leading-relaxed font-medium">
                                {rule.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="glass p-8 rounded-[2.5rem] border-accent-primary/20 bg-accent-primary/5 mt-4">
                <div className="flex items-center gap-3 mb-3">
                    <Info className="text-accent-primary" size={24} />
                    <span className="text-xs uppercase font-black tracking-widest text-accent-primary">Nota del Sistema</span>
                </div>
                <p className="text-white font-bold text-xl leading-tight italic">
                    "El asado es el arte de la paciencia y el buen comer. Disfrute bajo su propia responsabilidad."
                </p>
            </div>
        </div>
    );
}
