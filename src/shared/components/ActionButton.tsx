import React from 'react';

export interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline' | 'success' | 'ghost' | 'danger';
    icon?: React.ReactNode;
    children: React.ReactNode;
    fullWidth?: boolean;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
    variant = 'primary',
    icon,
    children,
    fullWidth = false,
    className = '',
    ...props
}) => {
    const baseStyles = "h-9 sm:h-10 px-4 sm:px-6 flex items-center justify-center gap-2 text-[10px] font-extrabold rounded-lg transition-all uppercase italic tracking-wider flex-1 sm:flex-none";
    
    const variants = {
        primary: "bg-primary text-white hover:brightness-110 active:scale-95 shadow-lg shadow-primary/20",
        success: "bg-emerald-600 text-white hover:brightness-110 active:scale-95 shadow-lg shadow-emerald-500/20",
        danger: "bg-rose-600 text-white hover:brightness-110 active:scale-95 shadow-lg shadow-rose-500/20",
        outline: "bg-background border border-border text-muted-foreground hover:bg-muted",
        ghost: "bg-transparent text-muted-foreground hover:bg-muted/50"
    };

    const widthStyle = fullWidth ? "w-full" : "w-full sm:w-auto";

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${widthStyle} ${className}`}
            {...props}
        >
            {icon && <span>{icon}</span>}
            {children}
        </button>
    );
};
