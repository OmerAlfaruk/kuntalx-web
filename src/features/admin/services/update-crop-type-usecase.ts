import type { CropType } from '../types/admin';
import type { AdminRepository } from '../api/admin-repository';

export class UpdateCropTypeUseCase {
    private repository: AdminRepository;
    constructor(repository: AdminRepository) {
        this.repository = repository;
    }

    async execute(id: string, data: Partial<CropType>): Promise<CropType> {
        return this.repository.updateCropType(id, data);
    }
}
