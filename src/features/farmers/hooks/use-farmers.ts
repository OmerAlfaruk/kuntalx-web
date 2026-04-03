import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../lib/api-client';

export interface Farmer {
    id: string; // The user ID or profile ID
    name: string;
    phone: string;
    region: string;
    woreda: string;
    farmSize: number;
    capacity: number;
    cbeAccountNumber?: string;
    status: 'active' | 'suspended' | 'pending';
    joinDate: string;
}

export const useFarmers = (keyword?: string) => {
    return useQuery<Farmer[]>({
        queryKey: ['farmers', keyword],
        queryFn: async () => {
            try {
                // For association admins (or platform admins), fetch users with role 'farmer'
                const params = new URLSearchParams();
                params.append('role', 'farmer');
                if (keyword) {
                    params.append('keyword', keyword);
                }

                const response = await apiClient.get<any[]>(`/users?${params.toString()}`);

                return response.map(mapBackendFarmerToFrontend);
            } catch (error) {
                console.error("Failed to fetch farmers:", error);
                return [];
            }
        },
    });
};

export const useFarmerDetail = (id?: string) => {
    return useQuery<Farmer | null>({
        queryKey: ['farmer', id],
        queryFn: async () => {
            if (!id) return null;

            try {
                const response = await apiClient.get<any>(`/users/${id}`);
                return mapBackendFarmerToFrontend(response);
            } catch (error) {
                console.error("Failed to fetch farmer details:", error);
                return null;
            }
        },
        enabled: !!id,
    });
};

function mapBackendFarmerToFrontend(backendUser: any): Farmer {
    // The backend `User` entity has a nested `farmer_profile` if they are a farmer.
    const profile = backendUser.farmer_profile || {};

    return {
        id: backendUser.id,
        name: backendUser.full_name || 'Unnamed Farmer',
        phone: backendUser.phone || 'N/A',
        region: profile.region || 'Unknown Region',
        woreda: profile.woreda || 'Unknown Woreda',
        farmSize: profile.farm_size_hectares || 0,
        capacity: profile.expected_yield_kuntal || 0,
        cbeAccountNumber: profile.cbe_account_number || '',
        status: backendUser.is_active ? 'active' : 'suspended',
        joinDate: backendUser.created_at ? new Date(backendUser.created_at).toISOString() : new Date().toISOString()
    };
}
