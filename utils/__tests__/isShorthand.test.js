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

test.each([
	['gap', 'column-gap'],
	['place-content', 'justify-content'],
	['place-items', 'align-items'],
	['place-self', 'justify-self'],
	['contain-intrinsic-size', 'contain-intrinsic-width'],
	['font', 'font-variant-caps'],
	['font-synthesis', 'font-synthesis-weight'],
	['scroll-margin', 'scroll-margin-top'],
	['scroll-padding-inline', 'scroll-padding-inline-end'],
	['text-decoration', 'text-decoration-thickness'],
])('%s is shorthand for %s', (shorthand, longhand) => {
	expect(isShorthand(shorthand, longhand)).toBe(true);
	expect(isShorthand(longhand, shorthand)).toBe(false);
});
