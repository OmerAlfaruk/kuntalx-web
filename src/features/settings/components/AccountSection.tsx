import React, { memo } from 'react';
import { UserIcon, EnvelopeIcon, CameraIcon } from "@heroicons/react/24/outline";
import { OtpInput } from "../../../shared/components/UI";
import { getMediaUrl } from "../../../lib/api-client";

interface AccountSectionProps {
    user: any;
    profileForm: { fullName: string; email: string };
    securityForm: { currentPin: string; newPin: string; confirmPin: string };
    isSaving: boolean;
    onProfileChange: (field: string, value: string) => void;
    onProfileSave: (e: React.FormEvent) => void;
    onSecurityChange: (field: string, value: string) => void;
    onSecuritySave: (e: React.FormEvent) => void;
}

const SettingsItem = ({
    icon: Icon,
    title,
    subtitle,
    children,
    onAction,
    actionLabel,
}: {
    icon: any;
    title: string;
    subtitle?: string;
    children?: React.ReactNode;
    onAction?: () => void;
    actionLabel?: string;
}) => (
    <div className="group/item flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-6 border-b border-border/50 last:border-0 hover:bg-background-soft transition-all duration-300 px-4 -mx-4 sm:px-0 sm:mx-0 text-left">
        <div className="flex items-center gap-4 flex-1">
            <div className="w-9 h-9 rounded-lg bg-background-soft border border-border/50 flex items-center justify-center text-primary shrink-0 group-hover/item:border-primary/30 transition-all">
                <Icon className="w-4 h-4" />
            </div>
            <div className="space-y-0.5 min-w-0">
                <h4 className="text-[10px] font-bold text-foreground uppercase tracking-widest">
                    {title}
                </h4>
                {subtitle && (
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-40">
                        {subtitle}
                    </p>
                )}
            </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto sm:justify-end">
            {children}
            {onAction && (
                <button
                    onClick={onAction}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 h-9 px-6 rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest shadow-minimal"
                >
                    {actionLabel || "Configure"}
                </button>
            )}
        </div>
    </div>
);

const SectionHeader = ({ title }: { title: string }) => (
    <div className="mb-6 flex items-center gap-4">
        <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] shrink-0 text-left">
            {title}
        </h2>
        <div className="h-px flex-1 bg-border/40" />
    </div>
);

export const AccountSection: React.FC<AccountSectionProps> = memo(({
    user,
    profileForm,
    securityForm,
    isSaving,
    onProfileChange,
    onProfileSave,
    onSecurityChange,
    onSecuritySave
}) => {
    return (
        <section className="space-y-8">
            <SectionHeader title="Account Settings" />
            <div className="card-minimal p-4 sm:p-8 relative">
                <div className="flex items-center gap-6 mb-8 pb-8 border-b border-border/50">
                    <div className="relative group/avatar">
                        <div className="w-20 h-20 rounded-xl bg-background-soft border border-border flex items-center justify-center text-primary text-2xl font-bold overflow-hidden transition-transform">
                            {user?.profilePictureUrl ? (
                                <img src={getMediaUrl(user.profilePictureUrl)} alt={user.fullName} className="w-full h-full object-cover" />
                            ) : (
                                user?.fullName?.[0] || "?"
                            )}
                        </div>
                        <button className="absolute -bottom-2 -right-2 w-7 h-7 rounded-lg bg-card border border-border shadow-minimal flex items-center justify-center text-primary hover:scale-105 transition-transform">
                            <CameraIcon className="w-3.5 h-3.5" />
                        </button>
                    </div>
                    <div className="space-y-0.5 text-left">
                        <h3 className="text-base font-bold text-foreground uppercase tracking-tight">{user?.fullName}</h3>
                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest opacity-60">
                            {user?.role?.replace("_", " ")}
                        </p>
                    </div>
                </div>

                <div className="divide-y divide-border/50">
                    <SettingsItem icon={UserIcon} title="Full Name" subtitle={profileForm.fullName || "Unset ID"}>
                        <input
                            type="text"
                            value={profileForm.fullName}
                            onChange={(e) => onProfileChange('fullName', e.target.value)}
                            onBlur={onProfileSave}
                            className="bg-background-soft border border-border rounded-lg px-3 py-1.5 text-xs font-medium text-foreground focus:border-primary/50 focus:outline-none transition-all w-full sm:w-48 sm:text-right"
                        />
                    </SettingsItem>

                    <SettingsItem icon={EnvelopeIcon} title="Email Address" subtitle={profileForm.email || "No secure address"}>
                        <input
                            type="email"
                            value={profileForm.email}
                            onChange={(e) => onProfileChange('email', e.target.value)}
                            onBlur={onProfileSave}
                            className="bg-background-soft border border-border rounded-lg px-3 py-1.5 text-xs font-medium text-foreground focus:border-primary/50 focus:outline-none transition-all w-full sm:w-48 sm:text-right"
                        />
                    </SettingsItem>

                    <div className="py-8 space-y-6 text-left">
                        <div className="flex items-center gap-3">
                            <h5 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                Security
                            </h5>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 pl-11">
                            <div className="space-y-4">
                                <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4 ml-1 opacity-60">Current PIN</label>
                                <OtpInput value={securityForm.currentPin} onChange={(val: string) => onSecurityChange('currentPin', val)} obscureText={true} disabled={isSaving} />
                            </div>
                            <div className="space-y-4 relative">
                                <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4 ml-1 opacity-60">New PIN</label>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-3">
                                    <div className="flex-1">
                                        <OtpInput value={securityForm.newPin} onChange={(val: string) => onSecurityChange('newPin', val)} obscureText={true} disabled={isSaving} />
                                    </div>
                                    <button
                                        onClick={onSecuritySave}
                                        disabled={isSaving || !securityForm.currentPin || securityForm.newPin.length < 4}
                                        className="h-10 px-8 sm:px-6 bg-primary text-white font-bold text-[10px] uppercase tracking-widest rounded-lg shadow-minimal hover:bg-primary/90 transition-all disabled:opacity-30 w-full sm:w-auto"
                                    >
                                        Update PIN
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
});
