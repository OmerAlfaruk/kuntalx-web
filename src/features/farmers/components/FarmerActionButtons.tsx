import React from 'react';
import { ActionButton } from '../../../shared/components/ActionButton';

interface FarmerActionButtonsProps {
    onRegister: () => void;
    userRole: string;
}

export const FarmerActionButtons: React.FC<FarmerActionButtonsProps> = ({ onRegister, userRole }) => {
    return (
        <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
            {(userRole === 'association_admin' || userRole === 'platform_admin') && (
                <ActionButton onClick={onRegister} icon={<span className="text-lg group-hover:rotate-12 transition-transform">+</span>}>
                    Register Node
                </ActionButton>
            )}
        </div>
    );
};
