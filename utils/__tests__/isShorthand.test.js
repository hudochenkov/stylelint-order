import { isShorthand } from '../isShorthand.js';

test('margin is shorthand for margin-top', () => {
	expect(isShorthand('margin', 'margin-top')).toBe(true);
});

test('margin-top is not shorthand for margin', () => {
	expect(isShorthand('margin-top', 'margin')).toBe(false);
});

test('margin-block is shorthand for margin-top', () => {
	expect(isShorthand('margin-block', 'margin-top')).toBe(true);
});

test('margin-top is not shorthand for margin-block', () => {
	expect(isShorthand('margin-top', 'margin-block')).toBe(false);
});

test('border-inline is shorthand for border-top-color', () => {
	expect(isShorthand('border-inline', 'border-top-color')).toBe(true);
});

test('border-top-color is not shorthand for border-inline', () => {
	expect(isShorthand('border-top-color', 'border-inline')).toBe(false);
});
