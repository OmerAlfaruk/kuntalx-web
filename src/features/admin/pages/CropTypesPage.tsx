import { useState, useCallback, useMemo } from 'react';
import { useReactTable, getCoreRowModel, getPaginationRowModel, createColumnHelper } from '@tanstack/react-table';
import { PageHeader, SkeletonList, TablePagination } from '../../../shared/components/UI';
import { useCropTypes } from '../hooks';
import { useAuth } from '../../../lib/auth-context';
import { useDebounce } from '../../../shared/hooks/use-debounce';
import type { CropType } from '../types/admin';
import { CropTypesList } from '../components/CropTypesList';

const columnHelper = createColumnHelper<CropType>();

export const CropTypesPage = () => {
    const { user } = useAuth();
    const isPlatformAdmin = user?.role === 'platform_admin';

    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const { cropTypes, isLoading, createCropType, updateCropType, deleteCropType } = useCropTypes(debouncedSearchTerm);

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedCrop, setSelectedCrop] = useState<CropType | null>(null);
    const [cropForm, setCropForm] = useState({
        name: '',
        description: '',
        unit: 'qt'
    });

    const columns = useMemo(() => [
        columnHelper.accessor('name', { header: () => "Crop Name" }),
        columnHelper.accessor('unit', { header: () => "Unit" }),
        columnHelper.accessor('description', { header: () => "Description" }),
    ], []);

    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

    const table = useReactTable({
        data: cropTypes,
        columns,
        state: { pagination },
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        autoResetPageIndex: false,
    });

    const handleCreate = useCallback(async () => {
        await createCropType(cropForm);
        setIsCreateModalOpen(false);
        setCropForm({ name: '', description: '', unit: 'qt' });
    }, [createCropType, cropForm]);

    const handleUpdate = useCallback(async () => {
        if (selectedCrop) {
            await updateCropType({ id: selectedCrop.id, data: cropForm });
            setSelectedCrop(null);
            setCropForm({ name: '', description: '', unit: 'qt' });
        }
    }, [updateCropType, selectedCrop, cropForm]);

    const handleDelete = useCallback(async (id: string) => {
        if (confirm('Are you sure you want to delete this crop type?')) {
            await deleteCropType(id);
        }
    }, [deleteCropType]);

    const handleEdit = useCallback((crop: CropType) => {
        setSelectedCrop(crop);
        setCropForm({
            name: crop.name,
            description: crop.description || '',
            unit: crop.unit
        });
    }, []);

    const isModalOpen = isCreateModalOpen || !!selectedCrop;

    const closeModal = () => {
        setIsCreateModalOpen(false);
        setSelectedCrop(null);
        setCropForm({ name: '', description: '', unit: 'qt' });
    };

    const showFullLoader = isLoading && cropTypes.length === 0;

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2 duration-700 pb-12">
            <PageHeader
                title="Commodity Registry"
                description="Manage the authorized list of crop types tradable across the platform."
                actions={isPlatformAdmin && (
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="w-full md:w-auto h-12 px-8 bg-primary text-white text-[10px] font-bold uppercase tracking-widest rounded-2xl shadow-minimal hover:bg-primary/90 active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                        <span>+</span> Add Commodity
                    </button>
                )}
            />

            {/* Search */}
            <div className="relative group max-w-4xl">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-muted-foreground/30 group-focus-within:text-primary transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                </div>
                <input
                    type="text"
                    placeholder="Search by commodity name or unit..."
                    className="w-full h-14 bg-card border border-border/50 rounded-2xl pl-14 pr-6 text-sm font-bold placeholder:text-muted-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-minimal"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Table */}
            {showFullLoader ? (
                <div className="card-minimal p-8">
                    <SkeletonList rows={10} />
                </div>
            ) : (
                <div className="card-minimal overflow-hidden">
                    <div className="px-10 py-6 border-b border-border/50 bg-background-soft/50 flex justify-between items-center">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest leading-none">Registry</p>
                            <h3 className="font-bold text-lg text-foreground tracking-tight">Commodity Types</h3>
                        </div>
                        <span className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-widest">{cropTypes.length} entries</span>
                    </div>
                    <div>
                        <CropTypesList
                            table={table}
                            isLoading={isLoading}
                            isPlatformAdmin={isPlatformAdmin}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                        <div className="border-t border-border/50">
                            <TablePagination
                                currentPage={table.getState().pagination.pageIndex + 1}
                                totalPages={table.getPageCount()}
                                totalRecords={table.getFilteredRowModel().rows.length}
                                pageSize={table.getState().pagination.pageSize}
                                onPageChange={(page: number) => table.setPageIndex(page - 1)}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Create / Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
                    <div className="bg-card w-full max-w-lg rounded-2xl border border-border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="px-10 py-7 border-b border-border/50 flex justify-between items-center">
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest leading-none">Commodity Registry</p>
                                <h2 className="text-xl font-bold tracking-tight uppercase">
                                    {selectedCrop ? 'Edit Commodity' : 'New Commodity'}
                                </h2>
                            </div>
                            <button
                                onClick={closeModal}
                                className="w-9 h-9 rounded-xl border border-border bg-background-soft flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-background transition-all active:scale-95"
                            >✕</button>
                        </div>

                        <div className="space-y-6 p-10">
                            <div className="space-y-2.5">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Commodity Name</label>
                                <input
                                    className="w-full h-12 bg-background border border-border rounded-xl px-5 text-sm font-bold text-foreground focus:border-primary outline-none transition-all"
                                    value={cropForm.name}
                                    onChange={(e) => setCropForm({ ...cropForm, name: e.target.value })}
                                    placeholder="e.g. White Teff"
                                />
                            </div>
                            <div className="space-y-2.5">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Measurement Unit</label>
                                <select
                                    className="w-full h-12 bg-background border border-border rounded-xl px-5 text-sm font-bold text-foreground focus:border-primary outline-none transition-all appearance-none cursor-pointer"
                                    value={cropForm.unit}
                                    onChange={(e) => setCropForm({ ...cropForm, unit: e.target.value })}
                                >
                                    <option value="qt">Quintal (QT)</option>
                                    <option value="kg">Kilogram (KG)</option>
                                    <option value="t">Metric Ton (T)</option>
                                </select>
                            </div>
                            <div className="space-y-2.5">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Description</label>
                                <textarea
                                    className="w-full h-32 bg-background border border-border rounded-xl px-5 py-4 text-sm font-medium text-foreground focus:border-primary outline-none transition-all resize-none"
                                    value={cropForm.description}
                                    onChange={(e) => setCropForm({ ...cropForm, description: e.target.value })}
                                    placeholder="Enter grading standards, variety specifics, or notes..."
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 px-10 py-7 border-t border-border/50 bg-background-soft/50">
                            <button
                                onClick={closeModal}
                                className="flex-1 h-12 rounded-xl border border-border bg-background text-[10px] font-bold uppercase tracking-widest hover:bg-background-soft transition-all text-muted-foreground hover:text-foreground active:scale-95"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={selectedCrop ? handleUpdate : handleCreate}
                                className="flex-[2] h-12 rounded-xl bg-primary text-white text-[10px] font-bold uppercase tracking-widest shadow-minimal hover:bg-primary/90 active:scale-95 transition-all"
                            >
                                {selectedCrop ? '✓ Save Changes' : '+ Add Commodity'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
