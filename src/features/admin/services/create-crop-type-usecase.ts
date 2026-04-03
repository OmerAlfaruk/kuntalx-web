import type { CropType } from '../types/admin';
import type { AdminRepository } from '../api/admin-repository';

export class CreateCropTypeUseCase {
    private repository: AdminRepository;
    constructor(repository: AdminRepository) {
        this.repository = repository;
    }

    async execute(data: Partial<CropType>): Promise<CropType> {
        return this.repository.createCropType(data);
    }
}
