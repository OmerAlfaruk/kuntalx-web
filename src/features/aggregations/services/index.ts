import type { Aggregation, AggregationItem, CropType } from '../types/aggregation';
import type { AggregationRepository } from '../api/aggregation-repository';

export class GetOpenAggregationsUseCase {
  private repository: AggregationRepository;

  constructor(repository: AggregationRepository) {
    this.repository = repository;
  }

  async execute(params?: {
    skip?: number;
    limit?: number;
    cropTypeId?: string;
    minQuantity?: number;
    keyword?: string;
    region?: string;
  }): Promise<Aggregation[]> {
    return this.repository.getOpenAggregations(params);
  }
}

export class GetAggregationDetailUseCase {
  private repository: AggregationRepository;

  constructor(repository: AggregationRepository) {
    this.repository = repository;
  }

  async execute(id: string): Promise<Aggregation> {
    return this.repository.getAggregationDetail(id);
  }
}

export class CreateAggregationUseCase {
  private repository: AggregationRepository;

  constructor(repository: AggregationRepository) {
    this.repository = repository;
  }

  async execute(aggregation: Omit<Aggregation, 'id' | 'createdAt' | 'updatedAt' | 'items'>): Promise<Aggregation> {
    return this.repository.createAggregation(aggregation);
  }
}

export class ContributeToAggregationUseCase {
  private repository: AggregationRepository;

  constructor(repository: AggregationRepository) {
    this.repository = repository;
  }

  async execute(aggregationId: string, item: Omit<AggregationItem, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'farmerName'>): Promise<AggregationItem> {
    return this.repository.contributeToAggregation(aggregationId, item);
  }
}

export class UpdateAggregationStatusUseCase {
  private repository: AggregationRepository;

  constructor(repository: AggregationRepository) {
    this.repository = repository;
  }

  async execute(id: string, status: Aggregation['status']): Promise<Aggregation> {
    return this.repository.updateAggregationStatus(id, status);
  }
}

export class VerifyAggregationItemUseCase {
  private repository: AggregationRepository;

  constructor(repository: AggregationRepository) {
    this.repository = repository;
  }

  async execute(
    aggregationId: string,
    itemId: string,
    verifiedQuantity: number,
    qualityGrade: NonNullable<AggregationItem['qualityGrade']>,
    notes?: string
  ): Promise<AggregationItem> {
    return this.repository.verifyAggregationItem(aggregationId, itemId, verifiedQuantity, qualityGrade, notes);
  }
}

export class UpdateAggregationItemStatusUseCase {
  private repository: AggregationRepository;

  constructor(repository: AggregationRepository) {
    this.repository = repository;
  }

  async execute(
    aggregationId: string,
    itemId: string,
    status: AggregationItem['status'],
    notes?: string
  ): Promise<AggregationItem> {
    return this.repository.updateAggregationItemStatus(aggregationId, itemId, status, notes);
  }
}

export class GetMyAggregationsUseCase {
  private repository: AggregationRepository;

  constructor(repository: AggregationRepository) {
    this.repository = repository;
  }

  async execute(params?: { skip?: number; limit?: number }): Promise<Aggregation[]> {
    return this.repository.getMyAggregations(params);
  }
}

export class GetAssociationAggregationsUseCase {
  private repository: AggregationRepository;

  constructor(repository: AggregationRepository) {
    this.repository = repository;
  }

  async execute(associationId: string, params?: { skip?: number; limit?: number }): Promise<Aggregation[]> {
    return this.repository.getAssociationAggregations(associationId, params);
  }
}

export class GetCropTypesUseCase {
  private repository: AggregationRepository;

  constructor(repository: AggregationRepository) {
    this.repository = repository;
  }

  async execute(): Promise<CropType[]> {
    return this.repository.getCropTypes();
  }
}

export * from './delete-aggregation-usecase';