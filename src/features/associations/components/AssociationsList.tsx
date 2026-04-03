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
            <div className="py-32 flex flex-col items-center justify-center text-center opacity-40">
                <div className="text-6xl mb-6">🏢</div>
                <h3 className="text-xl font-extrabold text-muted-foreground uppercase tracking-wider mb-2">No Associations Found</h3>
                <p className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground/70 max-w-sm leading-relaxed">
                    There are no regional associations matching your current view.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            {/* Desktop View */}
            <div className="hidden md:block overflow-x-auto relative">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-muted/30 border-b border-border text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">
                        {table.getHeaderGroups().map((headerGroup: any) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header: any) => (
                                    <th key={header.id} className="px-6 py-4">
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </th>
                                ))}
                                <th className="px-6 py-4 text-right">Operations</th>
                            </tr>
                        ))}
                    </thead>
                    <tbody className="divide-y divide-border">
                        {rows.map((row: any) => {
                            const assoc = row.original;
                            return (
                                <tr key={row.id}
                                    onClick={() => navigate({ to: `/associations/${assoc.id}` } as any)}
                                    className="hover:bg-muted/5 transition-colors cursor-pointer"
                                >
                                    {row.getVisibleCells().map((cell: any) => {
                                        if (cell.column.id === 'name') {
                                            return (
                                                <td key={cell.id} className="px-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-lg bg-muted border border-border/40 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                                                            {assoc.name[0]}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-foreground">{assoc.name}</p>
                                                            <div className="flex items-center gap-2 mt-0.5">
                                                                <span className="text-[11px] font-mono text-muted-foreground">ID: {assoc.id.slice(0, 12)}</span>
                                                                <Badge variant="success" className="h-4 px-1.5 rounded-sm text-[9px] font-bold">Verified</Badge>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            );
                                        }
                                        if (cell.column.id === 'region') {
                                            return (
                                                <td key={cell.id} className="px-6 py-4">
                                                    <p className="text-sm font-bold text-foreground">{assoc.region}</p>
                                                    <p className="text-[11px] font-bold text-muted-foreground mt-0.5">{assoc.woreda || 'N/A'}</p>
                                                </td>
                                            );
                                        }
                                        if (cell.column.id === 'membershipCount') {
                                            return (
                                                <td key={cell.id} className="px-6 py-4">
                                                    <p className="text-sm font-extrabold text-foreground">{(assoc.membershipCount || 0).toLocaleString()}</p>
                                                    <p className="text-[11px] font-bold text-muted-foreground mt-0.5">Active Producers</p>
                                                </td>
                                            );
                                        }
                                        if (cell.column.id === 'activeAggregationsCount') {
                                            return (
                                                <td key={cell.id} className="px-6 py-4">
                                                    <p className="text-sm font-extrabold text-foreground">{assoc.activeAggregationsCount || 0}</p>
                                                    <p className="text-[11px] font-bold text-muted-foreground mt-0.5">Batch Cycles</p>
                                                </td>
                                            );
                                        }
                                        return (
                                            <td key={cell.id} className="px-6 py-4">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        );
                                    })}
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-3" onClick={(e) => e.stopPropagation()}>
                                            {userRole === 'platform_admin' && (
                                                <>
                                                    <button
                                                        onClick={() => onEdit(assoc)}
                                                        className="h-8 w-8 flex items-center justify-center rounded-md border border-border/60 text-muted-foreground hover:bg-muted/50 transition-all"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
                                                    </button>
                                                    <button
                                                        onClick={() => onDelete(assoc.id)}
                                                        className="h-8 w-8 flex items-center justify-center rounded-md border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
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

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4 p-4 bg-muted/5">
                {rows.map((row: any) => {
                    const assoc = row.original;
                    return (
                        <div 
                            key={row.id} 
                            onClick={() => navigate({ to: `/associations/${assoc.id}` } as any)}
                            className="card-minimal p-4 card-minimal-hover group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-muted border border-border/40 flex items-center justify-center text-primary font-extrabold italic shrink-0">
                                    {assoc.name[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-extrabold text-foreground uppercase tracking-tight text-sm italic truncate">{assoc.name}</p>
                                    <p className="text-[10px] font-mono text-muted-foreground/40 uppercase truncate italic">ID: {assoc.id.slice(0, 12)}</p>
                                </div>
                                <Badge variant="success" className="h-4 px-1 rounded-sm text-[8px] font-extrabold uppercase tracking-widest italic shrink-0">Verified</Badge>
                            </div>

                            <div className="grid grid-cols-2 gap-y-4 gap-x-2 py-3 border-y border-border/40">
                                <div>
                                    <p className="text-[9px] font-extrabold uppercase tracking-widest text-muted-foreground/40 mb-0.5 italic">Jurisdiction</p>
                                    <p className="text-[10px] font-extrabold text-foreground uppercase italic truncate tracking-tight">{assoc.region}, {assoc.woreda || 'NATIVE_ZONE'}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-extrabold uppercase tracking-widest text-muted-foreground/40 mb-0.5 italic">Network Scale</p>
                                    <p className="text-[10px] font-extrabold text-foreground uppercase italic tracking-tight">{(assoc.membershipCount || 0).toLocaleString()} Producers</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-extrabold uppercase tracking-widest text-muted-foreground/40 mb-0.5 italic">Active Activity</p>
                                    <p className="text-[10px] font-extrabold text-foreground italic uppercase tracking-tight">{assoc.activeAggregationsCount || 0} Batch Cycles</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-extrabold uppercase tracking-widest text-muted-foreground/40 mb-0.5 italic">Status Profile</p>
                                    <p className="text-[10px] font-extrabold text-primary italic uppercase tracking-tight">Operational</p>
                                </div>
                            </div>
                            
                            {userRole === 'platform_admin' && (
                                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                                    <button
                                        onClick={() => onEdit(assoc)}
                                        className="flex-1 h-10 rounded-lg bg-card border border-border/60 text-[10px] font-extrabold uppercase tracking-widest hover:bg-muted transition-all italic flex items-center justify-center gap-2"
                                    >
                                        Edit Profile
                                    </button>
                                    <button
                                        onClick={() => onDelete(assoc.id)}
                                        className="w-10 h-10 flex items-center justify-center rounded-lg border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
