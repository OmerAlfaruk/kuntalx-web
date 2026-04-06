import React from 'react';
import { Badge } from '../../../shared/components/UI';
import type { Association } from '../../admin/types/admin';
import { flexRender, type Table } from '@tanstack/react-table';

interface AssociationsListProps {
    table: Table<Association>;
    isLoading: boolean;
    navigate: any;
    userRole: string | undefined;
    onEdit: (assoc: Association) => void;
    onDelete: (id: string) => void;
}

export const AssociationsList: React.FC<AssociationsListProps> = ({
    table,
    isLoading,
    navigate,
    userRole,
    onEdit,
    onDelete
}) => {
    const rows = table.getRowModel().rows;

    if (rows.length === 0 && !isLoading) {
        return (
            <div className="py-24 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-background-soft border border-border flex items-center justify-center text-3xl mb-6 opacity-40">
                    🏢
                </div>
                <h3 className="text-sm font-bold text-foreground uppercase tracking-widest mb-2">No Associations Found</h3>
                <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground/40 max-w-xs leading-relaxed">
                    No regional records match the current search criteria.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden">
            <div className="hidden md:block overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead>
                        {table.getHeaderGroups().map((headerGroup: any) => (
                            <tr key={headerGroup.id} className="border-b border-border/50 bg-background-soft/50">
                                {headerGroup.headers.map((header: any) => (
                                    <th key={header.id} className="px-10 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </th>
                                ))}
                                <th className="px-10 py-4 text-right text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Actions</th>
                            </tr>
                        ))}
                    </thead>
                    <tbody className="divide-y divide-border/30">
                        {rows.map((row: any) => {
                            const assoc = row.original;
                            return (
                                <tr key={row.id}
                                    onClick={() => navigate({ to: `/associations/${assoc.id}` } as any)}
                                    className="group hover:bg-background-soft transition-colors cursor-pointer"
                                >
                                    {row.getVisibleCells().map((cell: any) => {
                                        if (cell.column.id === 'name') {
                                            return (
                                                <td key={cell.id} className="px-10 py-5">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-lg bg-background-soft border border-border flex items-center justify-center text-primary font-bold text-base shrink-0 group-hover:bg-primary group-hover:text-white transition-all shadow-minimal">
                                                            {assoc.name[0].toUpperCase()}
                                                        </div>
                                                        <div className="space-y-0.5">
                                                            <p className="text-[13px] font-bold text-foreground group-hover:text-primary transition-colors">{assoc.name}</p>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-widest leading-none">ID: {assoc.id.slice(0, 8)}</span>
                                                                <Badge variant="success" className="h-4 px-1.5 rounded text-[8px] leading-none">VERIFIED</Badge>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            );
                                        }
                                        if (cell.column.id === 'region') {
                                            return (
                                                <td key={cell.id} className="px-10 py-5">
                                                    <p className="text-[13px] font-bold text-foreground leading-none">{assoc.region}</p>
                                                    <p className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-widest mt-1 leading-none">{assoc.woreda || 'Central Hub'}</p>
                                                </td>
                                            );
                                        }
                                        if (cell.column.id === 'membershipCount') {
                                            return (
                                                <td key={cell.id} className="px-10 py-5">
                                                    <p className="text-[13px] font-bold text-foreground leading-none">{(assoc.membershipCount || 0).toLocaleString()}</p>
                                                    <p className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-widest mt-1 leading-none">Producers</p>
                                                </td>
                                            );
                                        }
                                        if (cell.column.id === 'activeAggregationsCount') {
                                            return (
                                                <td key={cell.id} className="px-10 py-5">
                                                    <p className="text-[13px] font-bold text-foreground leading-none">{assoc.activeAggregationsCount || 0}</p>
                                                    <p className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-widest mt-1 leading-none">Active Flows</p>
                                                </td>
                                            );
                                        }
                                        return (
                                            <td key={cell.id} className="px-10 py-5 text-[13px] font-bold text-foreground">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        );
                                    })}
                                    <td className="px-10 py-5 text-right">
                                        <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                                            <button className="h-8 px-4 rounded-lg bg-background-soft border border-border text-foreground text-[10px] font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-all active:scale-95">
                                                Registry
                                            </button>
                                            {userRole === 'platform_admin' && (
                                                <>
                                                    <button
                                                        onClick={() => onEdit(assoc)}
                                                        className="h-8 w-8 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-background-soft hover:text-primary transition-all active:scale-95 shadow-minimal"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
                                                    </button>
                                                    <button
                                                        onClick={() => onDelete(assoc.id)}
                                                        className="h-8 w-8 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-rose-500 hover:text-white transition-all active:scale-95 shadow-minimal"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="md:hidden space-y-4 p-4">
                {rows.map((row: any) => {
                    const assoc = row.original;
                    return (
                        <div 
                            key={row.id} 
                            onClick={() => navigate({ to: `/associations/${assoc.id}` } as any)}
                            className="card-minimal p-6 group active:scale-[0.98] transition-all cursor-pointer"
                        >
                            <div className="flex items-center gap-4 mb-5">
                                <div className="w-12 h-12 rounded-lg bg-background-soft border border-border flex items-center justify-center text-primary font-bold text-lg shrink-0 group-hover:bg-primary group-hover:text-white transition-all shadow-minimal">
                                    {assoc.name[0].toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0 space-y-0.5">
                                    <p className="text-[13px] font-bold text-foreground truncate">{assoc.name}</p>
                                    <p className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-widest">ID: {assoc.id.slice(0, 8)}</p>
                                </div>
                                <Badge variant="success" className="shrink-0">VERIFIED</Badge>
                            </div>

                            <div className="grid grid-cols-2 gap-y-6 gap-x-4 py-6 border-y border-border/30">
                                <div className="space-y-1">
                                    <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/30">Region</p>
                                    <p className="text-[11px] font-bold text-foreground tracking-tight truncate leading-none">{assoc.region}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/30">Members</p>
                                    <p className="text-[11px] font-bold text-foreground tracking-tight leading-none">{(assoc.membershipCount || 0).toLocaleString()}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/30">Active Flows</p>
                                    <p className="text-[11px] font-bold text-foreground tracking-tight leading-none">{assoc.activeAggregationsCount || 0}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/30">Status</p>
                                    <p className="text-[11px] font-bold text-emerald-600 tracking-tight leading-none">ACTIVE HUB</p>
                                </div>
                            </div>
                            
                            <div className="mt-5 flex gap-3" onClick={(e) => e.stopPropagation()}>
                                <button
                                    onClick={() => navigate({ to: `/associations/${assoc.id}` } as any)}
                                    className="flex-1 h-10 rounded-lg bg-background-soft border border-border text-[10px] font-bold text-primary uppercase tracking-widest hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2 active:scale-95 shadow-minimal"
                                >
                                    Open Registry
                                    <span>→</span>
                                </button>
                                {userRole === 'platform_admin' && (
                                    <>
                                        <button
                                            onClick={() => onEdit(assoc)}
                                            className="w-10 h-10 flex items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:bg-background-soft hover:text-primary transition-all active:scale-95 shadow-minimal"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
                                        </button>
                                        <button
                                            onClick={() => onDelete(assoc.id)}
                                            className="w-10 h-10 flex items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:bg-rose-500 hover:text-white transition-all active:scale-95 shadow-minimal"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
