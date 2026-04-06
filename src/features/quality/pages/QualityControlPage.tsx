import { useState, useCallback, useMemo } from 'react';
import { PageHeader, StatCard, TablePagination } from '../../../shared/components/UI';
import { SkeletonList, SkeletonCardsList } from '../../../shared/components/Skeletons';
import { useQualityInspections, useCreateQualityInspection, type QualityInspection } from '../hooks/use-quality-data';
import { useDebounce } from '../../../shared/hooks/use-debounce';
import { useAggregations } from '../../aggregations';
import { QualityList } from '../components/QualityList';

export const QualityControlPage = () => {
    const [selectedCheck, setSelectedCheck] = useState<QualityInspection | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const { data: inspections = [], isLoading } = useQualityInspections(debouncedSearchTerm);
    const { data: aggregations } = useAggregations();
    const createMutation = useCreateQualityInspection();

    const [formData, setFormData] = useState({
        aggregationId: '',
        moistureContent: 0,
        purityPercentage: 0,
        foreignMatterPercentage: 0,
        grade: 'A',
        inspectorNotes: ''
    });

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createMutation.mutateAsync(formData);
            setIsCreateModalOpen(false);
            setFormData({
                aggregationId: '',
                moistureContent: 0,
                purityPercentage: 0,
                foreignMatterPercentage: 0,
                grade: 'A',
                inspectorNotes: ''
            });
        } catch (error) {
            console.error('Failed to create inspection:', error);
        }
    }, [createMutation, formData]);

    const showFullLoader = isLoading && (inspections?.length || 0) === 0;
    const totalPages = useMemo(() => Math.ceil((inspections?.length || 0) / pageSize), [inspections, pageSize]);
    const paginatedInspections = useMemo(() => {
        return inspections?.slice((currentPage - 1) * pageSize, currentPage * pageSize) || [];
    }, [inspections, currentPage, pageSize]);

    const onViewReport = useCallback((check: QualityInspection) => {
        setSelectedCheck(check);
    }, []);

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-16">
            <PageHeader
                title="Quality Control"
                description="Real-time monitoring and verification of commodity quality standards across the distribution network."
                actions={
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="w-full md:w-auto h-12 px-8 rounded-2xl bg-primary text-white text-[10px] font-bold uppercase tracking-widest shadow-minimal hover:bg-primary/90 active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                        <span>🧪</span> New Inspection
                    </button>
                }
            />

            {/* Search */}
            <div className="relative group max-w-4xl">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-muted-foreground/30 group-focus-within:text-primary transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                </div>
                <input
                    type="text"
                    placeholder="Search by ID, batch, or grade..."
                    className="w-full h-14 bg-card border border-border/50 rounded-2xl pl-14 pr-6 text-sm font-bold placeholder:text-muted-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-minimal"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Stats */}
            {showFullLoader ? <SkeletonCardsList count={3} /> : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <StatCard title="Grid Integrity" value="Optimal" icon="⌬" />
                    <StatCard title="Inspection Logs" value={inspections?.length || 0} icon="🔬" />
                    <StatCard title="Cert Status" value="Synced" icon="🛡️" />
                </div>
            )}

            {/* Main Table Card */}
            <div className="card-minimal overflow-hidden">
                <div className="px-10 py-6 border-b border-border/50 bg-background-soft/50 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-1">
                        <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest leading-none">Feed</p>
                        <h3 className="font-bold text-lg text-foreground tracking-tight">Inspection Registry</h3>
                    </div>
                </div>

                {showFullLoader ? <SkeletonList rows={5} /> : (
                    <div>
                        <QualityList
                            inspections={paginatedInspections}
                            onViewReport={onViewReport}
                        />
                        <div className="border-t border-border/50">
                            <TablePagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                totalRecords={inspections?.length || 0}
                                pageSize={pageSize}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Create Inspection Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
                    <div className="bg-card w-full max-w-2xl rounded-2xl border border-border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="px-10 py-7 border-b border-border/50 flex justify-between items-center">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest leading-none">Quality Registry</p>
                                <h2 className="text-xl font-bold tracking-tight uppercase">New Inspection Protocol</h2>
                            </div>
                            <button
                                onClick={() => setIsCreateModalOpen(false)}
                                className="w-9 h-9 rounded-xl border border-border bg-background-soft flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-background transition-all active:scale-95"
                            >✕</button>
                        </div>

                        <form className="space-y-8 p-10">
                            <div className="space-y-3">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Target Aggregation Pool</label>
                                <select
                                    value={formData.aggregationId}
                                    onChange={(e) => setFormData({ ...formData, aggregationId: e.target.value })}
                                    className="w-full h-12 bg-background border border-border rounded-xl px-5 text-sm font-bold text-foreground focus:border-primary outline-none transition-all appearance-none"
                                >
                                    <option value="">Select aggregation pool...</option>
                                    {aggregations?.map(agg => (
                                        <option key={agg.id} value={agg.id}>{(agg.title || 'Untitled Pool').toUpperCase()} — {agg.id.slice(0, 8).toUpperCase()}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Moisture Content (%)</label>
                                    <input
                                        type="number"
                                        value={formData.moistureContent}
                                        onChange={(e) => setFormData({ ...formData, moistureContent: parseFloat(e.target.value) })}
                                        className="w-full h-12 bg-background border border-border rounded-xl px-5 text-sm font-bold text-foreground focus:border-primary outline-none transition-all tabular-nums"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Purity Score (%)</label>
                                    <input
                                        type="number"
                                        value={formData.purityPercentage}
                                        onChange={(e) => setFormData({ ...formData, purityPercentage: parseFloat(e.target.value) })}
                                        className="w-full h-12 bg-background border border-border rounded-xl px-5 text-sm font-bold text-foreground focus:border-primary outline-none transition-all tabular-nums"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Foreign Matter (%)</label>
                                    <input
                                        type="number"
                                        value={formData.foreignMatterPercentage}
                                        onChange={(e) => setFormData({ ...formData, foreignMatterPercentage: parseFloat(e.target.value) })}
                                        className="w-full h-12 bg-background border border-border rounded-xl px-5 text-sm font-bold text-foreground focus:border-primary outline-none transition-all tabular-nums"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Quality Grade</label>
                                    <select
                                        value={formData.grade}
                                        onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                                        className="w-full h-12 bg-background border border-border rounded-xl px-5 text-sm font-bold text-foreground focus:border-primary outline-none transition-all appearance-none"
                                    >
                                        <option value="A">Grade A — Premium</option>
                                        <option value="B">Grade B — Standard</option>
                                        <option value="C">Grade C — Economy</option>
                                        <option value="rejected">Rejected — Below Standard</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Inspector Observations</label>
                                <textarea
                                    value={formData.inspectorNotes}
                                    onChange={(e) => setFormData({ ...formData, inspectorNotes: e.target.value })}
                                    placeholder="Enter detailed observations and notes..."
                                    className="w-full min-h-[120px] py-4 bg-background border border-border rounded-xl px-5 text-sm font-medium text-foreground focus:border-primary outline-none transition-all resize-none"
                                />
                            </div>
                        </form>

                        <div className="flex gap-4 p-8 border-t border-border/50 bg-background-soft/50">
                            <button
                                onClick={() => setIsCreateModalOpen(false)}
                                className="flex-1 h-12 rounded-xl border border-border bg-background text-[10px] font-bold uppercase tracking-widest hover:bg-background-soft transition-all text-muted-foreground hover:text-foreground active:scale-95"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={createMutation.isPending}
                                className="flex-[2] h-12 rounded-xl bg-primary text-white text-[10px] font-bold uppercase tracking-widest shadow-minimal hover:bg-primary/90 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {createMutation.isPending ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>✓ Submit Inspection</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Inspection Details Modal */}
            {!!selectedCheck && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
                    <div className="bg-card w-full max-w-2xl rounded-2xl border border-border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="px-10 py-7 border-b border-border/50 flex justify-between items-center">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest leading-none">Quality Registry</p>
                                <h2 className="text-xl font-bold tracking-tight uppercase">Inspection Report</h2>
                            </div>
                            <button
                                onClick={() => setSelectedCheck(null)}
                                className="w-9 h-9 rounded-xl border border-border bg-background-soft flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-background transition-all active:scale-95"
                            >✕</button>
                        </div>

                        {selectedCheck && (
                            <div className="p-10 space-y-10">
                                <div className="grid grid-cols-2 gap-6">
                                    {[
                                        { label: 'Moisture Content', value: `${selectedCheck.moistureContent}%`, bar: selectedCheck.moistureContent * 5, accent: 'bg-primary' },
                                        { label: 'Purity Score', value: `${selectedCheck.purityPercentage}%`, bar: selectedCheck.purityPercentage, accent: 'bg-primary' },
                                        { label: 'Quality Grade', value: null, isGrade: true },
                                        { label: 'Foreign Matter', value: `${selectedCheck.foreignMatterPercentage}%`, bar: selectedCheck.foreignMatterPercentage * 10, accent: 'bg-rose-500' },
                                    ].map((metric, i) => (
                                        <div key={i} className="card-minimal p-8 space-y-4 hover:border-primary/30 transition-colors">
                                            <p className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-widest leading-none">{metric.label}</p>
                                            {metric.isGrade ? (
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xl">
                                                        {selectedCheck.grade}
                                                    </div>
                                                    <p className="text-xl font-bold text-foreground uppercase tracking-tight">Grade {selectedCheck.grade}</p>
                                                </div>
                                            ) : (
                                                <>
                                                    <p className="text-3xl font-bold text-foreground tabular-nums">{metric.value}</p>
                                                    <div className="h-1.5 w-full bg-border/30 rounded-full overflow-hidden">
                                                        <div className={`h-full ${metric.accent} rounded-full transition-all duration-700`} style={{ width: `${Math.min(metric.bar!, 100)}%` }} />
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div className="card-minimal p-8 space-y-4 hover:border-primary/20 transition-colors">
                                    <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest leading-none">Inspector Observations</p>
                                    <p className="text-[15px] font-medium leading-relaxed text-foreground/70">
                                        {selectedCheck.inspectorNotes || 'No observations recorded for this inspection.'}
                                    </p>
                                </div>

                                <div className="flex justify-between items-center text-[9px] font-bold text-muted-foreground/20 uppercase tracking-widest">
                                    <span>QC-{selectedCheck.id.slice(0, 16).toUpperCase()}</span>
                                    <span>{new Date().toLocaleDateString()}</span>
                                </div>
                            </div>
                        )}

                        <div className="px-10 py-7 border-t border-border/50 bg-background-soft/50 flex justify-end">
                            <button
                                onClick={() => setSelectedCheck(null)}
                                className="h-12 px-10 rounded-xl bg-primary text-white text-[10px] font-bold uppercase tracking-widest shadow-minimal hover:bg-primary/90 active:scale-95 transition-all"
                            >
                                Acknowledge Report
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
