import type { Aggregation } from "../../aggregations/types/aggregation";

export interface AssociationMinimal {
    id: string;
    name: string;
    description: string;
    region: string;
}

export interface SearchResult {
    aggregations: Aggregation[];
    associations: AssociationMinimal[];
}
