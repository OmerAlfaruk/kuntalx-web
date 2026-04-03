import { useState, useCallback, useMemo } from 'react';
import { PageHeader, StatCard, GlassModal, TablePagination } from '../../../shared/components/UI';
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
        <div className="space-y-10 animate-in fade-in duration-500">
            <PageHeader
                title="Quality Control"
                description="Monitor and verify the quality standards of all agricultural products in the network."
                actions={
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="w-full md:w-auto h-10 px-6 rounded-lg bg-primary text-white text-[10px] font-bold uppercase tracking-widest shadow-minimal hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                    >
                        <span>🔬</span> New Inspection
                    </button>
                }
            />

            {/* Search Bar */}
            <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground/40 group-focus-within:text-primary transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                </div>
                <input
                    type="text"
                    placeholder="Search by ID, Aggregation, or Grade..."
                    className="w-full h-14 bg-card border border-border/50 rounded-2xl pl-12 pr-6 text-sm font-bold placeholder:text-muted-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-minimal"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {showFullLoader ? <SkeletonCardsList count={3} /> : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard title="Network Quality" value="Verified" icon="💎" />
                    <StatCard title="Inspections (MTD)" value={inspections?.length || 0} icon="🔬" />
                    <StatCard title="Certification Rate" value="Dynamic" icon="✅" />
                </div>
            )}

            <div className="card-minimal overflow-hidden">
                <div className="p-8 border-b border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
                    <h3 className="font-bold text-sm tracking-widest text-foreground uppercase">Inspection Feed</h3>
                    <div className="flex gap-2 p-1 rounded-xl bg-background-soft border border-border/50">
                        <button className="h-9 px-4 text-[10px] font-bold uppercase tracking-widest rounded-lg bg-card shadow-minimal text-primary">Live Reports</button>
                        <button className="h-9 px-4 text-[10px] font-bold uppercase tracking-widest rounded-lg text-muted-foreground hover:bg-card/50 transition-all">Historical</button>
                    </div>
                </div>

                {showFullLoader ? <SkeletonList rows={5} /> : (
                    <>
                        <QualityList
                            inspections={paginatedInspections}
                            onViewReport={onViewReport}
                        />
                        <TablePagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalRecords={inspections?.length || 0}
                            pageSize={pageSize}
                            onPageChange={setCurrentPage}
                        />
                    </>
                )}
            </div>

            {/* Create Inspection Modal */}
            <GlassModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="New Inspection Record"
                maxWidth="max-w-2xl"
                footer={
                    <div className="flex flex-col sm:flex-row gap-4 w-full">
                        <button
                            onClick={() => setIsCreateModalOpen(false)}
                            className="h-11 sm:h-12 flex-1 rounded-lg bg-background border border-border text-[10px] uppercase font-bold tracking-widest hover:bg-background-soft transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={createMutation.isPending}
                            className="h-11 sm:h-12 flex-[2] rounded-lg bg-primary text-white text-[10px] font-bold uppercase tracking-widest shadow-minimal hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-30"
                        >
                            {createMutation.isPending ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>Save Inspection Record</>
                            )}
                        </button>
                    </div>
                }
            >
                <form className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Target Aggregation</label>
                        <select
                            value={formData.aggregationId}
                            onChange={(e) => setFormData({ ...formData, aggregationId: e.target.value })}
                            className="w-full h-11 bg-background border border-border rounded-lg px-4 text-sm font-medium text-foreground transition-all outline-none focus:border-primary/50"
                        >
                            <option value="">Select Aggregation...</option>
                            {aggregations?.map(agg => (
                                <option key={agg.id} value={agg.id}>{agg.title} ({agg.id.slice(0, 8).toUpperCase()})</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Moisture (%)</label>
                            <input
                                type="number"
                                value={formData.moistureContent}
                                onChange={(e) => setFormData({ ...formData, moistureContent: parseFloat(e.target.value) })}
                                className="w-full h-11 bg-background border border-border rounded-lg px-4 text-sm font-medium text-foreground transition-all outline-none focus:border-primary/50"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Purity (%)</label>
                            <input
                                type="number"
                                value={formData.purityPercentage}
                                onChange={(e) => setFormData({ ...formData, purityPercentage: parseFloat(e.target.value) })}
                                className="w-full h-11 bg-background border border-border rounded-lg px-4 text-sm font-medium text-foreground transition-all outline-none focus:border-primary/50"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Foreign Matter (%)</label>
                            <input
                                type="number"
                                value={formData.foreignMatterPercentage}
                                onChange={(e) => setFormData({ ...formData, foreignMatterPercentage: parseFloat(e.target.value) })}
                                className="w-full h-11 bg-background border border-border rounded-lg px-4 text-sm font-medium text-foreground transition-all outline-none focus:border-primary/50"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Assigned Grade</label>
                            <select
                                value={formData.grade}
                                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                                className="w-full h-11 bg-background border border-border rounded-lg px-4 text-sm font-medium text-foreground transition-all outline-none focus:border-primary/50"
                            >
                                <option value="A">Grade A</option>
                                <option value="B">Grade B</option>
                                <option value="C">Grade C</option>
                                <option value="rejected">REJECTED</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Notes & Observations</label>
                        <textarea
                            value={formData.inspectorNotes}
                            onChange={(e) => setFormData({ ...formData, inspectorNotes: e.target.value })}
                            placeholder="Enter detailed observation notes..."
                            className="w-full min-h-[120px] py-4 bg-background border border-border rounded-lg px-4 text-sm font-medium text-foreground transition-all outline-none focus:border-primary/50 resize-none"
                        />
                    </div>
                </form>
            </GlassModal>

            {/* Inspection Details Modal */}
            <GlassModal
                isOpen={!!selectedCheck}
                onClose={() => setSelectedCheck(null)}
                title={`Inspection Report: ${selectedCheck?.id.slice(0, 8).toUpperCase()}`}
                footer={
                    <button onClick={() => setSelectedCheck(null)} className="h-10 px-8 rounded-lg bg-primary text-white text-[10px] font-bold uppercase tracking-widest hover:bg-primary/90 transition-all">
                        Acknowledge
                    </button>
                }
            >
                {selectedCheck && (
                    <div className="space-y-8">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="p-6 bg-background-soft rounded-2xl border border-border/50 group">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Moisture Content</p>
                                <p className="text-3xl font-bold text-foreground tracking-tight">{selectedCheck.moistureContent}%</p>
                                <div className="mt-4 h-1 w-full bg-border rounded-full overflow-hidden">
                                    <div className="h-full bg-primary" style={{ width: `${selectedCheck.moistureContent * 5}%` }} />
                                </div>
                            </div>
                            <div className="p-6 bg-background-soft rounded-2xl border border-border/50 group">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Purity Verification</p>
                                <p className="text-3xl font-bold text-foreground tracking-tight">{selectedCheck.purityPercentage}%</p>
                                <div className="mt-4 h-1 w-full bg-border rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500" style={{ width: `${selectedCheck.purityPercentage}%` }} />
                                </div>
                            </div>
                            <div className="p-6 bg-background-soft rounded-2xl border border-border/50 group">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Quality Grade</p>
                                <p className="text-xl font-bold text-foreground">Grade {selectedCheck.grade}</p>
                            </div>
                            <div className="p-6 bg-background-soft rounded-2xl border border-border/50 group">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Foreign Matter</p>
                                <p className="text-3xl font-bold text-foreground tracking-tight">{selectedCheck.foreignMatterPercentage}%</p>
                                <div className="mt-4 h-1 w-full bg-border rounded-full overflow-hidden">
                                    <div className="h-full bg-rose-500" style={{ width: `${selectedCheck.foreignMatterPercentage * 10}%` }} />
                                </div>
                            </div>
                        </div>

                        <div className="p-8 bg-primary/5 rounded-2xl border border-primary/10 border-dashed relative">
                            <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-4">Inspector Summary</p>
                            <p className="text-sm text-foreground font-medium leading-relaxed opacity-80">
                                {selectedCheck.inspectorNotes || 'No notes provided for this inspection.'}
                            </p>
                        </div>
                    </div>
                )}
            </GlassModal>
        </div>
    );
};
