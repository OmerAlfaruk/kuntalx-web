import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

describe('App test', () => {
    it('renders correctly', () => {
        render(<div>KuntalX Marketplace</div>);
        expect(screen.getByText('KuntalX Marketplace')).toBeInTheDocument();
    });
});
