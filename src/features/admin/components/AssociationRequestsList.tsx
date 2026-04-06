import React, { memo } from 'react';
import { Badge, TablePagination } from "../../../shared/components/UI";
import type { AssociationCreationRequest } from '../types/admin';

interface AssociationRequestsListProps {
    requests: AssociationCreationRequest[];
    currentPage: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onVerify: (request: AssociationCreationRequest) => void;
    onReject: (id: string) => void;
}

export const AssociationRequestsList: React.FC<AssociationRequestsListProps> = memo(({
    requests,
    currentPage,
    pageSize,
    onPageChange,
    onVerify,
    onReject
}) => {
    const totalPages = Math.ceil(requests.length / pageSize);
    const paginated = requests.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    if (requests.length === 0) {
        return (
            <div className="py-24 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-background-soft border border-border flex items-center justify-center text-3xl mb-6 opacity-40">
                    📩
                </div>
                <h3 className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-[0.2em] mb-2">No Pending Requests</h3>
                <p className="text-[10px] font-bold text-muted-foreground/20 uppercase tracking-widest max-w-sm leading-relaxed">
                    The authorization queue is currently empty. No active node initialization requests found.
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
                            <th className="px-10 py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Association</th>
                            <th className="px-10 py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Applicant</th>
                            <th className="px-10 py-5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Location</th>
                            <th className="px-10 py-5 text-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Status</th>
                            <th className="px-10 py-5 text-right text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                        {paginated.map((req) => (
                            <tr key={req.id} className="hover:bg-background-soft/50 transition-all duration-300 group">
                                <td className="px-10 py-7">
                                    <div className="flex items-center gap-5">
                                        <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold shadow-inner group-hover:bg-primary group-hover:text-white transition-all shrink-0">
                                            {req.name[0]}
                                        </div>
                                        <div className="space-y-1.5">
                                            <p className="text-[13px] font-bold text-foreground uppercase tracking-tight group-hover:text-primary transition-colors">{req.name}</p>
                                            <p className="text-[9px] font-mono font-bold text-muted-foreground/20 uppercase tracking-[0.2em]">REQ: {req.id.substring(0, 12).toUpperCase()}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-10 py-7">
                                    <div className="space-y-1.5">
                                        <p className="text-[13px] font-bold text-foreground uppercase tracking-tight">{req.farmerName}</p>
                                        <p className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-widest">{new Date(req.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </td>
                                <td className="px-10 py-7">
                                    <div className="space-y-1.5">
                                        <p className="text-[13px] font-bold text-foreground uppercase tracking-tight">{req.region}</p>
                                        <p className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-widest">{req.zone} · {req.woreda}</p>
                                    </div>
                                </td>
                                <td className="px-10 py-7 text-center">
                                    <Badge
                                        variant={req.status === 'approved' ? 'success' : req.status === 'rejected' ? 'error' : 'warning'}
                                        className="px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest"
                                    >
                                        {req.status === 'approved' ? 'Approved' : req.status === 'rejected' ? 'Rejected' : 'Pending'}
                                    </Badge>
                                </td>
                                <td className="px-10 py-7 text-right">
                                    <div className="flex justify-end gap-3">
                                        {req.status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => onVerify(req)}
                                                    className="h-10 px-6 bg-primary text-white text-[9px] font-bold uppercase tracking-widest rounded-xl shadow-minimal hover:bg-primary/90 active:scale-95 transition-all"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => onReject(req.id)}
                                                    className="h-10 px-5 bg-background-soft border border-rose-500/20 text-rose-500 text-[9px] font-bold uppercase tracking-widest rounded-xl hover:bg-rose-500/5 active:scale-95 transition-all"
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4 p-6">
                {paginated.map((req) => (
                    <div key={req.id} className="card-minimal p-7 space-y-6 group">
                        <div className="flex items-center gap-5">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold shadow-inner text-lg shrink-0">
                                {req.name[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[13px] font-bold text-foreground uppercase tracking-tight truncate">{req.name}</p>
                                <p className="text-[9px] font-mono font-bold text-muted-foreground/20 mt-1 uppercase tracking-[0.2em] truncate">ID: {req.id.toUpperCase().slice(0, 12)}</p>
                            </div>
                            <Badge variant={req.status === 'approved' ? 'success' : req.status === 'rejected' ? 'error' : 'warning'} className="px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest shrink-0">
                                {req.status === 'approved' ? 'Approved' : req.status === 'rejected' ? 'Rejected' : 'Pending'}
                            </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-6 py-5 border-y border-border/40 bg-background-soft/30 -mx-7 px-7">
                            <div className="space-y-1.5">
                                <p className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-[0.2em]">Applicant</p>
                                <p className="text-[11px] font-bold text-foreground uppercase tracking-tight">{req.farmerName}</p>
                                <p className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-widest">{new Date(req.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="space-y-1.5">
                                <p className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-[0.2em]">Location</p>
                                <p className="text-[11px] font-bold text-foreground uppercase tracking-tight truncate">{req.region}</p>
                                <p className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-widest truncate">{req.zone} · {req.woreda}</p>
                            </div>
                        </div>

                        {req.status === 'pending' && (
                            <div className="flex gap-3">
                                <button
                                    onClick={() => onVerify(req)}
                                    className="flex-[2] h-11 bg-primary text-white text-[9px] font-bold uppercase tracking-widest rounded-xl shadow-minimal hover:bg-primary/90 active:scale-95 transition-all flex items-center justify-center gap-2"
                                >
                                    ✓ Approve
                                </button>
                                <button
                                    onClick={() => onReject(req.id)}
                                    className="flex-1 h-11 bg-background-soft border border-rose-500/20 text-rose-500 text-[9px] font-bold uppercase tracking-widest rounded-xl hover:bg-rose-500/5 active:scale-95 transition-all"
                                >
                                    Reject
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="border-t border-border/50">
                <TablePagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalRecords={requests.length}
                    pageSize={pageSize}
                    onPageChange={onPageChange}
                />
            </div>
        </div>
    );
});
