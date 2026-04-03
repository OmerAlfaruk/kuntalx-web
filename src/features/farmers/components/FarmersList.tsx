import React from 'react';
import { Badge, TablePagination } from '../../../shared/components/UI';
import { SkeletonList } from '../../../shared/components/Skeletons';
import { flexRender, type Table } from '@tanstack/react-table';

interface FarmersListProps {
    table: Table<any>;
    isLoading: boolean;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    currentPage: number;
    totalPages: number;
    pageSize: number;
    setSelectedFarmer: (farmer: any) => void;
    filteredCount: number;
}

export const FarmersList: React.FC<FarmersListProps> = ({
    table,
    isLoading,
    searchTerm,
    setSearchTerm,
    currentPage,
    totalPages,
    pageSize,
    setSelectedFarmer,
    filteredCount,
}) => {
    if (isLoading) {
        return <SkeletonList rows={pageSize} />;
    }

    const rows = table.getRowModel().rows;

    return (
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden animate-fade-in">
            <div className="px-6 py-4 border-b border-border bg-muted/10 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="relative group w-full md:w-[320px]">
                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-primary/40 group-focus-within:text-primary transition-colors text-xs">🔍</span>
                    <input
                        type="text"
                        placeholder="SEARCH REGISTRY..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-10 bg-background border border-border/60 rounded-md pl-12 pr-4 text-[10px] font-extrabold tracking-widest focus:border-primary/40 focus:ring-4 focus:ring-primary/5 outline-none transition-all placeholder:text-muted-foreground/30 uppercase italic"
                    />
                </div>
            </div>

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
                            </tr>
                        ))}
                    </thead>
                    <tbody className="divide-y divide-border">
                        {rows.map((row: any) => (
                            <tr key={row.id} className="hover:bg-muted/5 transition-colors">
                                {row.getVisibleCells().map((cell: any) => {
                                    const farmer = row.original;
                                    if (cell.column.id === 'name') {
                                        return (
                                            <React.Fragment key={cell.id}>
                                                <td className="px-6 py-4 w-16">
                                                    <div className="w-10 h-10 rounded-lg bg-muted border border-border/40 flex items-center justify-center text-primary font-bold text-sm">
                                                        {(farmer.name && farmer.name[0]) || 'F'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-sm font-bold text-foreground">{farmer.name}</p>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className="text-[11px] font-mono text-primary">ID: {farmer.id.substring(0, 10)}</span>
                                                        <span className="text-[10px] text-muted-foreground/40">•</span>
                                                        <span className="text-[11px] font-bold text-muted-foreground">{farmer.phone}</span>
                                                    </div>
                                                </td>
                                            </React.Fragment>
                                        );
                                    }
                                    if (cell.column.id === 'phone') return null;
                                    if (cell.column.id === 'woreda') {
                                        return (
                                            <td key={cell.id} className="px-6 py-4">
                                                <p className="text-sm font-bold text-foreground">{farmer.woreda}</p>
                                                <p className="text-[11px] font-bold text-muted-foreground mt-0.5">{farmer.region}</p>
                                            </td>
                                        );
                                    }
                                    if (cell.column.id === 'capacity') {
                                        return (
                                            <td key={cell.id} className="px-6 py-4">
                                                <div className="flex items-center gap-8">
                                                    <div>
                                                        <p className="text-[10px] font-bold text-muted-foreground/50 mb-0.5">Land</p>
                                                        <p className="text-sm font-extrabold text-foreground">{farmer.farmSize} <span className="text-[10px] font-bold opacity-50">ha</span></p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-bold text-muted-foreground/50 mb-0.5">Capacity</p>
                                                        <p className="text-sm font-extrabold text-primary">{farmer.capacity} <span className="text-[10px] font-bold opacity-50">qt</span></p>
                                                    </div>
                                                </div>
                                            </td>
                                        );
                                    }
                                    if (cell.column.id === 'status') {
                                        return (
                                            <td key={cell.id} className="px-6 py-4">
                                                <Badge variant={farmer.status === 'active' ? 'success' : farmer.status === 'pending' ? 'warning' : 'error'}>
                                                    {farmer.status || 'offline'}
                                                </Badge>
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
                                    <button
                                        onClick={() => setSelectedFarmer(row.original)}
                                        className="h-9 px-4 rounded-lg bg-card border border-border/60 text-foreground text-xs font-bold hover:bg-primary hover:text-white hover:border-transparent transition-all"
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4 p-4 bg-muted/5">
                {rows.map((row: any) => {
                    const farmer = row.original;
                    return (
                        <div key={row.id} className="bg-card border border-border/60 rounded-xl p-4 shadow-sm space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-muted border border-border/40 flex items-center justify-center text-primary font-extrabold italic shrink-0">
                                    {(farmer.name && farmer.name[0]) || 'F'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-extrabold text-foreground uppercase tracking-tight italic truncate">{farmer.name}</p>
                                    <p className="text-[10px] font-mono text-primary/40 uppercase truncate">ID: {farmer.id.substring(0, 10)}</p>
                                </div>
                                <Badge variant={farmer.status === 'active' ? 'success' : farmer.status === 'pending' ? 'warning' : 'error'} className="h-6 px-3 text-[10px] font-extrabold uppercase tracking-widest rounded-full italic shrink-0">
                                    {farmer.status || 'OFFLINE'}
                                </Badge>
                            </div>

                            <div className="grid grid-cols-2 gap-y-4 gap-x-2 py-3 border-y border-border/40">
                                <div>
                                    <p className="text-[9px] font-extrabold uppercase tracking-widest text-muted-foreground/40 mb-0.5 italic">Jurisdiction</p>
                                    <p className="text-[10px] font-extrabold text-foreground uppercase italic truncate tracking-tight">{farmer.woreda}, {farmer.region}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-extrabold uppercase tracking-widest text-muted-foreground/40 mb-0.5 italic">Secure Comms</p>
                                    <p className="text-[10px] font-extrabold text-foreground uppercase italic tracking-tight">{farmer.phone}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-extrabold uppercase tracking-widest text-muted-foreground/40 mb-0.5 italic">Land Metric</p>
                                    <p className="text-[10px] font-extrabold text-foreground italic uppercase tracking-tight">{farmer.farmSize} HA</p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-extrabold uppercase tracking-widest text-muted-foreground/40 mb-0.5 italic">Yield Potential</p>
                                    <p className="text-[10px] font-extrabold text-primary italic uppercase tracking-tight">{farmer.capacity} QT</p>
                                </div>
                            </div>

                            <button
                                onClick={() => setSelectedFarmer(farmer)}
                                className="w-full h-12 rounded-xl bg-primary text-white text-[10px] font-extrabold uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-all italic flex items-center justify-center gap-2"
                            >
                                Inspect Node <span className="text-lg">→</span>
                            </button>
                        </div>
                    );
                })}
            </div>

            <TablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalRecords={filteredCount}
                pageSize={pageSize}
                onPageChange={(page) => table.setPageIndex(page - 1)}
            />

            {rows.length === 0 && (
                <div className="py-24 flex flex-col items-center justify-center text-center opacity-30">
                    <span className="text-5xl mb-6 grayscale">👨‍🌾</span>
                    <h3 className="text-xs font-black text-foreground uppercase tracking-[0.2em] mb-2 italic">Zero Matches Found</h3>
                    <p className="text-[10px] font-bold text-muted-foreground max-w-xs uppercase tracking-wider">The current search parameters yield no results in the producer registry.</p>
                </div>
            )}
        </div>
    );
};
