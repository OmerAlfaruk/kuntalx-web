import type { AggregationRepository } from '../api/aggregation-repository';

export class DeleteAggregationUseCase {
  constructor(private repository: AggregationRepository) {}

  async execute(id: string): Promise<void> {
    return this.repository.deleteAggregation(id);
  }
}
