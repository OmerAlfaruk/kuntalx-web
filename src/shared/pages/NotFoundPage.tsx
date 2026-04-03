import React from 'react';
import { useNavigate } from '@tanstack/react-router';

export const NotFoundPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
            {/* Professional Backdrop Decor */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 max-w-2xl w-full">
                {/* Visual Icon */}
                <div className="mb-8 relative inline-block">
                    <div className="text-9xl font-black text-primary/10 select-none">404</div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-6xl animate-bounce">🌾</span>
                    </div>
                </div>

                {/* Content */}
                <h1 className="text-4xl sm:text-5xl font-black text-foreground tracking-tight uppercase italic mb-4">
                    Protocol Interrupted
                </h1>
                <p className="text-lg text-muted-foreground font-medium mb-12 max-w-md mx-auto italic">
                    The requested data stream or navigation node could not be established. It may have been relocated or purged from the registry.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                        onClick={() => window.history.back()}
                        className="w-full sm:w-auto px-8 h-12 rounded-2xl bg-card border border-border text-foreground font-black uppercase tracking-wider hover:bg-muted transition-all shadow-sm flex items-center justify-center gap-2"
                    >
                        <span>←</span> Return
                    </button>
                    <button
                        onClick={() => navigate({ to: '/' })}
                        className="w-full sm:w-auto px-10 h-12 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-wider shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        <span>🏠</span> Terminal Home
                    </button>
                </div>

                {/* Decorative Footer */}
                <div className="mt-20 pt-8 border-t border-border/50">
                    <p className="text-xs font-black text-muted-foreground/40 uppercase tracking-[0.5em] italic">
                        KUNTALX REGISTRY SYSTEM // ERR_CODE: 0x404
                    </p>
                </div>
            </div>
        </div>
    );
};
