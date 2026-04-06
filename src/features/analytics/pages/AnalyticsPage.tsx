import { PageHeader, StatCard, Badge } from '../../../shared/components/UI';
import { SkeletonCardsList } from '../../../shared/components/Skeletons';
import { useMemo } from 'react';
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip as RechartsTooltip,
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend
} from 'recharts';
import { useDashboardStats, useMonthlyIncome } from '../../dashboard';
import type { MonthlyIncomePoint } from '../../dashboard';

export const AnalyticsPage = () => {
    // Fetch unified platform stats from the backend
    const { data: stats, isLoading } = useDashboardStats('platform_admin');
    const { data: incomeData = [] } = useMonthlyIncome();

    const showFullLoader = isLoading && !stats;

    const cropTrendData = useMemo(() => {
        // Simulating multi-commodity temporal data for visualization
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        return months.map((month, i) => ({
            name: month,
            Coffee: 400 + Math.random() * 200 + (i * 50),
            Grains: 300 + Math.random() * 100 + (i * 30),
            Pulses: 200 + Math.random() * 150 + (i * 20),
        }));
    }, []);

    const barChartData = useMemo(() => {
        if (!stats?.regionalActivity) return [];
        return stats.regionalActivity.slice(0, 6).map((a: any) => ({
            name: a.name.split(' ')[0],
            volume: a.volume || 0
        }));
    }, [stats?.regionalActivity]);

    const pieChartStats = useMemo(() => {
        if (!stats) return { pieData: [], total: 0 };
        const adminCount = Math.round((stats.totalFarmers + stats.totalBuyers) * 0.05);
        const pieData = [
            { name: 'Farmers', value: stats.totalFarmers, fill: '#05461d', bgClass: 'bg-primary' },
            { name: 'Buyers', value: stats.totalBuyers, fill: '#B45309', bgClass: 'bg-secondary' },
            { name: 'Admins', value: adminCount, fill: '#64748b', bgClass: 'bg-muted-foreground' }
        ];
        const filteredPieData = pieData.filter(d => d.value > 0);
        const total = pieData.reduce((acc, curr) => acc + curr.value, 0);
        return { pieData, filteredPieData, total };
    }, [stats]);

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-16">
            <PageHeader
                title="Platform Analytics"
                description="Cross-sector analytical dashboard providing real-time insights on commodity trade flow and platform growth."
                actions={
                    <div className="flex flex-wrap items-center gap-4 px-6 py-3 card-minimal w-full sm:w-auto">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Live Sync</span>
                        </div>
                        <div className="hidden sm:block w-px h-6 bg-border/50" />
                        <span className="text-[10px] font-mono font-bold text-muted-foreground/40 uppercase tracking-widest">
                            Updated: {new Date().toLocaleTimeString()}
                        </span>
                    </div>
                }
            />

            {showFullLoader ? <SkeletonCardsList count={4} /> : stats && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    <StatCard
                        title="Regional Nodes"
                        value={stats.totalAssociations}
                        icon="⌬"
                        description="Verified regional hubs actively synchronizing trades."
                        trend={{ value: stats.totalAssociationsTrend || 0, isUp: (stats.totalAssociationsTrend || 0) >= 0 }}
                    />
                    <StatCard
                        title="Producer Entities"
                        value={stats.totalFarmers.toLocaleString()}
                        icon="𐃏"
                        description="Authorized producers contributing to the logistical grid."
                        trend={{ value: stats.totalFarmersTrend || 0, isUp: (stats.totalFarmersTrend || 0) >= 0 }}
                    />
                    <StatCard
                        title="Procurement Hubs"
                        value={stats.totalBuyers.toLocaleString()}
                        icon="🏢"
                        description="Commercial entities authorized for large-scale procurement."
                        trend={{ value: stats.totalBuyersTrend || 0, isUp: (stats.totalBuyersTrend || 0) >= 0 }}
                    />
                    <StatCard
                        title="Trade Volume (QT)"
                        value={stats.totalSalesVolume.toLocaleString()}
                        icon="📊"
                        description="Cumulative commodity volume synchronized via protocol."
                        trend={{ value: stats.totalSalesVolumeTrend || 0, isUp: (stats.totalSalesVolumeTrend || 0) >= 0 }}
                    />
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Output Performance (Bar Chart) */}
                <div className="card-minimal p-10 flex flex-col group relative overflow-hidden transition-colors hover:border-primary/20">
                    <div className="mb-10 flex justify-between items-start relative z-10 w-full">
                        <div className="space-y-1">
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-primary">Regional Output</h3>
                            <p className="text-[11px] font-bold text-muted-foreground/40 uppercase tracking-[0.1em]">Supply Volume Analysis</p>
                        </div>
                        <Badge variant="outline" className="px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border-border/50 shrink-0">7D Trend</Badge>
                    </div>

                    <div className="h-[320px] w-full relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barChartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" style={{ opacity: 0.5 }} />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontWeight: 700 }}
                                    dy={15}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontWeight: 700 }}
                                />
                                <RechartsTooltip
                                    cursor={false}
                                    contentStyle={{
                                        backgroundColor: 'var(--background)',
                                        borderRadius: '12px',
                                        border: '1px solid var(--border)',
                                        boxShadow: 'var(--shadow-minimal)',
                                        padding: '12px',
                                        fontSize: '11px',
                                        fontWeight: 700,
                                        textTransform: 'uppercase'
                                    }}
                                />
                                <Bar dataKey="volume" fill="#05461d" radius={[4, 4, 0, 0]} barSize={32}>
                                    {barChartData.map((_: any, index: number) => (
                                        <Cell key={`cell-${index}`} fillOpacity={0.8} className="hover:fill-opacity-100 transition-all duration-300" />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* User Composition (Pie Chart) */}
                <div className="card-minimal p-10 relative overflow-hidden group transition-colors hover:border-primary/20">
                    <div className="mb-10 relative z-10 space-y-1">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-primary">Platform Composition</h3>
                        <p className="text-[11px] font-bold text-muted-foreground/40 uppercase tracking-[0.1em]">User Demographic Breakdown</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
                        <div className="h-[280px] w-full relative">
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none space-y-1">
                                <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">Total Users</p>
                                <p className="text-3xl font-bold text-foreground tabular-nums tracking-tight">{pieChartStats.total.toLocaleString()}</p>
                            </div>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieChartStats.filteredPieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={85}
                                        outerRadius={105}
                                        paddingAngle={2}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {pieChartStats.filteredPieData?.map((entry: any, index: number) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={entry.fill}
                                                className="hover:opacity-80 transition-all duration-300 cursor-pointer"
                                            />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip
                                        cursor={false}
                                        contentStyle={{
                                            backgroundColor: 'var(--background)',
                                            borderRadius: '12px',
                                            border: '1px solid var(--border)',
                                            padding: '12px 16px',
                                            fontSize: '11px',
                                            fontWeight: 700,
                                            textTransform: 'uppercase'
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="space-y-8">
                            {pieChartStats.pieData.map((role: any) => (
                                <div key={role.name} className="group/item space-y-3">
                                    <div className="flex justify-between items-end">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2.5 h-2.5 rounded-full ${role.bgClass}`} />
                                            <span className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-widest">{role.name}</span>
                                        </div>
                                        <span className="font-bold text-foreground text-sm tabular-nums">{role.value.toLocaleString()}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-border/30 rounded-full overflow-hidden">
                                        <div
                                            className={`${role.bgClass} h-full rounded-full transition-all duration-700`}
                                            style={{ width: `${pieChartStats.total > 0 ? (role.value / pieChartStats.total) * 100 : 0}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Commodity Sales Performance (Line Chart) */}
            <div className="card-minimal p-10 flex flex-col group relative overflow-hidden transition-colors hover:border-primary/20">
                <div className="mb-10 flex justify-between items-start relative z-10 w-full">
                    <div className="space-y-1">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-primary">Market Trends</h3>
                        <p className="text-[11px] font-bold text-muted-foreground/40 uppercase tracking-[0.1em]">Commodity Price Index</p>
                    </div>
                    <Badge variant="outline" className="px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border-border/50 shrink-0">Seasonal</Badge>
                </div>

                <div className="h-[400px] w-full relative z-10">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={cropTrendData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" style={{ opacity: 0.5 }} />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontWeight: 700 }}
                                dy={15}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontWeight: 700 }}
                            />
                            <RechartsTooltip
                                cursor={false}
                                contentStyle={{

                                    borderRadius: '12px',
                                    border: '1px solid var(--border)',
                                    boxShadow: 'var(--shadow-minimal)',
                                    padding: '16px',
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    textTransform: 'uppercase'
                                }}
                            />
                            <Legend
                                verticalAlign="top"
                                align="right"
                                iconType="circle"
                                wrapperStyle={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', paddingBottom: '20px', opacity: 0.7 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="Coffee"
                                stroke="#05461d"
                                strokeWidth={3}
                                dot={{ fill: '#05461d', r: 4, strokeWidth: 2, stroke: 'var(--background)' }}
                                activeDot={{ r: 6, strokeWidth: 0 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="Grains"
                                stroke="#B45309"
                                strokeWidth={3}
                                dot={{ fill: '#B45309', r: 4, strokeWidth: 2, stroke: 'var(--background)' }}
                                activeDot={{ r: 6, strokeWidth: 0 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="Pulses"
                                stroke="#D4AF37"
                                strokeWidth={3}
                                dot={{ fill: '#D4AF37', r: 4, strokeWidth: 2, stroke: 'var(--background)' }}
                                activeDot={{ r: 6, strokeWidth: 0 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Monthly Revenue Flow (Bar Chart) */}
            <div className="card-minimal p-10 flex flex-col group relative overflow-hidden transition-colors hover:border-primary/20">
                <div className="mb-10 flex justify-between items-start relative z-10 w-full">
                    <div className="space-y-1">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-primary">Fiscal Flow Overview</h3>
                        <p className="text-[11px] font-bold text-muted-foreground/40 uppercase tracking-[0.1em]">Platform Fees vs Payouts</p>
                    </div>
                    <Badge variant="outline" className="px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border-border/50 shrink-0">Annual View</Badge>
                </div>

                <div className="h-[350px] w-full relative z-10">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={incomeData} barCategoryGap="25%" barGap={8}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" style={{ opacity: 0.5 }} />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontWeight: 700 }}
                                dy={15}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontWeight: 700 }}
                                tickFormatter={(v) => `${v}k`}
                            />
                            <RechartsTooltip
                                cursor={false}
                                contentStyle={{
                                    backgroundColor: 'var(--background)',
                                    borderRadius: '12px',
                                    border: '1px solid var(--border)',
                                    boxShadow: 'var(--shadow-minimal)',
                                    padding: '16px',
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    textTransform: 'uppercase'
                                }}
                                formatter={(value: any, name?: string) => [`ETB ${value}k`, name ?? '']}
                            />
                            <Legend
                                verticalAlign="top"
                                align="right"
                                iconType="circle"
                                wrapperStyle={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', paddingBottom: '20px', opacity: 0.7 }}
                            />
                            <Bar dataKey="Commission" fill="#05461d" radius={[4, 4, 0, 0]} barSize={20} />
                            <Bar dataKey="Payouts" fill="#B45309" radius={[4, 4, 0, 0]} barSize={20} opacity={0.6} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Fiscal Metrics Summary */}
                <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-10 pt-10 border-t border-border/50 relative z-10">
                    <div className="space-y-3">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/50">Total Fees Collected</p>
                        <p className="text-2xl font-bold text-primary tabular-nums">ETB {incomeData.reduce((s: number, d: MonthlyIncomePoint) => s + d.Commission, 0).toLocaleString()}k</p>
                        <p className="text-[11px] font-medium text-muted-foreground/50 leading-relaxed">Aggregated platform fees.</p>
                    </div>
                    <div className="space-y-3">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/50">Total Payouts Distributed</p>
                        <p className="text-2xl font-bold text-foreground tabular-nums">ETB {incomeData.reduce((s: number, d: MonthlyIncomePoint) => s + d.Payouts, 0).toLocaleString()}k</p>
                        <p className="text-[11px] font-medium text-muted-foreground/50 leading-relaxed">Net capital delta to producers.</p>
                    </div>
                    <div className="space-y-3">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/50">System Conversion Efficiency</p>
                        <p className="text-2xl font-bold text-foreground tabular-nums">
                            {incomeData.length > 0 && incomeData.reduce((s: number, d: MonthlyIncomePoint) => s + d.Commission, 0) + incomeData.reduce((s: number, d: MonthlyIncomePoint) => s + d.Payouts, 0) > 0
                                ? Math.round((incomeData.reduce((s: number, d: MonthlyIncomePoint) => s + d.Commission, 0) / (incomeData.reduce((s: number, d: MonthlyIncomePoint) => s + d.Commission, 0) + incomeData.reduce((s: number, d: MonthlyIncomePoint) => s + d.Payouts, 0))) * 1000) / 10
                                : 0}%
                        </p>
                        <p className="text-[11px] font-medium text-muted-foreground/50 leading-relaxed">Yield percentage ratio.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
