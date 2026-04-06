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
                className={`flex items-center gap-2 p-1.5 pr-4 rounded-full transition-all duration-500 border shadow-sm ${isOpen ? 'bg-background border-border scale-105 shadow-minimal' : 'bg-background-soft border-border/50 hover:bg-background hover:scale-105'}`}
                title="Account Settings"
            >
                <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-sm font-bold shrink-0 overflow-hidden transition-all duration-500 group-hover:rotate-6" style={{ transform: isOpen ? 'scale(1.1) rotate(5deg)' : 'scale(1)' }}>
                    {user?.profilePictureUrl ? (
                        <img src={getMediaUrl(user.profilePictureUrl)} alt="" className="w-full h-full object-cover" />
                    ) : (
                        user?.fullName?.[0] || 'U'
                    )}
                </div>
                <div className="flex flex-col items-start min-w-0 font-sans">
                    <span className={`text-[11px] font-bold uppercase tracking-[0.2em] transition-colors duration-300 ${isOpen ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {user?.fullName.split(' ')[0]}
                    </span>
                    <div className="w-full h-0.5 bg-border rounded-full overflow-hidden mt-0.5">
                        <div className={`h-full bg-primary transition-all duration-700 ${isOpen ? 'w-full' : 'w-1/3 opacity-50'}`} />
                    </div>
                </div>
                <span className={`transition-all duration-300 ml-1 ${isOpen ? 'text-foreground rotate-180 scale-110' : 'text-muted-foreground'}`}>
                    {isOpen ? <X size={14} strokeWidth={2.5} /> : <ChevronDown size={14} strokeWidth={2.5} />}
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
                        className="absolute right-0 mt-4 w-80 card-minimal z-[60] origin-top-right overflow-hidden border-border"
                    >
                        {/* User Profile Section - The "Identity Mini-Card" */}
                        <div className="p-6 pb-5 bg-background border-b border-border/50 relative overflow-hidden group/profile">
                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-3xl group-hover/profile:bg-primary/10 transition-colors duration-700" />
                            
                            <div className="flex items-center gap-5 relative z-10">
                                <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-xl font-bold shrink-0 overflow-hidden group-hover/profile:scale-105 transition-transform duration-500 shadow-sm">
                                    {user?.profilePictureUrl ? (
                                        <img src={getMediaUrl(user.profilePictureUrl)} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        user?.fullName?.[0] || 'U'
                                    )}
                                </div>
                                <div className="flex flex-col min-w-0 font-sans">
                                    <span className="text-sm font-bold text-foreground leading-tight truncate uppercase tracking-widest">
                                        {user?.fullName}
                                    </span>
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                                        <span className="text-[9px] text-muted-foreground font-bold tracking-widest uppercase">
                                            {user?.role.replace('_', ' ')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-3 space-y-2 bg-card">
                            {/* Theme Toggle Section */}
                            <div className="px-2 pt-2 font-sans">
                                <span className="block mb-2 text-[9px] font-bold text-muted-foreground uppercase tracking-widest pl-2 opacity-60">Appearance</span>
                                <button
                                    onClick={toggleTheme}
                                    className="w-full flex items-center justify-between p-3.5 rounded-xl hover:bg-background-soft group transition-all duration-300 border border-transparent hover:border-border/50 shadow-sm"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-9 h-9 rounded-xl bg-background border border-border flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-minimal">
                                            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-foreground group-hover:text-primary transition-colors">
                                            {theme === 'light' ? 'DARK MODE' : 'LIGHT MODE'}
                                        </span>
                                    </div>
                                    <div className={`w-10 h-5 rounded-full relative transition-all duration-500 ${theme === 'light' ? 'bg-muted-foreground/30' : 'bg-primary'}`}>
                                        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-minimal transition-all duration-500 ${theme === 'light' ? 'left-0.5' : 'left-5.5'}`} />
                                    </div>
                                </button>
                            </div>

                            <div className="h-[1px] bg-border mx-4 my-1" />

                            {/* Calendar Toggle Section */}
                            <div className="px-2 font-sans">
                                <span className="block mb-2 text-[9px] font-bold text-muted-foreground uppercase tracking-widest pl-2 opacity-60">Regional Calendar</span>
                                <div className="p-1 px-1.5 rounded-xl bg-background border border-border shadow-sm">
                                    <CalendarToggle variant="plain" />
                                </div>
                            </div>

                            {/* Language Switcher Section */}
                            <div className="px-2 font-sans">
                                <span className="block mb-2 text-[9px] font-bold text-muted-foreground uppercase tracking-widest pl-2 opacity-60">Market Language</span>
                                <div className="p-1 px-1.5 rounded-xl bg-background border border-border shadow-sm text-sm">
                                    <LanguageSwitcher variant="plain" />
                                </div>
                            </div>

                            <div className="h-[1px] bg-border mx-4 my-1" />

                            {/* Logout Action */}
                            <div className="px-2 pb-2 font-sans">
                                <button
                                    onClick={() => {
                                        setIsOpen(false);
                                        onLogout();
                                    }}
                                    className="w-full flex items-center gap-4 p-3.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-500/10 group transition-all duration-300 border border-transparent hover:border-rose-200 dark:hover:border-rose-500/20 text-rose-600 active:scale-[0.98] shadow-sm"
                                >
                                    <div className="w-9 h-9 rounded-xl bg-white dark:bg-rose-500/5 flex items-center justify-center text-rose-600 group-hover:scale-110 transition-all border border-rose-100 dark:border-rose-500/20 shadow-minimal">
                                        <LogOut size={18} />
                                    </div>
                                    <div className="flex flex-col items-start translate-x-0 group-hover:translate-x-1 transition-transform">
                                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-rose-600">
                                            Sign Out
                                        </span>
                                        <span className="text-[9px] font-bold text-rose-400 uppercase tracking-widest mt-0.5">
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
