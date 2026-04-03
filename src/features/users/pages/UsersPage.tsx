import { useState, useCallback, useMemo } from 'react';
import { useReactTable, getCoreRowModel, getPaginationRowModel, createColumnHelper } from '@tanstack/react-table';
import { PageHeader, StatCard, GlassModal, TablePagination } from '../../../shared/components/UI';
import { SkeletonList, SkeletonCardsList } from '../../../shared/components/Skeletons';
import { useUsers } from '../hooks/use-users';
import { useDebounce } from '../../../shared/hooks/use-debounce';
import type { User } from '../../admin/types/admin';
import { UsersList } from '../components/UsersList';

const columnHelper = createColumnHelper<User>();

export const UsersPage = () => {
    const [filterRole, setFilterRole] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const [updateError, setUpdateError] = useState<string | null>(null);
    
    const { users, isLoading, updateRole, deactivate } = useUsers({
        role: filterRole === 'all' ? undefined : filterRole,
        keyword: debouncedSearchTerm || undefined
    });

    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
    const [newRole, setNewRole] = useState<string>('');

    const handleRoleUpdate = useCallback(async () => {
        if (selectedUser && newRole) {
            try {
                setUpdateError(null);
                await updateRole({ userId: selectedUser.id, role: newRole });
                setIsRoleModalOpen(false);
                setSelectedUser(null);
            } catch (err: any) {
                setUpdateError(err.response?.data?.detail || 'Failed to update user role. Permissions check failed or server error.');
            }
        }
    }, [selectedUser, newRole, updateRole]);

    const handleDeactivate = useCallback(async (userId: string) => {
        if (confirm('Are you sure you want to deactivate this user?')) {
            await deactivate(userId);
        }
    }, [deactivate]);

    const onRoleUpdate = useCallback((user: User) => {
        setSelectedUser(user);
        setNewRole(user.role);
        setIsRoleModalOpen(true);
    }, []);

    const roles = ['all', 'platform_admin', 'association_admin', 'buyer', 'farmer'];
    const showFullLoader = isLoading && users.length === 0;

    const columns = useMemo(() => [
        columnHelper.accessor('fullName', {
            header: () => "Full Name",
        }),
        columnHelper.accessor('role', {
            header: () => "Role",
        }),
        columnHelper.accessor('email', {
            header: () => "Email",
        }),
        columnHelper.accessor('status', {
            header: () => "Status",
        }),
        columnHelper.accessor('joinedAt' as any, {
            header: () => "Joined At",
        }),
    ], []);

    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const table = useReactTable({
        data: users,
        columns,
        state: {
            pagination,
        },
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        autoResetPageIndex: false,
    });

    const currentPage = table.getState().pagination.pageIndex + 1;
    const totalPages = table.getPageCount();
    const pageSize = table.getState().pagination.pageSize;

    const activeMembers = useMemo(() => users.filter(u => u.status === 'active').length, [users]);
    const pendingMembers = useMemo(() => users.filter(u => u.status === 'inactive').length, [users]);
    const restrictedMembers = useMemo(() => users.filter(u => u.status === 'suspended').length, [users]);

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            <PageHeader
                title="Platform Users"
                description="Manage team accounts and platform access levels across the network."
            />

            {/* Search Bar */}
            <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground/40 group-focus-within:text-primary transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                </div>
                <input
                    type="text"
                    placeholder="Search by Name, Email, or Role..."
                    className="w-full h-14 bg-card border border-border/50 rounded-2xl pl-12 pr-6 text-sm font-bold placeholder:text-muted-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-minimal"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {showFullLoader ? <SkeletonCardsList count={4} /> : (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Users"
                        value={users.length.toString()}
                        icon="👥"
                        description="Registered accounts"
                    />
                    <StatCard
                        title="Active"
                        value={activeMembers.toString()}
                        icon="✅"
                        description="Verified access"
                    />
                    <StatCard
                        title="Pending"
                        value={pendingMembers.toString()}
                        icon="⏳"
                        description="Awaiting setup"
                    />
                    <StatCard
                        title="Restricted"
                        value={restrictedMembers.toString()}
                        icon="🚫"
                        description="Suspended accounts"
                    />
                </div>
            )}

            <div className="flex gap-2 pb-2 mb-6 overflow-x-auto no-scrollbar">
                {roles.map((role) => (
                    <button
                        key={role}
                        onClick={() => {
                            setFilterRole(role);
                            table.setPageIndex(0);
                        }}
                        className={`h-9 px-4 text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap rounded-lg border ${filterRole === role
                            ? 'bg-primary text-white border-transparent shadow-minimal'
                            : 'bg-background text-muted-foreground border-border hover:border-primary/30'
                            }`}
                    >
                        {role.replace('_', ' ')}
                    </button>
                ))}
            </div>

            <div className="card-minimal overflow-hidden">
                <div className="px-6 py-4 border-b border-border bg-background-soft flex justify-between items-center">
                    <div>
                        <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">User Directory</h2>
                    </div>
                </div>

                {showFullLoader ? <SkeletonList rows={5} /> : (
                    <>
                        <UsersList
                            table={table}
                            isLoading={isLoading}
                            onRoleUpdate={onRoleUpdate}
                            onDeactivate={handleDeactivate}
                        />
                        <div className="border-t border-border">
                            <TablePagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                totalRecords={users.length}
                                pageSize={pageSize}
                                onPageChange={(page) => table.setPageIndex(page - 1)}
                            />
                        </div>
                    </>
                )}
            </div>

            <GlassModal
                isOpen={isRoleModalOpen}
                onClose={() => setIsRoleModalOpen(false)}
                title="Update User Role"
                footer={
                    <div className="flex flex-col w-full gap-4">
                        {updateError && (
                            <div className="bg-rose-500/5 border border-rose-500/20 p-4 rounded-lg flex items-center gap-3">
                                <span className="text-rose-500">⚠️</span>
                                <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">{updateError}</p>
                            </div>
                        )}
                        <div className="flex gap-4 w-full">
                            <button
                                onClick={() => {
                                    setIsRoleModalOpen(false);
                                    setUpdateError(null);
                                }}
                                className="h-10 flex-1 rounded-lg bg-background-soft border border-border text-[10px] uppercase font-bold tracking-widest text-muted-foreground hover:bg-muted/10 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRoleUpdate}
                                className="h-10 flex-[2] rounded-lg bg-primary text-white text-[10px] font-bold uppercase tracking-widest shadow-minimal hover:bg-primary/90 transition-all"
                            >
                                Update Role
                            </button>
                        </div>
                    </div>
                }
            >
                <div className="space-y-8 py-4">
                    <div className="bg-background-soft rounded-2xl border border-border p-6 flex gap-6 items-center">
                        <div className="w-14 h-14 bg-primary/5 rounded-xl flex items-center justify-center text-2xl text-primary font-bold border border-primary/10">
                            {selectedUser?.fullName?.[0]}
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-primary uppercase tracking-widest">User Account</p>
                            <p className="text-base text-foreground font-bold tracking-tight uppercase">{selectedUser?.fullName}</p>
                            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Current: {selectedUser?.role.replace('_', ' ')}</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">New Designation</label>
                        <div className="relative">
                            <select
                                className="w-full h-11 bg-background border border-border rounded-lg px-4 font-bold text-xs tracking-widest text-foreground focus:border-primary/50 transition-all outline-none uppercase appearance-none"
                                value={newRole}
                                onChange={(e) => setNewRole(e.target.value)}
                            >
                                {roles.filter(r => r !== 'all').map(r => (
                                    <option key={r} value={r}>{r.replace('_', ' ')}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </GlassModal>
        </div >
    );
};
