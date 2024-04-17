import { prefix, unprefixed } from '../vendor.js';

const VALUE = '-1px -1px 1px rgba(0, 0, 0, 0.2) inset';

it('returns prefix', () => {
	expect(prefix('-moz-color')).toBe('-moz-');
	expect(prefix('color')).toBe('');
	expect(prefix(VALUE)).toBe('');
});

it('returns unprefixed version', () => {
	expect(unprefixed('-moz-color')).toBe('color');
	expect(unprefixed('color')).toBe('color');
	expect(unprefixed(VALUE)).toEqual(VALUE);
});
