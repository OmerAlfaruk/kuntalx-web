import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { KuntalXIconDark } from './Logo';
import { createPortal } from 'react-dom';
import { useSettings } from '../../lib/settings-context';
import { formatEthiopianDate } from '../utils/ethiopian-date';
import { useI18n } from '../../lib/i18n-context';
export * from './Skeletons';

// --- StatCard ---
interface StatCardProps {
    title: string;
    value: string | number;
    description?: string;
    icon: string;
    trend?: {
        value: number;
        isUp: boolean;
    };
    className?: string;
    delay?: number;
}

export const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    description,
    icon,
    trend,
    className = "",
    delay = 0
}) => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            className={`card-minimal p-6 ${className}`}
        >
            <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-primary text-xl border border-primary shadow-[0_0_15px_rgba(var(--primary),0.3)]">
                    {icon}
                </div>
                {trend && (
                    <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${trend.isUp
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                        }`}>
                        {trend.isUp ? '↑' : '↓'} {Math.abs(trend.value)}%
                    </div>
                )}
            </div>

            <div className="space-y-1">
                <h3 className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em]">{title}</h3>
                <p className="text-2xl font-bold text-foreground tracking-tight">{value}</p>
                {description && (
                    <p className="text-xs text-muted-foreground/40 mt-2 line-clamp-2 leading-relaxed">
                        {description}
                    </p>
                )}
            </div>
        </motion.div>
    );
};

// --- GlassCard (Renamed to Card internally, keeping GlassCard export for compatibility during transition) ---
interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = "", ...props }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className={`card-minimal p-6 border border-primary/20 bg-background/40 backdrop-blur-xl ${className}`} 
            {...(props as any)}
        >
            {children}
        </motion.div>
    );
};

// --- PageHeader ---
interface PageHeaderProps {
    title: string;
    description?: string;
    actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, description, actions }) => {
    return (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-border/50 mb-10">
            <div className="space-y-1 min-w-0">
                <h1 className="text-3xl font-bold text-foreground tracking-tight leading-tight">
                    {title}
                </h1>
                {description && (
                    <p className="text-sm text-muted-foreground/60 max-w-2xl leading-relaxed">
                        {description}
                    </p>
                )}
            </div>
            {actions && <div className="flex flex-wrap items-center gap-3 w-full md:w-auto md:justify-end">{actions}</div>}
        </div>
    );
};

export const Badge: React.FC<{
    children: React.ReactNode,
    variant?: 'primary' | 'success' | 'warning' | 'error' | 'outline' | 'secondary' | 'gold',
    className?: string
}> = ({ children, variant = 'primary', className = "" }) => {
    const variants = {
        primary: 'bg-primary/10 text-primary border-primary/20',
        secondary: 'bg-secondary/10 text-secondary border-secondary/20',
        success: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
        warning: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
        error: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
        gold: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
        outline: 'bg-muted/10 text-muted-foreground border-border'
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-colors uppercase tracking-wider ${variants[variant]} ${className}`}>
            {children}
        </span>
    );
};

// --- GlassModal (Using Portals for reliable positioning) ---
export const GlassModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    maxWidth?: string;
}> = ({ isOpen, onClose, title, children, footer, maxWidth = "max-w-xl" }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-md animate-in fade-in duration-300"
                onClick={onClose}
            />
            <div className={`relative z-10 w-full ${maxWidth} max-h-full flex flex-col animate-in fade-in zoom-in-95 duration-500`}>
                <div className="bg-card rounded-2xl max-h-[90vh] flex flex-col p-0 overflow-hidden shadow-card border border-border">
                    <div className="px-8 py-5 border-b border-border flex justify-between items-center bg-background/50 backdrop-blur-sm">
                        <h2 className="text-xl font-bold text-foreground tracking-tight">{title}</h2>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:bg-white/10 hover:text-foreground rounded-full transition-all"
                        >
                            ✕
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                        {children}
                    </div>
                    {footer && (
                        <div className="px-8 py-6 border-t border-border bg-background/50 flex justify-end gap-4">
                            {footer}
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};
// --- AdaptiveDate ---
interface AdaptiveDateProps {
    date: Date | string | number;
    showYear?: boolean;
    className?: string;
}

export const AdaptiveDate: React.FC<AdaptiveDateProps> = ({
    date,
    showYear = true,
    className = ""
}) => {
    const { calendarType } = useSettings();
    const { language } = useI18n();
    const dateObj = new Date(date);

    if (isNaN(dateObj.getTime())) {
        return <span className={className}>Invalid Date</span>;
    }

    if (calendarType === 'ethiopian') {
        return <span className={className}>{formatEthiopianDate(dateObj, showYear)}</span>;
    }

    // Default Gregorian formatting
    return (
        <span className={className}>
            {dateObj.toLocaleDateString(language === 'en' ? 'en-US' : language, {
                month: 'short',
                day: 'numeric',
                year: showYear ? 'numeric' : undefined
            })}
        </span>
    );
};
// --- OtpInput ---
export const OtpInput: React.FC<{
    value: string;
    onChange: (val: string) => void;
    length?: number;
    obscureText?: boolean;
    disabled?: boolean;
    autoFocus?: boolean;
}> = ({ value, onChange, length = 6, obscureText = true, disabled = false, autoFocus = false }) => {
    const [focused, setFocused] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);

    return (
        <div
            className="relative flex justify-between gap-2 sm:gap-4 w-full cursor-text"
            onClick={() => inputRef.current?.focus()}
        >
            <input
                ref={inputRef}
                type="tel"
                maxLength={length}
                value={value}
                onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    onChange(val);
                }}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                disabled={disabled}
                autoFocus={autoFocus}
                className="absolute inset-0 opacity-0 w-full h-full cursor-text z-10"
            />

            {Array.from({ length }).map((_, i) => {
                const hasValue = i < value.length;
                const char = hasValue ? (obscureText ? '●' : value[i]) : '';
                const isCurrent = focused && (!disabled) && (value.length === i || (i === length - 1 && value.length === length));

                return (
                    <div
                        key={i}
                        className={`flex-1 h-14 sm:h-18 rounded-2xl border-2 flex items-center justify-center transition-all duration-200 ${isCurrent
                            ? 'border-primary bg-primary/5 scale-105 ring-4 ring-primary/10'
                            : hasValue
                                ? 'border-primary/50 bg-background'
                                : 'border-border bg-card'
                            }`}
                    >
                        <span className={`font-extrabold text-foreground transition-all duration-200 ${obscureText && hasValue ? 'text-sm sm:text-base' : 'text-2xl sm:text-3xl italic'}`}>
                            {char}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

// --- CustomSelect ---
export interface CustomSelectOption {
    value: string;
    label: string;
}

export const CustomSelect: React.FC<{
    value: string;
    onChange: (value: string) => void;
    options: CustomSelectOption[];
    placeholder?: string;
    className?: string;
}> = ({ value, onChange, options, placeholder = "SELECT OPTION", className = "" }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.value === value);

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={containerRef} className="relative w-full">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between transition-all focus:outline-none ${className} ${isOpen ? 'ring-2 ring-primary/20 border-primary' : ''}`}
            >
                <span className={`block truncate ${!selectedOption ? 'opacity-50' : ''}`}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <span className={`pointer-events-none transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 opacity-50">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                </span>
            </button>

            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-card border border-border/80 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="max-h-60 overflow-y-auto custom-scrollbar p-1.5 flex flex-col gap-1">
                        <button
                            type="button"
                            onClick={() => {
                                onChange('');
                                setIsOpen(false);
                            }}
                            className={`w-full text-left px-4 py-3 text-xs font-extrabold uppercase tracking-wider italic rounded-lg transition-all ${!value
                                ? 'bg-primary text-primary-foreground shadow-sm'
                                : 'text-foreground/80 hover:bg-primary/10 hover:text-primary'
                                }`}
                        >
                            {placeholder}
                        </button>

                        {options.map((option) => {
                            const isSelected = value === option.value;
                            return (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => {
                                        onChange(option.value);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-3 text-xs font-extrabold uppercase tracking-wider italic rounded-lg transition-all ${isSelected
                                        ? 'bg-primary text-primary-foreground shadow-sm'
                                        : 'text-foreground/80 hover:bg-primary/10 hover:text-primary'
                                        }`}
                                >
                                    {option.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

// --- KuntalLoader ---
export const KuntalLoader: React.FC<{ variant?: 'full' | 'small' }> = ({
    variant = "full"
}) => {
    if (variant === 'small') {
        return (
            <div className="relative w-5 h-5 flex items-center justify-center">
                {/* Outer Ring - Clockwise */}
                <div className="absolute inset-0 border-2 border-primary border-t-transparent rounded-full animate-[spin_2s_linear_infinite]" />
                {/* Inner Ring - Counter-Clockwise */}
                <div className="absolute inset-[3px] border-2 border-secondary-soft border-t-transparent rounded-full animate-[spin_1.5s_linear_infinite_reverse]" />
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background/80 backdrop-blur-md animate-in fade-in duration-700">
            <div className="relative w-32 h-32 mb-10 flex items-center justify-center">
                {/* Outer Ring - Clockwise */}
                <div className="absolute inset-0 border-[3px] border-t-primary border-r-transparent border-b-primary/30 border-l-transparent rounded-full animate-[spin_3s_linear_infinite]" />

                {/* Inner Ring - Counter-Clockwise */}
                <div className="absolute inset-4 border-[3px] border-t-secondary-soft border-r-transparent border-b-secondary-soft/30 border-l-transparent rounded-full animate-[spin_2s_linear_infinite_reverse]" />

                {/* Logo in the center */}
                <div className="relative w-14 h-14 p-2 bg-background/50 backdrop-blur-sm rounded-2xl border border-white/10 shadow-2xl flex items-center justify-center animate-[pulse_2s_ease-in-out_infinite]">
                    <KuntalXIconDark className="w-full h-full" />
                </div>

                {/* Orbital dots for extra flair */}
                <div className="absolute inset-0 animate-[spin_3s_linear_infinite]">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.8)]" />
                </div>
                <div className="absolute inset-4 animate-[spin_2s_linear_infinite_reverse]">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-secondary-soft rounded-full shadow-[0_0_10px_rgba(var(--secondary-soft),0.8)]" />
                </div>
            </div>
        </div>
    );
};

// --- Pagination ---
export interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    className = ""
}) => {
    if (totalPages <= 1 || !isFinite(totalPages)) return null;

    const pages = Array.from({ length: Math.min(totalPages, 1000) }, (_, i) => i + 1);

    // Simple windowing for page numbers if totalPages is large
    const getVisiblePages = () => {
        if (totalPages <= 7) return pages;

        if (currentPage <= 4) return [...pages.slice(0, 5), '...', totalPages];
        if (currentPage >= totalPages - 3) return [1, '...', ...pages.slice(totalPages - 5)];

        return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
    };

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="h-9 w-9 flex items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-primary disabled:opacity-30 disabled:hover:border-border disabled:hover:text-muted-foreground transition-all italic font-extrabold outline-none"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
            </button>

            <div className="flex items-center gap-1.5">
                {getVisiblePages().map((page, index) => (
                    typeof page === 'number' ? (
                        <button
                            key={index}
                            onClick={() => onPageChange(page)}
                            className={`h-9 min-w-[36px] px-2 flex items-center justify-center rounded-lg text-xs font-extrabold transition-all italic outline-none ${currentPage === page
                                ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105'
                                : 'bg-card border border-border text-muted-foreground hover:border-primary/30 hover:text-primary'
                                }`}
                        >
                            {page}
                        </button>
                    ) : (
                        <span key={index} className="px-1 text-muted-foreground/40 font-black italic">...</span>
                    )
                ))}
            </div>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="h-9 w-9 flex items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-primary disabled:opacity-30 disabled:hover:border-border disabled:hover:text-muted-foreground transition-all italic font-extrabold outline-none"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
            </button>
        </div>
    );
};

export const TablePagination: React.FC<{
    currentPage: number;
    totalPages: number;
    totalRecords: number;
    onPageChange: (page: number) => void;
    pageSize: number;
}> = ({ currentPage, totalPages, totalRecords, onPageChange, pageSize }) => {
    const startRecord = totalRecords === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const endRecord = Math.min(currentPage * pageSize, totalRecords);

    return (
        <div className="px-6 py-4 bg-muted/5 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest italic opacity-60">
                Displaying <span className="text-foreground">{startRecord}-{endRecord}</span> of <span className="text-foreground">{totalRecords}</span> indexed records
            </p>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
            />
        </div>
    );
};
