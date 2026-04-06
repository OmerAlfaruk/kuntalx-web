import { useState, useCallback, useMemo } from 'react';
import { useReactTable, getCoreRowModel, getPaginationRowModel, createColumnHelper } from '@tanstack/react-table';
import { PageHeader, StatCard, TablePagination } from '../../../shared/components/UI';
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
        <div className="space-y-10 animate-in fade-in duration-500 pb-20">
            <PageHeader
                title="Users"
                description="Manage platform access, roles, and member security across the national grid."
            />

            {/* Search Bar */}
            <div className="relative group">
                <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-muted-foreground/30 group-focus-within:text-primary transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                </div>
                <input
                    type="text"
                    placeholder="Search users by name, email, or role..."
                    className="w-full h-14 bg-background-soft border border-border rounded-2xl pl-14 pr-6 text-[13px] font-bold text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary transition-all shadow-minimal"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {showFullLoader ? <SkeletonCardsList count={4} /> : (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8">
                    <StatCard
                        title="Total Users"
                        value={users.length.toString()}
                        icon="👥"
                        description="Registered accounts"
                    />
                    <StatCard
                        title="Active"
                        value={activeMembers.toString()}
                        icon="✓"
                        description="Verified access"
                    />
                    <StatCard
                        title="Inactive"
                        value={pendingMembers.toString()}
                        icon="⏳"
                        description="Awaiting check"
                    />
                    <StatCard
                        title="Suspended"
                        value={restrictedMembers.toString()}
                        icon="🚫"
                        description="Access restricted"
                    />
                </div>
            )}

            <div className="flex gap-2.5 pb-4 mb-6 overflow-x-auto custom-scrollbar">
                {roles.map((role) => (
                    <button
                        key={role}
                        onClick={() => {
                            setFilterRole(role);
                            table.setPageIndex(0);
                        }}
                        className={`h-9 px-5 text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap rounded-lg border ${filterRole === role
                            ? 'bg-primary text-white border-transparent shadow-minimal'
                            : 'bg-background-soft border-border text-muted-foreground hover:bg-background hover:text-primary'
                            }`}
                    >
                        {role.replace(/_/g, ' ')}
                    </button>
                ))}
            </div>

            <div className="card-minimal overflow-hidden">
                <div className="px-8 py-5 border-b border-border/50 bg-background-soft/50 flex justify-between items-center">
                    <div>
                        <h2 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Directory</h2>
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
                        <div className="border-t border-border/50">
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

            {isRoleModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
                    <div className="card-minimal w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500 flex flex-col max-h-[90vh]">
                        <div className="px-8 py-6 border-b border-border/50 bg-background-soft shrink-0">
                            <h2 className="text-[14px] font-bold text-foreground tracking-tight">Update User Role</h2>
                            <p className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-widest mt-1">Modify account permissions</p>
                        </div>
                        
                        <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar">
                            <div className="bg-background-soft rounded-2xl border border-border/50 p-6 flex gap-6 items-center">
                                <div className="w-14 h-14 bg-background border border-border rounded-xl flex items-center justify-center text-xl text-primary font-bold shadow-minimal shrink-0">
                                    {selectedUser?.fullName?.[0] || 'U'}
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">User Identity</p>
                                    <p className="text-[15px] text-foreground font-bold tracking-tight">{selectedUser?.fullName}</p>
                                    <p className="text-[10px] text-primary font-bold uppercase tracking-widest mt-1 opacity-80">Current Role: {selectedUser?.role.replace(/_/g, ' ')}</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">New Assignment</label>
                                <div className="relative group/select">
                                    <select
                                        className="w-full h-12 bg-background border border-border rounded-xl px-4 font-bold text-[13px] text-foreground focus:border-primary/50 transition-all outline-none appearance-none cursor-pointer"
                                        value={newRole}
                                        onChange={(e) => setNewRole(e.target.value)}
                                    >
                                        {roles.filter(r => r !== 'all').map(r => (
                                            <option key={r} value={r}>{r.replace(/_/g, ' ').toUpperCase()}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">⌵</div>
                                </div>
                            </div>

                            {updateError && (
                                <div className="bg-rose-500/5 border border-rose-500/20 p-4 rounded-xl flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                                    <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">{updateError}</p>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-4 p-8 bg-background-soft border-t border-border/50 shrink-0">
                            <button
                                onClick={() => {
                                    setIsRoleModalOpen(false);
                                    setUpdateError(null);
                                }}
                                className="h-11 flex-1 rounded-xl border border-border text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:bg-background transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRoleUpdate}
                                className="h-11 flex-[2] rounded-xl bg-primary text-white text-[10px] font-bold uppercase tracking-widest shadow-minimal hover:bg-primary/90 active:scale-95 transition-all flex items-center justify-center"
                            >
                                Confirm Change
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
