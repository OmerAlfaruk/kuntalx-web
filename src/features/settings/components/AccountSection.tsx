import React, { memo } from 'react';
import { UserIcon, EnvelopeIcon, CameraIcon } from "@heroicons/react/24/outline";
import { OtpInput, Badge } from "../../../shared/components/UI";
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
    <div className="group/item flex flex-col sm:flex-row sm:items-center justify-between gap-6 py-8 border-b border-border/50 last:border-0 hover:bg-background-soft/30 transition-all duration-300 px-6 -mx-6 sm:px-0 sm:mx-0 text-left rounded-xl">
        <div className="flex items-center gap-6 flex-1">
            <div className="w-11 h-11 rounded-xl bg-primary/5 border border-primary/20 flex items-center justify-center text-primary shrink-0 group-hover/item:bg-primary group-hover/item:text-white transition-all shadow-minimal">
                <Icon className="w-5 h-5" />
            </div>
            <div className="space-y-1 min-w-0">
                <h4 className="text-[11px] font-bold text-foreground uppercase tracking-widest">
                    {title}
                </h4>
                {subtitle && (
                    <p className="text-[10px] text-muted-foreground/60 font-bold uppercase tracking-widest leading-none mt-1">
                        {subtitle}
                    </p>
                )}
            </div>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto sm:justify-end">
            {children}
            {onAction && (
                <button
                    onClick={onAction}
                    className="flex-1 sm:flex-none h-11 px-6 rounded-xl bg-primary text-white hover:bg-primary/90 active:scale-95 transition-all text-[10px] font-bold uppercase tracking-widest shadow-minimal"
                >
                    {actionLabel || "Update"}
                </button>
            )}
        </div>
    </div>
);

const SectionHeader = ({ title }: { title: string }) => (
    <div className="mb-8 flex items-center gap-4">
        <h2 className="text-[10px] font-bold text-primary uppercase tracking-widest shrink-0 text-left">
            {title}
        </h2>
        <div className="h-px flex-1 bg-border/50" />
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
        <section className="space-y-6">
            <SectionHeader title="Account Security" />
            <div className="card-minimal p-4 sm:p-10 relative overflow-hidden transition-all hover:border-primary/20">
                <div className="flex items-center gap-8 mb-10 pb-10 border-b border-border/50">
                    <div className="relative group/avatar cursor-pointer">
                        <div className="w-24 h-24 rounded-[1.5rem] bg-primary/5 border border-border flex items-center justify-center text-primary text-3xl font-bold overflow-hidden shadow-minimal transform group-hover/avatar:scale-105 transition-all duration-300">
                            {user?.profilePictureUrl ? (
                                <img src={getMediaUrl(user.profilePictureUrl)} alt={user.fullName} className="w-full h-full object-cover" />
                            ) : (
                                user?.fullName?.[0] || "U"
                            )}
                        </div>
                        <button className="absolute -bottom-2 -right-2 w-9 h-9 rounded-xl bg-background border border-border shadow-minimal flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all z-10">
                            <CameraIcon className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="space-y-2 text-left">
                        <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest leading-none">Profile</p>
                        <h3 className="text-xl font-bold text-foreground uppercase tracking-tight">{user?.fullName}</h3>
                        <div className="flex items-center gap-3">
                            <Badge variant="primary" className="text-[9px] px-3 rounded-full h-5 tracking-widest uppercase">
                                {user?.role?.replace("_", " ")}
                            </Badge>
                            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Active</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <SettingsItem icon={UserIcon} title="Full Name" subtitle={profileForm.fullName || "Not set"}>
                        <input
                            type="text"
                            value={profileForm.fullName}
                            onChange={(e) => onProfileChange('fullName', e.target.value)}
                            onBlur={onProfileSave}
                            className="h-11 bg-background border border-border rounded-xl px-5 text-sm font-bold tracking-tight text-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all outline-none w-full sm:w-64 text-left sm:text-right"
                            placeholder="Enter your name"
                        />
                    </SettingsItem>

                    <SettingsItem icon={EnvelopeIcon} title="Email Address" subtitle={profileForm.email || "Not provided"}>
                        <input
                            type="email"
                            value={profileForm.email}
                            onChange={(e) => onProfileChange('email', e.target.value)}
                            onBlur={onProfileSave}
                            className="h-11 bg-background border border-border rounded-xl px-5 text-sm font-bold tracking-tight text-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all outline-none w-full sm:w-64 text-left sm:text-right"
                            placeholder="Enter your email"
                        />
                    </SettingsItem>

                    <div className="py-10 space-y-8 text-left">
                        <div className="flex items-center gap-4">
                            <div className="h-px flex-1 bg-border/50" />
                            <h5 className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                                PIN Security
                            </h5>
                            <div className="h-px flex-1 bg-border/50" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 max-w-4xl mx-auto">
                            <div className="space-y-4">
                                <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Current PIN</label>
                                <OtpInput value={securityForm.currentPin} onChange={(val: string) => onSecurityChange('currentPin', val)} obscureText={true} disabled={isSaving} />
                            </div>
                            <div className="space-y-4">
                                <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">New PIN</label>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                                    <div className="flex-1">
                                        <OtpInput value={securityForm.newPin} onChange={(val: string) => onSecurityChange('newPin', val)} obscureText={true} disabled={isSaving} />
                                    </div>
                                    <button
                                        onClick={onSecuritySave}
                                        disabled={isSaving || !securityForm.currentPin || securityForm.newPin.length < 4}
                                        className="h-12 px-8 bg-primary text-white font-bold text-[10px] uppercase tracking-widest rounded-xl shadow-minimal active:scale-95 transition-all disabled:opacity-50 hover:bg-primary/90 disabled:cursor-not-allowed w-full sm:w-auto"
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
