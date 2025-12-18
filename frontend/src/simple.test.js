import { describe, it, expect } from 'vitest';

describe('Simple Calculation', () => {
    it('adds two numbers', () => {
        expect(1 + 1).toBe(2);
    });

    it('handles zero correctly', () => {
        const calculateConversion = (part, total) => {
            if (total === 0) return 0;
            return (part / total) * 100;
        };

        expect(calculateConversion(0, 0)).toBe(0);
        expect(calculateConversion(50, 100)).toBe(50);
    });
});
