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

    return (
        <div className="bg-card border border-border shadow-sm rounded-lg overflow-hidden">
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-muted/30 border-b border-border text-xs font-extrabold text-muted-foreground uppercase tracking-wider italic">
                        <tr>
                            <th className="px-6 py-4">Association</th>
                            <th className="px-6 py-4">Initiator</th>
                            <th className="px-6 py-4">Region / Location</th>
                            <th className="px-6 py-4 text-center">Status</th>
                            <th className="px-6 py-4 text-right">Operations</th>
                        </tr>
                    </thead>
                    <tbody className="text-xs divide-y divide-border/40">
                        {paginated.map((req) => (
                            <tr key={req.id} className="hover:bg-muted/5 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-muted border border-border/40 flex items-center justify-center text-primary font-extrabold shadow-sm group-hover:bg-primary group-hover:text-white transition-all italic text-xs">
                                            {req.name[0]}
                                        </div>
                                        <div>
                                            <p className="font-extrabold text-foreground uppercase tracking-tight text-sm italic">{req.name}</p>
                                            <p className="text-[10px] font-extrabold text-muted-foreground/40 mt-0.5 uppercase tracking-wider italic">REQ_ID: {req.id.substring(0, 12).toUpperCase()}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="font-extrabold text-foreground uppercase tracking-tight italic">{req.farmerName}</p>
                                    <p className="text-[10px] font-extrabold text-muted-foreground/50 uppercase tracking-wider mt-0.5 italic">{new Date(req.createdAt).toLocaleDateString()}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="font-extrabold text-foreground uppercase tracking-tight italic">{req.region}</p>
                                    <p className="text-[10px] font-extrabold text-muted-foreground/50 uppercase tracking-wider mt-0.5 italic">{req.zone} / {req.woreda}</p>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <Badge variant={req.status === 'approved' ? 'success' : req.status === 'rejected' ? 'error' : 'warning'} className="text-[10px] font-extrabold uppercase tracking-wider italic">
                                        {req.status === 'approved' ? 'SYNCED' : req.status === 'rejected' ? 'REJECTED' : 'PENDING'}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-3">
                                        {req.status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => onVerify(req)}
                                                    className="h-9 px-4 sm:h-10 sm:px-6 bg-primary text-white text-[10px] font-extrabold uppercase tracking-wider rounded-xl shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all italic flex items-center gap-2"
                                                >
                                                    <span>⛓️</span> Verify
                                                </button>
                                                <button
                                                    onClick={() => onReject(req.id)}
                                                    className="h-9 px-4 border border-rose-500/30 text-rose-500 text-[10px] font-extrabold uppercase tracking-wider rounded-xl hover:bg-rose-500 hover:text-white transition-all italic"
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

            <div className="md:hidden space-y-4 p-4 bg-muted/5">
                {paginated.map((req) => (
                    <div key={req.id} className="bg-card border border-border/60 rounded-xl p-4 shadow-sm space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-muted border border-border/40 flex items-center justify-center text-primary font-extrabold italic text-sm shrink-0">
                                {req.name[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-extrabold text-foreground uppercase tracking-tight text-sm italic truncate">{req.name}</p>
                                <p className="text-[10px] font-extrabold text-muted-foreground/40 mt-0.5 uppercase tracking-wider italic truncate">REQ_ID: {req.id.substring(0, 12).toUpperCase()}</p>
                            </div>
                            <Badge variant={req.status === 'approved' ? 'success' : req.status === 'rejected' ? 'error' : 'warning'} className="text-[9px] font-extrabold uppercase tracking-wider italic shrink-0">
                                {req.status.replace('_', ' ')}
                            </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4 py-3 border-y border-border/40">
                            <div>
                                <p className="text-[9px] font-extrabold uppercase tracking-widest text-muted-foreground/40 mb-1 italic">Initiator Info</p>
                                <p className="text-[10px] font-extrabold text-foreground uppercase italic tracking-tight">{req.farmerName}</p>
                                <p className="text-[9px] text-muted-foreground font-extrabold uppercase italic opacity-60">{new Date(req.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p className="text-[9px] font-extrabold uppercase tracking-widest text-muted-foreground/40 mb-1 italic">Location Profile</p>
                                <p className="text-[10px] font-extrabold text-foreground uppercase italic tracking-tight truncate">{req.region}</p>
                                <p className="text-[9px] text-muted-foreground font-extrabold uppercase italic opacity-60 truncate">{req.zone} / {req.woreda}</p>
                            </div>
                        </div>

                        {req.status === 'pending' && (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => onVerify(req)}
                                    className="flex-[2] h-10 bg-primary text-white text-[10px] font-extrabold uppercase tracking-wider rounded-lg shadow-lg shadow-primary/20 italic flex items-center justify-center gap-2"
                                >
                                    Verify Node
                                </button>
                                <button
                                    onClick={() => onReject(req.id)}
                                    className="flex-1 h-10 border border-rose-500/30 text-rose-500 text-[10px] font-extrabold uppercase tracking-wider rounded-lg italic"
                                >
                                    Reject
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {requests.length === 0 && (
                <div className="py-32 text-center opacity-20">
                    <div className="w-16 h-16 bg-muted rounded-full mx-auto flex items-center justify-center text-2xl mb-6">📩</div>
                    <p className="text-xs font-extrabold text-muted-foreground uppercase tracking-wider italic">No active vectors found in queue.</p>
                </div>
            )}
            <TablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalRecords={requests.length}
                pageSize={pageSize}
                onPageChange={onPageChange}
            />
        </div>
    );
});
