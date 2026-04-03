import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../lib/auth-context';
import { useTheme } from '../../lib/theme-context';
import { useI18n } from '../../lib/i18n-context';
import { getMediaUrl } from '../../lib/api-client';
import { LanguageSwitcher } from './LanguageSwitcher';
import { CalendarToggle } from './CalendarToggle';
import { 
    Moon, 
    Sun, 
    LogOut, 
    ChevronDown, 
    X
} from 'lucide-react';

export const QuickActionsMenu = ({ onLogout }: { onLogout: () => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const { user } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const { t } = useI18n();

    useEffect(() => {
        const handlehandleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handlehandleClickOutside);
        return () => document.removeEventListener('mousedown', handlehandleClickOutside);
    }, []);

    return (
        <div ref={containerRef} className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 p-1.5 pr-4 rounded-full transition-all duration-500 border border-white/10 shadow-sm ${isOpen ? 'bg-white/20 border-white/30 scale-105 shadow-xl shadow-black/20' : 'hover:bg-white/10 hover:border-white/20 hover:scale-105'}`}
                title="Account Settings"
            >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-white/20 to-white/5 border border-white/30 flex items-center justify-center text-white text-sm font-black shadow-[inset_0_2px_4px_rgba(255,255,255,0.2)] shrink-0 overflow-hidden transition-all duration-500 group-hover:rotate-6" style={{ transform: isOpen ? 'scale(1.1) rotate(5deg)' : 'scale(1)' }}>
                    {user?.profilePictureUrl ? (
                        <img src={getMediaUrl(user.profilePictureUrl)} alt="" className="w-full h-full object-cover" />
                    ) : (
                        user?.fullName?.[0] || 'U'
                    )}
                </div>
                <div className="flex flex-col items-start min-w-0 mr-1 font-[family-name:var(--font-header)]">
                    <span className={`text-[11px] font-black uppercase tracking-[0.2em] transition-colors duration-300 ${isOpen ? 'text-white' : 'text-white/70'}`}>
                        {user?.fullName.split(' ')[0]}
                    </span>
                    <div className="w-full h-0.5 bg-white/20 rounded-full overflow-hidden mt-0.5">
                        <div className={`h-full bg-white transition-all duration-700 ${isOpen ? 'w-full' : 'w-1/3 opacity-50'}`} />
                    </div>
                </div>
                <span className={`transition-all duration-300 ml-1 ${isOpen ? 'text-white rotate-180 scale-110' : 'text-white/40'}`}>
                    {isOpen ? <X size={14} strokeWidth={3} /> : <ChevronDown size={14} strokeWidth={3} />}
                </span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 12, x: 20, scale: 0.9, rotate: 1 }}
                        animate={{ opacity: 1, y: 0, x: 0, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, y: 12, scale: 0.9, rotate: -1 }}
                        transition={{ 
                            type: "spring",
                            stiffness: 400,
                            damping: 30
                        }}
                        className="absolute right-0 mt-4 w-80 card-minimal rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.35)] z-[60] origin-top-right border-t border-t-white/10"
                    >
                        {/* User Profile Section - The "Identity Mini-Card" */}
                        <div className="p-6 pb-5 bg-gradient-to-br from-primary/10 via-background to-transparent border-b border-border/50 relative rounded-t-3xl overflow-hidden group/profile">
                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/2 rounded-full blur-3xl group-hover/profile:bg-primary/5 transition-colors duration-700" />
                            
                            <div className="flex items-center gap-5 relative z-10">
                                <div className="w-14 h-14 rounded-2xl bg-primary/5 border border-primary/20 flex items-center justify-center text-primary text-xl font-black shadow-minimal shrink-0 overflow-hidden group-hover/profile:scale-105 transition-transform duration-500">
                                    {user?.profilePictureUrl ? (
                                        <img src={getMediaUrl(user.profilePictureUrl)} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        user?.fullName?.[0] || 'U'
                                    )}
                                </div>
                                <div className="flex flex-col min-w-0 font-header">
                                    <span className="text-sm font-bold text-foreground leading-tight truncate uppercase tracking-widest">
                                        {user?.fullName}
                                    </span>
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                                        <span className="text-[9px] text-muted-foreground/60 font-bold tracking-widest uppercase">
                                            {user?.role.replace('_', ' ')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-3 space-y-2">
                            {/* Theme Toggle Section */}
                            <div className="px-2 pt-2 font-header">
                                <span className="block mb-2 text-[9px] font-bold text-muted-foreground uppercase tracking-widest pl-2 opacity-40">Appearance</span>
                                <button
                                    onClick={toggleTheme}
                                    className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-muted/50 group transition-all duration-300 border border-transparent hover:border-border/50 shadow-sm"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-9 h-9 rounded-xl bg-muted/30 border border-border/40 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/70 group-hover:text-primary transition-colors">
                                            {theme === 'light' ? 'DARK MODE' : 'LIGHT MODE'}
                                        </span>
                                    </div>
                                    <div className={`w-10 h-5 rounded-full relative transition-all duration-500 ${theme === 'light' ? 'bg-muted-foreground/10' : 'bg-primary/80'}`}>
                                        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-500 ${theme === 'light' ? 'left-0.5' : 'left-5.5'} flex items-center justify-center`}>
                                            <div className={`w-0.5 h-1.5 rounded-full bg-primary/20 transition-opacity duration-300 ${theme === 'light' ? 'opacity-0' : 'opacity-100'}`} />
                                        </div>
                                    </div>
                                </button>
                            </div>

                            <div className="h-[1px] bg-border/40 mx-4 my-1" />

                            {/* Calendar Toggle Section */}
                            <div className="px-2 font-header">
                                <span className="block mb-2 text-[9px] font-bold text-muted-foreground uppercase tracking-widest pl-2 opacity-40">Regional Calendar</span>
                                <div className="p-1 px-1.5 rounded-2xl bg-muted/5 border border-border/30">
                                    <CalendarToggle variant="plain" />
                                </div>
                            </div>

                            {/* Language Switcher Section */}
                            <div className="px-2 font-header">
                                <span className="block mb-2 text-[9px] font-bold text-muted-foreground uppercase tracking-widest pl-2 opacity-40">Market Language</span>
                                <div className="p-1 px-1.5 rounded-2xl bg-muted/5 border border-border/30 text-sm">
                                    <LanguageSwitcher variant="plain" />
                                </div>
                            </div>

                            <div className="h-[1px] bg-border/40 mx-4 my-1" />

                            {/* Logout Action */}
                            <div className="px-2 pb-2 font-header">
                                <button
                                    onClick={() => {
                                        setIsOpen(false);
                                        onLogout();
                                    }}
                                    className="w-full flex items-center gap-4 p-3.5 rounded-2xl hover:bg-rose-500/5 group transition-all duration-300 border border-transparent hover:border-rose-500/10 text-rose-600 active:scale-[0.98]"
                                >
                                    <div className="w-9 h-9 rounded-xl bg-rose-500/5 flex items-center justify-center text-rose-500 group-hover:scale-110 transition-all border border-rose-500/10">
                                        <LogOut size={18} />
                                    </div>
                                    <div className="flex flex-col items-start translate-x-0 group-hover:translate-x-1 transition-transform">
                                        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                                            Sign Out
                                        </span>
                                        <span className="text-[9px] font-bold text-rose-500/40 uppercase tracking-widest mt-0.5 group-hover:text-rose-500/60 transition-colors">
                                            {t('common.signOut')}
                                        </span>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
