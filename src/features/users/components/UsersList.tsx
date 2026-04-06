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
            <div className="py-24 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-background-soft border border-border flex items-center justify-center text-3xl mb-6 opacity-40">
                    👥
                </div>
                <h3 className="text-sm font-bold text-foreground uppercase tracking-widest mb-2">No Personnel Found</h3>
                <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground/40 max-w-xs leading-relaxed">
                    The personnel directory is currently empty for the selected filters.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden">
            {/* Desktop View: Glass Table */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id} className="border-b border-border/50 bg-background-soft/50">
                                <th className="px-8 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Personnel Profile</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Designation</th>
                                <th className="px-8 py-4 text-right text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Actions</th>
                            </tr>
                        ))}
                    </thead>
                    <tbody className="divide-y divide-border/30">
                        {rows.map((row) => {
                            const user = row.original;
                            return (
                                <tr key={row.id} className="hover:bg-background-soft transition-colors group cursor-pointer">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="relative shrink-0">
                                                <div className="w-10 h-10 bg-background-soft border border-border rounded-lg flex items-center justify-center text-primary font-bold text-base overflow-hidden shadow-minimal group-hover:bg-primary group-hover:text-white transition-all">
                                                    {user.profilePictureUrl ? (
                                                        <img src={getMediaUrl(user.profilePictureUrl)} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        user.fullName?.[0] || '⌬'
                                                    )}
                                                </div>
                                                <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${user.status === 'active' ? 'bg-emerald-500' : 'bg-muted-foreground/40'}`} />
                                            </div>
                                            <div className="space-y-0.5">
                                                <p className="text-[13px] font-bold text-foreground group-hover:text-primary transition-colors">{user.fullName}</p>
                                                <p className="text-[10px] font-medium text-muted-foreground/40 uppercase tracking-widest">{user.phone} • {user.email || 'No Email'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <Badge variant={
                                                user.role === 'platform_admin' ? 'success' :
                                                    user.role === 'association_admin' ? 'primary' : 'outline'
                                            }>
                                                {user.role.replace('_', ' ')}
                                            </Badge>
                                            <span className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                                {user.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex justify-end gap-2 opacity-100 transition-all">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); onRoleUpdate(user); }}
                                                className="h-8 w-8 flex items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:bg-background-soft hover:text-primary transition-all"
                                                title="Permissions"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); onDeactivate(user.id); }}
                                                className="h-8 w-8 flex items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:bg-rose-500 hover:text-white transition-all"
                                                title="Deactivate"
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

            <div className="md:hidden space-y-4 p-4">
                {rows.map((row) => {
                    const user = row.original;
                    return (
                        <div key={row.id} className="card-minimal p-5 space-y-5 active:scale-[0.98] transition-all group relative overflow-hidden">
                            <div className="flex items-center gap-4">
                                <div className="relative shrink-0">
                                    <div className="w-12 h-12 bg-background-soft border border-border rounded-lg flex items-center justify-center text-primary font-bold text-lg overflow-hidden shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                                        {user.profilePictureUrl ? (
                                            <img src={getMediaUrl(user.profilePictureUrl)} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            user.fullName?.[0] || '⌬'
                                        )}
                                    </div>
                                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${user.status === 'active' ? 'bg-emerald-500' : 'bg-muted-foreground/40'}`} />
                                </div>
                                <div className="flex-1 min-w-0 space-y-0.5">
                                    <p className="text-sm font-bold text-foreground truncate">{user.fullName}</p>
                                    <div className="flex items-center gap-2">
                                        <Badge variant={
                                            user.role === 'platform_admin' ? 'success' :
                                                user.role === 'association_admin' ? 'primary' : 'outline'
                                        } className="text-[8px] h-4">
                                            {user.role.replace('_', ' ')}
                                        </Badge>
                                        <span className="text-[10px] font-medium text-muted-foreground/30 uppercase tracking-widest truncate">
                                            ID: {user.id.slice(0, 8)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="py-4 border-y border-border/30 space-y-3">
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/30">Contact</p>
                                    <p className="text-[11px] font-bold text-foreground truncate">{user.phone}</p>
                                    <p className="text-[10px] font-medium text-primary/60 truncate italic">{user.email || 'No Email'}</p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/30">Status</p>
                                        <div className="flex items-center gap-1.5">
                                            <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                            <p className="text-xs font-bold text-foreground uppercase tracking-tight">{user.status}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-1">
                                <button
                                    onClick={() => onRoleUpdate(user)}
                                    className="flex-1 h-10 rounded-lg bg-background-soft border border-border text-[10px] font-bold text-primary uppercase tracking-widest hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2"
                                >
                                    Permissions
                                </button>
                                <button
                                    onClick={() => onDeactivate(user.id)}
                                    className="w-10 h-10 flex items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:bg-rose-500 hover:text-white transition-all"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
