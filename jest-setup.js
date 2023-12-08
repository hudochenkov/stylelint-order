const stylelint = require('stylelint');
// eslint-disable-next-line import/no-extraneous-dependencies
const getTestRule = require('jest-preset-stylelint/getTestRule');

global.testRule = getTestRule({ plugins: ['./'] });

global.testConfig = (input) => {
	let testFn;

	if (input.only) {
		testFn = test.only;
	} else if (input.skip) {
		testFn = test.skip;
	} else {
		testFn = test;
	}

	testFn(input.description, () => {
		const config = {
			plugins: ['./'],
			rules: {
				[input.ruleName]: input.config,
			},
		};

		return stylelint
			.lint({
				code: '',
				config,
				quietDeprecationWarnings: true,
			})
			.then((data) => {
				const { invalidOptionWarnings } = data.results[0];

				if (input.valid) {
					expect(invalidOptionWarnings.length).toBe(0);
				} else {
					expect(invalidOptionWarnings[0].text).toBe(input.message);
				}
			});
	});
};
