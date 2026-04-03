import React from 'react';
import { useI18n } from '../../lib/i18n-context';

interface LogoProps {
    className?: string;
    showTagline?: boolean;
    variant?: 'light' | 'dark';
    iconOnly?: boolean;
}

export const KuntalXIconDark: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
    <img src="/logo.png" alt="KuntalX" className={`object-contain ${className}`} />
);

export const KuntalXIconLite: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
    <img src="/logo.png" alt="KuntalX" className={`object-contain ${className}`} />
);

export const KuntalXLogo: React.FC<LogoProps> = ({
    className = 'w-10 h-10',
    showTagline = true,
    variant = 'dark',
    iconOnly = false,
}) => {
    const { t } = useI18n();

    return (
        <div className="flex items-center gap-2 animate-logo-entrance">
            <img
                src="/logo.png"
                alt="KuntalX"
                className={`object-contain shrink-0 ${className}`}
            />
            {!iconOnly && (
                <div className="flex flex-col justify-center">
                    <span className={`text-2xl md:text-3xl font-black tracking-tighter leading-none ${variant === 'dark' ? 'text-primary' : 'text-white'}`}>
                        Kuntal<span className={variant === 'dark' ? 'text-secondary-soft' : 'text-gold'}>X</span>
                    </span>
                    {showTagline && (
                        <span className={`text-xs font-bold tracking-tight mt-1 leading-none ${variant === 'dark' ? 'text-secondary-soft' : 'text-gold'}`}>
                            {t('marketing.logo.tagline')}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};
