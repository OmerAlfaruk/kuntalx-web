import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../lib/api-client';

export interface MarketTickerItem {
    name: string;
    change: number;
    isUp: boolean;
}

export interface RegionalActivity {
    name: string;
    region: string;
    volume: number;
    status: string;
    hubId: string;
}

// Unified stats object - covers all roles, optional fields per role
export interface DashboardStats {
    // Platform Admin / General
    totalFarmers: number;
    totalBuyers: number;
    activeAggregations: number;
    totalAssociations: number;
    totalOrders: number;
    pendingOrders: number;
    totalSalesVolume: number;
    pendingPayouts: number;
    totalFarmersTrend?: number;
    totalBuyersTrend?: number;
    totalAssociationsTrend?: number;
    totalSalesVolumeTrend?: number;
    aggregationsByStatus: Record<string, number>;
    regionalActivity: RegionalActivity[];

    // Association Admin specific
    associationName?: string;
    myMembersCount?: number;
    myAggregationsCount?: number;
    pendingMembershipRequests?: number;
    totalMonthlyVolumeKuntal?: number;

    // Buyer specific
    myActiveOrdersCount?: number;
    totalVolumeKuntal?: number;
    availableAggregationsCount?: number;
    totalSpentAmount?: number;
    averageOrderValue?: number;
    totalMarketplaceValue?: number;
    completedOrdersCount?: number;
}

const mapAdminStats = (data: any): DashboardStats => ({
    totalFarmers: data.total_farmers || 0,
    totalBuyers: data.total_buyers || 0,
    activeAggregations: data.active_aggregations || 0,
    totalAssociations: data.total_associations || 0,
    totalOrders: data.total_orders || 0,
    pendingOrders: data.pending_orders || 0,
    totalSalesVolume: data.total_sales_volume || 0,
    pendingPayouts: data.pending_payouts || 0,
    totalFarmersTrend: data.total_farmers_trend || 0,
    totalBuyersTrend: data.total_buyers_trend || 0,
    totalAssociationsTrend: data.total_associations_trend || 0,
    totalSalesVolumeTrend: data.total_sales_volume_trend || 0,
    aggregationsByStatus: data.aggregations_by_status || {},
    regionalActivity: (data.regional_activity || []).map((ra: any) => ({
        name: ra.name,
        region: ra.region,
        volume: ra.volume,
        status: ra.status,
        hubId: ra.hub_id,
    })),
});

const mapAssociationAdminStats = (data: any): DashboardStats => ({
    totalFarmers: data.total_members_count || 0,
    totalBuyers: 0,
    activeAggregations: data.active_aggregations_count || 0,
    totalAssociations: 1,
    totalOrders: 0,
    pendingOrders: data.pending_orders_count || 0,
    totalSalesVolume: data.total_sales_volume || 0,
    pendingPayouts: 0,
    aggregationsByStatus: data.aggregations_by_status || {},
    regionalActivity: [],
    associationName: data.association_name,
    myMembersCount: data.total_members_count || 0,
    myAggregationsCount: data.total_aggregations_count || 0,
    pendingMembershipRequests: data.pending_membership_requests_count || 0,
    totalMonthlyVolumeKuntal: data.total_monthly_volume_kuntal || 0,
});

const mapBuyerStats = (data: any): DashboardStats => ({
    totalFarmers: 0,
    totalBuyers: 0,
    activeAggregations: data.available_aggregations_count || 0,
    totalAssociations: 0,
    totalOrders: data.total_orders_count || 0,
    pendingOrders: data.pending_orders_count || 0,
    totalSalesVolume: data.total_spent_amount || 0,
    pendingPayouts: data.total_unpaid_amount || 0,
    aggregationsByStatus: {},
    regionalActivity: (data.regional_activity || []).map((ra: any) => ({
        name: ra.name,
        region: ra.region,
        volume: ra.volume,
        status: ra.status,
        hubId: ra.hub_id,
    })),
    myActiveOrdersCount: data.active_orders_count || 0,
    totalVolumeKuntal: data.total_volume_purchased_kuntal || 0,
    availableAggregationsCount: data.available_aggregations_count || 0,
    totalSpentAmount: data.total_spent_amount || 0,
    averageOrderValue: data.average_order_value || 0,
    totalMarketplaceValue: data.total_marketplace_value || 0,
    completedOrdersCount: data.completed_orders_count || 0,
});

const mapFarmerStats = (data: any): DashboardStats => ({
    totalFarmers: 0,
    totalBuyers: 0,
    activeAggregations: data.active_aggregations_count || 0,
    totalAssociations: data.association_name ? 1 : 0,
    totalOrders: 0,
    pendingOrders: 0, // not in FarmerDashboardStats
    totalSalesVolume: data.total_volume_sold_kuntal || 0, 
    pendingPayouts: data.pending_payouts_amount || 0,
    aggregationsByStatus: {},
    regionalActivity: (data.regional_activity || []).map((ra: any) => ({
        name: ra.name,
        region: ra.region,
        volume: ra.volume,
        status: ra.status,
        hubId: ra.hub_id,
    })),
    associationName: data.association_name,
    myAggregationsCount: data.active_aggregations_count || 0,
    totalMonthlyVolumeKuntal: data.total_contributed_kuntal || 0,
    completedOrdersCount: data.completed_payouts_amount || 0, // Using completed payouts as indicator
});

export const useDashboardStats = (role: string, days?: number) => {
    return useQuery<DashboardStats>({
        queryKey: ['dashboard-stats', role, days],
        queryFn: async () => {
            const config = days ? { params: { days } } : {};

            if (role === 'platform_admin') {
                const data = await apiClient.get<any>('/admin/stats', config);
                return mapAdminStats(data);
            } else if (role === 'association_admin') {
                const data = await apiClient.get<any>('/users/me/dashboard', config);
                return mapAssociationAdminStats(data);
            } else if (role === 'farmer') {
                const data = await apiClient.get<any>('/users/me/dashboard', config);
                return mapFarmerStats(data);
            } else {
                // buyer or other roles
                const data = await apiClient.get<any>('/users/me/dashboard', config);
                return mapBuyerStats(data);
            }
        },
        enabled: !!role,
        refetchInterval: 30000,
    });
};

export const useMarketTicker = () => {
    return useQuery<MarketTickerItem[]>({
        queryKey: ['market-ticker'],
        queryFn: async () => {
            const data = await apiClient.get<any[]>('/market/ticker');
            return data.map(item => ({
                name: item.name,
                change: item.change,
                isUp: item.is_up
            }));
        },
        refetchInterval: 10000,
    });
};

export interface ActiveVehicleLocation {
    latitude: number;
    longitude: number;
    speed?: number;
    heading?: number;
    address?: string;
    city?: string;
    deviceTimestamp: string;
}

export interface ActiveFleetVehicle {
    shipmentVehicleId: string;
    vehicleNumber: string;
    driverName?: string;
    driverPhone?: string;
    location?: ActiveVehicleLocation;
    shipmentId: string;
    shipmentStatus: string;
    cargoType: string;
    cargoQuantity: number;
    originAssociation: string;
    destinationBuyer: string;
}

export interface ActiveFleetResponse {
    vehicles: ActiveFleetVehicle[];
    activeCount: number;
}

export const useActiveFleet = () => {
    return useQuery<ActiveFleetResponse>({
        queryKey: ['active-fleet'],
        queryFn: async () => {
            const data = await apiClient.get<any>('/admin/fleet/active');
            return {
                vehicles: (data.vehicles || []).map((v: any) => ({
                    shipmentVehicleId: v.shipment_vehicle_id,
                    vehicleNumber: v.vehicle_number,
                    driverName: v.driver_name,
                    driverPhone: v.driver_phone,
                    location: v.location ? {
                        latitude: v.location.latitude,
                        longitude: v.location.longitude,
                        speed: v.location.speed,
                        heading: v.location.heading,
                        address: v.location.address,
                        city: v.location.city,
                        deviceTimestamp: v.location.device_timestamp,
                    } : undefined,
                    shipmentId: v.shipment_id,
                    shipmentStatus: v.shipment_status,
                    cargoType: v.cargo_type,
                    cargoQuantity: v.cargo_quantity,
                    originAssociation: v.origin_association,
                    destinationBuyer: v.destination_buyer,
                })),
                activeCount: data.active_count || 0,
            };
        },
        refetchInterval: 10000,
    });
};

export interface MonthlyIncomePoint {
    name: string;        // month name e.g. "Jan"
    Commission: number;  // platform fee_amount earned
    Payouts: number;     // total farmer payouts
}

export const useMonthlyIncome = () => {
    return useQuery<MonthlyIncomePoint[]>({
        queryKey: ['monthly-income'],
        queryFn: async () => {
            const raw = await apiClient.get<Array<{ month: string; commission: number; payouts: number }>>(
                '/admin/analytics/monthly-income'
            );
            return raw.map((d) => ({
                name: d.month,
                Commission: d.commission,
                Payouts: d.payouts,
            }));
        },
        staleTime: 5 * 60 * 1000,
    });
};
