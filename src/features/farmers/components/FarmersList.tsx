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
        <div className="card-minimal overflow-hidden animate-in fade-in duration-700">
            <div className="px-8 py-5 border-b border-border/50 bg-background-soft/50 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="relative group w-full md:w-80">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground/30 group-focus-within:text-primary transition-colors">
                        <span className="text-xs">🔍</span>
                    </div>
                    <input
                        type="text"
                        placeholder="Search farmers by name, ID, or zone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-10 bg-background border border-border rounded-lg pl-11 pr-4 text-[13px] font-bold placeholder:text-muted-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-minimal"
                    />
                </div>
            </div>

            <div className="hidden md:block overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead>
                        {table.getHeaderGroups().map((headerGroup: any) => (
                            <tr key={headerGroup.id} className="border-b border-border/50 bg-background-soft/50">
                                {headerGroup.headers.map((header: any) => (
                                    <th key={header.id} className="px-8 py-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </th>
                                ))}
                                <th className="px-8 py-4 text-right text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Actions</th>
                            </tr>
                        ))}
                    </thead>
                    <tbody className="divide-y divide-border/30">
                        {rows.map((row: any) => (
                            <tr key={row.id} className="hover:bg-background-soft transition-colors group">
                                {row.getVisibleCells().map((cell: any) => {
                                    const farmer = row.original;
                                    if (cell.column.id === 'name') {
                                        return (
                                            <React.Fragment key={cell.id}>
                                                <td className="px-8 py-5 w-16">
                                                    <div className="w-10 h-10 rounded-lg bg-background-soft border border-border flex items-center justify-center text-primary font-bold text-sm">
                                                        {(farmer.name && farmer.name[0]) || 'F'}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <p className="text-[13px] font-bold text-foreground">{farmer.name}</p>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className="text-[10px] font-bold text-primary tracking-widest uppercase">#{farmer.id.substring(0, 8)}</span>
                                                        <span className="text-[10px] text-muted-foreground/30">•</span>
                                                        <span className="text-[11px] font-bold text-muted-foreground/40">{farmer.phone}</span>
                                                    </div>
                                                </td>
                                            </React.Fragment>
                                        );
                                    }
                                    if (cell.column.id === 'phone') return null;
                                    if (cell.column.id === 'woreda') {
                                        return (
                                            <td key={cell.id} className="px-8 py-5">
                                                <p className="text-[13px] font-bold text-foreground">{farmer.woreda}</p>
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-40 mt-0.5">{farmer.region}</p>
                                            </td>
                                        );
                                    }
                                    if (cell.column.id === 'capacity') {
                                        return (
                                            <td key={cell.id} className="px-8 py-5">
                                                <div className="flex items-center gap-8">
                                                    <div>
                                                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-40 mb-0.5">Land</p>
                                                        <p className="text-[13px] font-bold text-foreground">{farmer.farmSize} <span className="text-[10px] font-bold opacity-40">HA</span></p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-40 mb-0.5">Yield</p>
                                                        <p className="text-[13px] font-bold text-primary">{farmer.capacity} <span className="text-[10px] font-bold opacity-40">QT</span></p>
                                                    </div>
                                                </div>
                                            </td>
                                        );
                                    }
                                    if (cell.column.id === 'status') {
                                        return (
                                            <td key={cell.id} className="px-8 py-5">
                                                <Badge variant={farmer.status === 'active' ? 'success' : farmer.status === 'pending' ? 'warning' : 'error'}>
                                                    {farmer.status || 'offline'}
                                                </Badge>
                                            </td>
                                        );
                                    }
                                    return (
                                        <td key={cell.id} className="px-8 py-5">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    );
                                })}
                                <td className="px-8 py-5 text-right">
                                    <button
                                        onClick={() => setSelectedFarmer(row.original)}
                                        className="h-8 px-4 rounded-lg bg-background-soft border border-border text-foreground text-[10px] font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-all active:scale-95"
                                    >
                                        Detail
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="md:hidden space-y-4 p-4">
                {rows.map((row: any) => {
                    const farmer = row.original;
                    return (
                        <div key={row.id} 
                            onClick={() => setSelectedFarmer(farmer)}
                            className="card-minimal p-5 space-y-5 active:scale-[0.98] transition-all group cursor-pointer"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-background-soft border border-border flex items-center justify-center text-primary font-bold text-lg shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                                    {(farmer.name && farmer.name[0]) || 'F'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[13px] font-bold text-foreground truncate">{farmer.name}</p>
                                    <p className="text-[10px] font-bold text-primary tracking-widest uppercase">#{farmer.id.substring(0, 8)}</p>
                                </div>
                                <Badge variant={farmer.status === 'active' ? 'success' : farmer.status === 'pending' ? 'warning' : 'error'}>
                                    {farmer.status || 'OFFLINE'}
                                </Badge>
                            </div>

                            <div className="bg-background-soft/50 p-5 rounded-xl border border-border/50 grid grid-cols-2 gap-6">
                                <div className="space-y-0.5">
                                    <p className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-widest">Jurisdiction</p>
                                    <p className="text-[11px] font-bold text-foreground truncate uppercase tracking-widest">{farmer.woreda}, {farmer.region}</p>
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-widest">Yield Potential</p>
                                    <p className="text-[11px] font-bold text-primary tabular-nums uppercase tracking-widest">{farmer.capacity} QT</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    <span className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-widest">Verified Producer</span>
                                </div>
                                <div className="flex items-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-all">
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Detail</span>
                                    <div className="w-7 h-7 rounded-full border border-primary/20 flex items-center justify-center text-xs group-hover:bg-primary group-hover:text-white transition-all">→</div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="border-t border-border/50">
                <TablePagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalRecords={filteredCount}
                    pageSize={pageSize}
                    onPageChange={(page) => table.setPageIndex(page - 1)}
                />
            </div>

            {rows.length === 0 && (
                <div className="py-24 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-2xl bg-background-soft border border-border flex items-center justify-center text-3xl mb-6 opacity-40">
                        👨‍🌾
                    </div>
                    <h3 className="text-sm font-bold text-foreground uppercase tracking-widest mb-2">No Farmers Found</h3>
                    <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground/40 max-w-xs leading-relaxed">
                        Producer registry is currently empty or no matches found for your search.
                    </p>
                </div>
            )}
        </div>
    );
};
