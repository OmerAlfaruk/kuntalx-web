import React from 'react';
import { Badge } from '../../../shared/components/UI';
import { getMediaUrl } from '../../../lib/api-client';
import type { User } from '../../admin/types/admin';
import { type Table } from '@tanstack/react-table';

interface UsersListProps {
    table: Table<User>;
    isLoading: boolean;
    onRoleUpdate: (user: User) => void;
    onDeactivate: (userId: string) => void;
}

export const UsersList: React.FC<UsersListProps> = ({
    table,
    isLoading,
    onRoleUpdate,
    onDeactivate
}) => {
    const rows = table.getRowModel().rows;

    if (rows.length === 0 && !isLoading) {
        return (
            <div className="py-32 flex flex-col items-center justify-center text-center opacity-40">
                <div className="text-6xl mb-6">👥</div>
                <h3 className="text-xl font-extrabold text-muted-foreground uppercase tracking-wider mb-2">No Personnel Found</h3>
                <p className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground/70 max-w-sm leading-relaxed">
                    The personnel directory is currently empty for the selected filters.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            {/* Desktop View */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-muted/30 border-b border-border text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                <th className="px-6 py-4">Personnel Profile</th>
                                <th className="px-6 py-4">Designation</th>
                                <th className="px-6 py-4">Contact Details</th>
                                <th className="px-6 py-4">Account Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        ))}
                    </thead>
                    <tbody className="divide-y divide-border">
                        {rows.map((row) => {
                            const user = row.original;
                            return (
                                <tr key={row.id} className="hover:bg-muted/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="relative shrink-0">
                                                <div className="w-10 h-10 bg-muted border border-border/40 rounded-lg flex items-center justify-center text-primary font-bold text-sm overflow-hidden">
                                                    {user.profilePictureUrl ? (
                                                        <img src={getMediaUrl(user.profilePictureUrl)} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        user.fullName?.[0] || '?'
                                                    )}
                                                </div>
                                                <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card ${user.status === 'active' ? 'bg-emerald-500' : 'bg-muted-foreground'}`} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-foreground">{user.fullName}</p>
                                                <p className="text-[11px] font-mono text-muted-foreground">ID: {user.id.slice(0, 12)}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge variant={
                                            user.role === 'platform_admin' ? 'primary' :
                                                user.role === 'association_admin' ? 'warning' :
                                                    user.role === 'buyer' ? 'secondary' : 'outline'
                                        }>
                                            {user.role.replace('_', ' ')}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-bold text-foreground">{user.phone}</p>
                                        <p className="text-[11px] font-bold text-muted-foreground mt-0.5">{user.email || '—'}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${user.status === 'active' ? 'bg-emerald-500' :
                                                user.status === 'suspended' ? 'bg-rose-500' : 'bg-slate-400'
                                                }`} />
                                            <span className="text-sm font-bold text-muted-foreground capitalize">{user.status}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-3">
                                            <button
                                                onClick={() => onRoleUpdate(user)}
                                                className="h-8 w-8 flex items-center justify-center rounded-md border border-border/60 text-muted-foreground hover:bg-muted/50 transition-all"
                                                title="Permissions"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
                                            </button>
                                            <button
                                                onClick={() => onDeactivate(user.id)}
                                                className="h-8 w-8 flex items-center justify-center rounded-md border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                                                title="Suspend"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4 p-4 bg-muted/5">
                {rows.map((row) => {
                    const user = row.original;
                    return (
                        <div key={row.id} className="bg-card border border-border/60 rounded-xl p-4 shadow-sm space-y-4 active:scale-[0.98] transition-all">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="w-10 h-10 bg-muted border border-border/40 rounded-lg flex items-center justify-center text-primary font-extrabold italic shrink-0 overflow-hidden">
                                        {user.profilePictureUrl ? (
                                            <img src={getMediaUrl(user.profilePictureUrl)} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            user.fullName?.[0] || '?'
                                        )}
                                    </div>
                                    <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card ${user.status === 'active' ? 'bg-emerald-500' : 'bg-muted-foreground'}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-extrabold text-foreground uppercase tracking-tight text-sm italic truncate">{user.fullName}</p>
                                    <p className="text-[10px] font-mono text-muted-foreground/40 uppercase truncate italic">REF ID: {user.id.slice(0, 12)}</p>
                                </div>
                                <Badge variant={
                                    user.role === 'platform_admin' ? 'primary' :
                                        user.role === 'association_admin' ? 'warning' :
                                            user.role === 'buyer' ? 'secondary' : 'outline'
                                } className="px-2 h-6 rounded-full font-extrabold uppercase text-[9px] tracking-wider italic shrink-0">
                                    {user.role.replace('_', ' ')}
                                </Badge>
                            </div>

                            <div className="grid grid-cols-2 gap-4 py-3 border-y border-border/40">
                                <div>
                                    <p className="text-[9px] font-extrabold uppercase tracking-widest text-muted-foreground/40 mb-1 italic">Contact Registry</p>
                                    <p className="text-[10px] font-extrabold text-foreground uppercase italic tracking-tight">{user.phone}</p>
                                    <p className="text-[9px] font-extrabold text-muted-foreground uppercase italic tracking-tight truncate opacity-60">{user.email || 'NO_EMAIL'}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-extrabold uppercase tracking-widest text-muted-foreground/40 mb-1 italic">Account Status</p>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                        <p className="text-[10px] font-extrabold text-foreground uppercase italic tracking-tight">{user.status}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => onRoleUpdate(user)}
                                    className="flex-1 h-10 rounded-lg bg-card border border-border/60 text-[10px] font-extrabold uppercase tracking-widest hover:bg-muted transition-all italic flex items-center justify-center gap-2"
                                >
                                    Permissions
                                </button>
                                <button
                                    onClick={() => onDeactivate(user.id)}
                                    className="w-10 h-10 flex items-center justify-center rounded-lg border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
