import type { CropType } from '../types/admin';
import type { AdminRepository } from '../api/admin-repository';

export class GetCropTypesUseCase {
    private repository: AdminRepository;
    constructor(repository: AdminRepository) {
        this.repository = repository;
    }

    async execute(): Promise<CropType[]> {
        return this.repository.getCropTypes();
    }
}
