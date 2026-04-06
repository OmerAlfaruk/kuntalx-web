import React from 'react';
import type { CropType } from '../types/admin';
import { type Table } from '@tanstack/react-table';

interface CropTypesListProps {
    table: Table<CropType>;
    isLoading: boolean;
    isPlatformAdmin: boolean;
    onEdit: (crop: CropType) => void;
    onDelete: (id: string) => void;
}

export const CropTypesList: React.FC<CropTypesListProps> = ({
    table,
    isLoading,
    isPlatformAdmin,
    onEdit,
    onDelete
}) => {
    const rows = table.getRowModel().rows;

    if (rows.length === 0 && !isLoading) {
        return (
            <div className="py-24 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-background-soft border border-border flex items-center justify-center text-3xl mb-6 opacity-40">
                    🌾
                </div>
                <h3 className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-[0.2em] mb-2">No Commodities Found</h3>
                <p className="text-[10px] font-bold text-muted-foreground/20 uppercase tracking-widest max-w-sm leading-relaxed">
                    The commodity registry is currently empty or returned no results for the specified query.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden">
            {/* Desktop View */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-border/50 bg-background-soft/50">
                            <th className="px-10 py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Commodity</th>
                            <th className="px-10 py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Trade Unit</th>
                            <th className="px-10 py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Description</th>
                            {isPlatformAdmin && <th className="px-10 py-5 text-right text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                        {rows.map((row) => {
                            const crop = row.original;
                            return (
                                <tr key={row.id} className="hover:bg-background-soft/50 transition-all duration-300 group">
                                    <td className="px-10 py-7">
                                        <div className="flex items-center gap-5">
                                            <div className="w-11 h-11 rounded-xl bg-primary/5 border border-border flex items-center justify-center text-xl group-hover:bg-primary/10 transition-all shadow-minimal shrink-0">
                                                🌾
                                            </div>
                                            <div className="space-y-1.5">
                                                <p className="text-[13px] font-bold text-foreground uppercase tracking-tight group-hover:text-primary transition-colors">{crop.name}</p>
                                                <p className="text-[9px] font-mono font-bold text-muted-foreground/20 uppercase tracking-[0.2em]">ID: {crop.id.toUpperCase().slice(0, 12)}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-7">
                                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/5 border border-primary/20 text-[10px] font-bold text-primary uppercase tracking-widest">
                                            {crop.unit}
                                        </div>
                                    </td>
                                    <td className="px-10 py-7 max-w-md">
                                        <p className="text-[13px] font-medium text-foreground/60 leading-relaxed line-clamp-2">
                                            {crop.description || 'No description available for this commodity type.'}
                                        </p>
                                    </td>
                                    {isPlatformAdmin && (
                                        <td className="px-10 py-7 text-right">
                                            <div className="flex justify-end gap-3 opacity-100 transition-all">
                                                <button
                                                    onClick={() => onEdit(crop)}
                                                    className="h-9 px-5 rounded-xl bg-background-soft border border-border text-primary hover:bg-primary hover:text-white hover:border-primary transition-all text-[9px] font-bold uppercase tracking-widest active:scale-95"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => onDelete(crop.id)}
                                                    className="h-9 px-5 rounded-xl bg-rose-500/5 border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all text-[9px] font-bold uppercase tracking-widest active:scale-95"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4 p-6">
                {rows.map((row) => {
                    const crop = row.original;
                    return (
                        <div key={row.id} className="card-minimal p-7 space-y-6 group">
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 rounded-xl bg-primary/5 border border-border flex items-center justify-center text-2xl shrink-0 group-hover:bg-primary/10 transition-all">
                                    🌾
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[13px] font-bold text-foreground uppercase tracking-tight truncate group-hover:text-primary transition-colors">{crop.name}</p>
                                    <p className="text-[9px] font-mono font-bold text-muted-foreground/20 mt-1 truncate uppercase tracking-[0.2em]">UID: {crop.id.toUpperCase().slice(0, 14)}</p>
                                </div>
                                <div className="inline-flex px-3 py-1 rounded-full bg-primary/5 border border-primary/20 text-primary text-[9px] font-bold uppercase tracking-widest shrink-0">
                                    {crop.unit}
                                </div>
                            </div>

                            {crop.description && (
                                <p className="text-[13px] font-medium text-foreground/50 leading-relaxed">
                                    {crop.description}
                                </p>
                            )}

                            {isPlatformAdmin && (
                                <div className="flex gap-3 pt-4 border-t border-border/40">
                                    <button
                                        onClick={() => onEdit(crop)}
                                        className="h-11 px-6 flex-1 rounded-xl bg-background-soft border border-border text-primary hover:bg-primary hover:text-white hover:border-primary transition-all text-[9px] font-bold uppercase tracking-widest flex items-center justify-center active:scale-95"
                                    >
                                        Edit Specs
                                    </button>
                                    <button
                                        onClick={() => onDelete(crop.id)}
                                        className="h-11 px-6 flex-1 rounded-xl bg-rose-500/5 border border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white transition-all text-[9px] font-bold uppercase tracking-widest flex items-center justify-center active:scale-95"
                                    >
                                        Remove
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
