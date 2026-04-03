import { useState, useCallback, useMemo } from 'react';
import { useReactTable, getCoreRowModel, getPaginationRowModel, createColumnHelper } from '@tanstack/react-table';
import { PageHeader, GlassModal, SkeletonList, TablePagination } from '../../../shared/components/UI';
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
        columnHelper.accessor('name', {
            header: () => "Crop Name",
        }),
        columnHelper.accessor('unit', {
            header: () => "Unit",
        }),
        columnHelper.accessor('description', {
            header: () => "Description",
        }),
    ], []);

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const table = useReactTable({
        data: cropTypes,
        columns,
        state: {
            pagination,
        },
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

    const showFullLoader = isLoading && cropTypes.length === 0;

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            <PageHeader
                title="Crop Catalogue"
                description="Manage the list of authorized commodities tradable on the platform."
                actions={isPlatformAdmin && (
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="w-full md:w-auto h-10 px-6 bg-primary text-white text-[10px] font-bold uppercase tracking-widest rounded-lg shadow-minimal hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                    >
                        Add Crop
                    </button>
                )}
            />

            {/* Search Bar */}
            <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground/40 group-focus-within:text-primary transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                </div>
                <input
                    type="text"
                    placeholder="Search by Crop Name, Description, or Code..."
                    className="w-full h-14 bg-card border border-border/50 rounded-2xl pl-12 pr-6 text-sm font-bold placeholder:text-muted-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-minimal"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {showFullLoader ? (
                <div className="space-y-10">
                    <div className="h-32 w-full card-minimal animate-pulse" />
                    <SkeletonList />
                </div>
            ) : (
                <div className="card-minimal overflow-hidden">
                    <CropTypesList 
                        table={table}
                        isLoading={isLoading}
                        isPlatformAdmin={isPlatformAdmin}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                    <TablePagination
                        currentPage={table.getState().pagination.pageIndex + 1}
                        totalPages={table.getPageCount()}
                        totalRecords={table.getFilteredRowModel().rows.length}
                        pageSize={table.getState().pagination.pageSize}
                        onPageChange={(page: number) => table.setPageIndex(page - 1)}
                    />
                </div>
            )}

            <GlassModal
                isOpen={isCreateModalOpen || !!selectedCrop}
                onClose={() => {
                    setIsCreateModalOpen(false);
                    setSelectedCrop(null);
                    setCropForm({ name: '', description: '', unit: 'qt' });
                }}
                title={selectedCrop ? 'Update Crop Type' : 'Add New Crop Type'}
                footer={
                    <div className="flex gap-4 w-full">
                        <button
                            onClick={() => { setIsCreateModalOpen(false); setSelectedCrop(null); }}
                            className="h-10 px-6 rounded-lg bg-background-soft border border-border text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:bg-muted/10 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={selectedCrop ? handleUpdate : handleCreate}
                            className="h-10 px-8 rounded-lg bg-primary text-white text-[10px] font-bold uppercase tracking-widest shadow-minimal hover:bg-primary/90 transition-all"
                        >
                            {selectedCrop ? 'Update Crop' : 'Create Crop'}
                        </button>
                    </div>
                }
            >
                <div className="space-y-6 py-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60 ml-1">Crop Name</label>
                        <input
                            className="w-full h-10 bg-background border border-border rounded-lg px-4 text-xs font-bold uppercase tracking-widest focus:border-primary/50 outline-none transition-all"
                            value={cropForm.name}
                            onChange={(e) => setCropForm({ ...cropForm, name: e.target.value })}
                            placeholder="e.g. White Teff"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60 ml-1">Unit</label>
                        <div className="relative">
                            <select
                                className="w-full h-10 bg-background border border-border rounded-lg px-4 text-xs font-bold uppercase tracking-widest focus:border-primary/50 outline-none transition-all appearance-none"
                                value={cropForm.unit}
                                onChange={(e) => setCropForm({ ...cropForm, unit: e.target.value })}
                            >
                                <option value="qt">Kuntal (qt)</option>
                                <option value="kg">Kilogram (kg)</option>
                                <option value="t">Metric Ton (t)</option>
                            </select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60 ml-1">Description</label>
                        <textarea
                            className="w-full h-32 bg-background border border-border rounded-lg p-4 text-xs font-bold uppercase tracking-widest focus:border-primary/50 outline-none transition-all resize-none"
                            value={cropForm.description}
                            onChange={(e) => setCropForm({ ...cropForm, description: e.target.value })}
                            placeholder="Standards or variety specifics..."
                        />
                    </div>
                </div>
            </GlassModal>
        </div>
    );
};
