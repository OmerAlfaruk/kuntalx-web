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
        <div className="space-y-8 sm:space-y-16 animate-in fade-in duration-500">
            <PageHeader
                title="Platform Analytics"
                description="Comprehensive insights into platform trade volume and regional activity."
                actions={
                    <div className="flex flex-wrap items-center gap-3 px-4 py-2 bg-card border border-border rounded-lg shadow-minimal w-full sm:w-auto">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span className="text-[10px] font-bold text-foreground uppercase tracking-widest">Live Sync</span>
                        </div>
                        <div className="hidden sm:block w-px h-4 bg-border" />
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">
                            {new Date().toLocaleTimeString()}
                        </span>
                    </div>
                }
            />

            {showFullLoader ? <SkeletonCardsList count={4} /> : stats && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Regional Associations"
                        value={stats.totalAssociations}
                        icon="🏢"
                        description="Verified associations actively trading on the platform."
                        trend={{ value: stats.totalAssociationsTrend || 0, isUp: (stats.totalAssociationsTrend || 0) >= 0 }}
                    />
                    <StatCard
                        title="Active Farmers"
                        value={stats.totalFarmers.toLocaleString()}
                        icon="👨‍🌾"
                        description="Individual producers contributing to the supply network."
                        trend={{ value: stats.totalFarmersTrend || 0, isUp: (stats.totalFarmersTrend || 0) >= 0 }}
                    />
                    <StatCard
                        title="Registered Buyers"
                        value={stats.totalBuyers.toLocaleString()}
                        icon="🏛️"
                        description="Commercial entities procurement produce at scale."
                        trend={{ value: stats.totalBuyersTrend || 0, isUp: (stats.totalBuyersTrend || 0) >= 0 }}
                    />
                    <StatCard
                        title="Total volume (QT)"
                        value={stats.totalSalesVolume.toLocaleString()}
                        icon="📊"
                        description="Cumulative volume of produce recorded on the platform."
                        trend={{ value: stats.totalSalesVolumeTrend || 0, isUp: (stats.totalSalesVolumeTrend || 0) >= 0 }}
                    />
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Trade Value Distribution (Bar Chart) */}
                <div className="card-minimal p-8 flex flex-col group text-left">
                    <div className="mb-8 flex justify-between items-start">
                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">Output Performance</h3>
                            <p className="text-[10px] text-muted-foreground mt-1 font-bold uppercase tracking-widest opacity-60">Yield volume by region</p>
                        </div>
                        <Badge variant="outline" className="text-[9px] uppercase tracking-widest font-bold">30 Days</Badge>
                    </div>

                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={barChartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: 'var(--muted-foreground)', fontSize: 9, fontWeight: 700 }}
                                        dy={15}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: 'var(--muted-foreground)', fontSize: 9, fontWeight: 700 }}
                                    />
                                    <RechartsTooltip
                                        cursor={{ fill: 'var(--primary)', opacity: 0.05 }}
                                        contentStyle={{
                                            backgroundColor: 'var(--card)',
                                            borderRadius: '8px',
                                            border: '1px solid var(--border)',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                            padding: '12px',
                                            fontSize: '10px',
                                            fontWeight: 700
                                        }}
                                    />
                                    <Bar dataKey="volume" fill="var(--color-primary)" radius={[2, 2, 0, 0]} barSize={24} />
                                </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Member Base (Pie Chart) */}
                <div className="card-minimal p-8 relative text-left">
                    <div className="relative z-10 mb-8">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">User Composition</h3>
                        <p className="text-[10px] text-muted-foreground mt-1 font-bold uppercase tracking-widest opacity-60">Platform stakeholders distribution</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10">
                        <div className="h-[250px] w-full relative">
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total</p>
                                <p className="text-2xl font-bold text-foreground">{pieChartStats.total.toLocaleString()}</p>
                            </div>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieChartStats.filteredPieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={70}
                                        outerRadius={85}
                                        paddingAngle={(pieChartStats.filteredPieData?.length ?? 0) > 1 ? 5 : 0}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {pieChartStats.filteredPieData?.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip
                                        contentStyle={{
                                            backgroundColor: 'var(--card)',
                                            borderRadius: '8px',
                                            border: '1px solid var(--border)',
                                            padding: '8px 12px',
                                            fontSize: '10px',
                                            fontWeight: 700
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="space-y-6">
                            {pieChartStats.pieData.map((role: any) => (
                                <div key={role.name} className="group/item">
                                    <div className="flex justify-between items-end mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${role.bgClass}`} />
                                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{role.name}</span>
                                        </div>
                                        <span className="font-bold text-foreground text-xs">{role.value.toLocaleString()}</span>
                                    </div>
                                    <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                                        <div
                                            className={`${role.bgClass} h-full rounded-full transition-all duration-1000`}
                                            style={{ width: `${pieChartStats.total > 0 ? (role.value / pieChartStats.total) * 100 : 0}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Trade Volume Trend (Line Chart) - Full Width */}
            <div className="card-minimal p-8 flex flex-col group text-left">
                <div className="mb-8 flex justify-between items-start">
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">Commodity Sales Performance</h3>
                        <p className="text-[10px] text-muted-foreground mt-1 font-bold uppercase tracking-widest opacity-60">Comparative yield trends by crop category</p>
                    </div>
                    <Badge variant="outline" className="text-[9px] uppercase tracking-widest font-bold">Seasonal View</Badge>
                </div>

                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={cropTrendData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'var(--muted-foreground)', fontSize: 9, fontWeight: 700 }}
                                dy={15}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'var(--muted-foreground)', fontSize: 9, fontWeight: 700 }}
                            />
                            <RechartsTooltip
                                contentStyle={{
                                    backgroundColor: 'var(--card)',
                                    borderRadius: '8px',
                                    border: '1px solid var(--border)',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                    padding: '12px',
                                    fontSize: '10px',
                                    fontWeight: 700
                                }}
                            />
                            <Legend 
                                verticalAlign="top" 
                                align="right" 
                                iconType="circle"
                                wrapperStyle={{ fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', paddingTop: '0px', paddingBottom: '20px' }}
                            />
                            <Line 
                                type="monotone" 
                                dataKey="Coffee" 
                                stroke="var(--primary)" 
                                strokeWidth={3} 
                                dot={{ fill: 'var(--primary)', r: 4, strokeWidth: 2, stroke: 'var(--card)' }}
                                activeDot={{ r: 6, strokeWidth: 0 }}
                            />
                            <Line 
                                type="monotone" 
                                dataKey="Grains" 
                                stroke="var(--secondary)" 
                                strokeWidth={3} 
                                dot={{ fill: 'var(--secondary)', r: 4, strokeWidth: 2, stroke: 'var(--card)' }}
                                activeDot={{ r: 6, strokeWidth: 0 }}
                            />
                            <Line 
                                type="monotone" 
                                dataKey="Pulses" 
                                stroke="var(--gold)" 
                                strokeWidth={3} 
                                dot={{ fill: 'var(--gold)', r: 4, strokeWidth: 2, stroke: 'var(--card)' }}
                                activeDot={{ r: 6, strokeWidth: 0 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Monthly Income & Payouts Chart */}
            <div className="card-minimal p-8 flex flex-col group text-left">
                <div className="mb-8 flex justify-between items-start">
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">Monthly Revenue Flow</h3>
                        <p className="text-[10px] text-muted-foreground mt-1 font-bold uppercase tracking-widest opacity-60">Platform commission (fee) vs. farmer payouts — ETB thousands</p>
                    </div>
                    <Badge variant="outline" className="text-[9px] uppercase tracking-widest font-bold">Annual View</Badge>
                </div>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={incomeData} barCategoryGap="30%" barGap={4}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'var(--muted-foreground)', fontSize: 9, fontWeight: 700 }}
                                dy={15}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: 'var(--muted-foreground)', fontSize: 9, fontWeight: 700 }}
                                tickFormatter={(v) => `${v}k`}
                            />
                            <RechartsTooltip
                                cursor={{ fill: 'var(--primary)', opacity: 0.04 }}
                                contentStyle={{
                                    backgroundColor: 'var(--card)',
                                    borderRadius: '10px',
                                    border: '1px solid var(--border)',
                                    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                                    padding: '10px 14px',
                                    fontSize: '10px',
                                    fontWeight: 700
                                }}
                                formatter={(value: any, name?: string) => [`ETB ${value}k`, name ?? '']}
                            />
                            <Legend
                                verticalAlign="top"
                                align="right"
                                iconType="circle"
                                wrapperStyle={{ fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', paddingBottom: '20px' }}
                            />
                            <Bar dataKey="Commission" fill="var(--color-primary)" radius={[3, 3, 0, 0]} barSize={16} />
                            <Bar dataKey="Payouts" fill="var(--secondary)" radius={[3, 3, 0, 0]} barSize={16} opacity={0.7} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                {/* Summary Stats */}
                <div className="mt-6 grid grid-cols-3 gap-6 pt-6 border-t border-border/40">
                    <div>
                        <p className="text-[9px] font-extrabold uppercase tracking-widest text-muted-foreground opacity-60 mb-1">Annual Commission Income</p>
                        <p className="text-lg font-extrabold text-primary">ETB {incomeData.reduce((s: number, d: MonthlyIncomePoint) => s + d.Commission, 0).toLocaleString()}k</p>
                        <p className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-widest mt-0.5">Platform fee on orders</p>
                    </div>
                    <div>
                        <p className="text-[9px] font-extrabold uppercase tracking-widest text-muted-foreground opacity-60 mb-1">Total Farmer Payouts</p>
                        <p className="text-lg font-extrabold text-foreground">ETB {incomeData.reduce((s: number, d: MonthlyIncomePoint) => s + d.Payouts, 0).toLocaleString()}k</p>
                        <p className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-widest mt-0.5">Net amount to farmers</p>
                    </div>
                    <div>
                        <p className="text-[9px] font-extrabold uppercase tracking-widest text-muted-foreground opacity-60 mb-1">Avg Commission Rate</p>
                        <p className="text-lg font-extrabold text-foreground">
                            {incomeData.length > 0 && incomeData.reduce((s: number, d: MonthlyIncomePoint) => s + d.Commission, 0) + incomeData.reduce((s: number, d: MonthlyIncomePoint) => s + d.Payouts, 0) > 0 
                                ? Math.round((incomeData.reduce((s: number, d: MonthlyIncomePoint) => s + d.Commission, 0) / (incomeData.reduce((s: number, d: MonthlyIncomePoint) => s + d.Commission, 0) + incomeData.reduce((s: number, d: MonthlyIncomePoint) => s + d.Payouts, 0))) * 1000) / 10
                                : 0}%
                        </p>
                        <p className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-widest mt-0.5">Of gross order value</p>
                    </div>
                </div>
            </div>

            {/* Bottom Status Bar */}
            <div className="pt-8 border-t border-border flex justify-between items-center text-muted-foreground/20 font-bold">
                <p className="text-[10px] uppercase tracking-[0.2em]">Platform Oversight v2.4.0</p>
                <div className="flex gap-4">
                    <div className="w-1 h-1 rounded-full bg-border" />
                    <div className="w-1 h-1 rounded-full bg-border" />
                </div>
            </div>
        </div>
    );
};

