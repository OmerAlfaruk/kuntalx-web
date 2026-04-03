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
            <div className="py-32 flex flex-col items-center justify-center text-center opacity-40">
                <div className="text-6xl mb-6">🌾</div>
                <h3 className="text-xl font-extrabold text-muted-foreground uppercase tracking-wider mb-2">No Commodities Found</h3>
                <p className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground/70 max-w-sm leading-relaxed">
                    The commodity catalog is currently empty for the selected query.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-card border border-border shadow-sm rounded-xl overflow-hidden">
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-muted/30 border-b border-border text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                <th className="px-6 py-4">Commodity</th>
                                <th className="px-6 py-4">Trade Unit</th>
                                <th className="px-6 py-4">Specifications</th>
                                {isPlatformAdmin && <th className="px-6 py-4 text-right">Operations</th>}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="text-xs divide-y divide-border/40">
                        {rows.map((row) => {
                            const crop = row.original;
                            return (
                                <tr key={row.id} className="hover:bg-muted/5 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-muted border border-border/40 flex items-center justify-center text-xl shadow-sm shrink-0">
                                                🌾
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-foreground">{crop.name}</p>
                                                <p className="text-[11px] font-mono text-muted-foreground mt-0.5">UID: {crop.id.toUpperCase().slice(0, 12)}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-secondary/10 text-secondary">
                                            {crop.unit} (QT)
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 max-w-xs">
                                        <p className="text-sm font-bold text-muted-foreground line-clamp-2">
                                            {crop.description || 'No detailed specifications provided for this commodity.'}
                                        </p>
                                    </td>
                                    {isPlatformAdmin && (
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => onEdit(crop)}
                                                    className="h-8 px-4 rounded-lg bg-muted border border-border/60 text-foreground hover:bg-muted/80 transition-all text-[11px] font-bold whitespace-nowrap"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => onDelete(crop.id)}
                                                    className="h-8 px-4 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition-all text-[11px] font-bold whitespace-nowrap"
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

            <div className="md:hidden space-y-4 p-4 bg-muted/5">
                {rows.map((row) => {
                    const crop = row.original;
                    return (
                        <div key={row.id} className="bg-card border border-border/60 rounded-xl p-4 shadow-sm space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-muted border border-border/40 flex items-center justify-center text-xl shrink-0">
                                    🌾
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-foreground text-sm truncate">{crop.name}</p>
                                    <p className="text-[11px] font-mono text-muted-foreground mt-0.5 truncate">UID: {crop.id.toUpperCase().slice(0, 12)}</p>
                                </div>
                                <div className="inline-flex px-2.5 py-0.5 rounded-full bg-secondary/10 text-secondary text-[11px] font-bold shrink-0">
                                    {crop.unit}
                                </div>
                            </div>

                            <div>
                                <p className="text-[11px] font-bold text-muted-foreground mb-1">Specifications Registry</p>
                                <p className="text-sm font-bold text-foreground">
                                    {crop.description || 'Logistical specifications pending for this commodity vector.'}
                                </p>
                            </div>

                            {isPlatformAdmin && (
                                <div className="flex gap-2 pt-2 border-t border-border/40">
                                    <button
                                        onClick={() => onEdit(crop)}
                                        className="h-10 px-4 flex-1 rounded-xl bg-muted border border-border/60 text-foreground hover:bg-muted/80 transition-all text-xs font-bold flex items-center justify-center"
                                    >
                                        Edit Specs
                                    </button>
                                    <button
                                        onClick={() => onDelete(crop.id)}
                                        className="h-10 px-4 flex-1 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 transition-all text-xs font-bold flex items-center justify-center"
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
