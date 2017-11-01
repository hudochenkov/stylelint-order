const createFlatOrder = require('../createFlatOrder');

describe('createFlatOrder', () => {
	it('valid group and declaration', () => {
		const config = [
			'height',
			'width',
			{
				emptyLineBefore: 'always',
				order: 'strict',
				properties: ['display'],
			},
		];

		const expected = ['height', 'width', 'display'];

		expect(createFlatOrder(config)).toEqual(expected);
	});

	it('valid groups with emptyLineBefore', () => {
		const config = [
			{
				emptyLineBefore: 'always',
				order: 'flexible',
				properties: ['border-bottom', 'font-style'],
			},
			{
				emptyLineBefore: 'never',
				order: 'strict',
				properties: ['position'],
			},
			{
				emptyLineBefore: 'always',
				order: 'strict',
				properties: ['display'],
			},
		];

		const expected = ['border-bottom', 'font-style', 'position', 'display'];

		expect(createFlatOrder(config)).toEqual(expected);
	});

	it('valid groups (one without emptyLineBefore)', () => {
		const config = [
			{
				properties: ['display'],
			},
			{
				emptyLineBefore: 'always',
				order: 'strict',
				properties: ['border'],
			},
		];

		const expected = ['display', 'border'];

		expect(createFlatOrder(config)).toEqual(expected);
	});

	it('empty properties', () => {
		const config = [
			{
				emptyLineBefore: 'always',
				properties: [],
			},
		];

		const expected = [];

		expect(createFlatOrder(config)).toEqual(expected);
	});
});
