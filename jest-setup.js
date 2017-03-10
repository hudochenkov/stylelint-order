'use strict';

const _ = require('lodash');
const stylelint = require('stylelint');

global.testRule = (rule, schema) => {
	describe(schema.ruleName, () => {
		const stylelintConfig = {
			plugins: [
				'./',
			],
			rules: {
				[schema.ruleName]: schema.config,
			},
		};

		if (schema.accept && schema.accept.length) {
			describe('accept', () => {
				schema.accept.forEach((testCase) => {
					const spec = (testCase.only) ? it.only : it;

					spec(testCase.description || 'no description', () => {
						return stylelint.lint({
							code: testCase.code,
							config: stylelintConfig,
							syntax: schema.syntax,
						}).then((output) => {
							expect(output.results[0].warnings).toEqual([]);
						});
					});
				});
			});
		}

		if (schema.reject && schema.reject.length) {
			describe('reject', () => {
				schema.reject.forEach((testCase) => {
					const spec = (testCase.only) ? it.only : it;

					spec(testCase.description || 'no description', () => {
						return stylelint.lint({
							code: testCase.code,
							config: stylelintConfig,
							syntax: schema.syntax,
						}).then((output) => {
							const warnings = output.results[0].warnings;
							const warning = warnings[0];

							expect(warnings.length).toBeGreaterThanOrEqual(1);

							if (testCase.message !== undefined) {
								expect(_.get(warning, 'text')).toBe(testCase.message);
							}
							if (testCase.line !== undefined) {
								expect(_.get(warning, 'line')).toBe(testCase.line);
							}
							if (testCase.column !== undefined) {
								expect(_.get(warning, 'column')).toBe(testCase.column);
							}
						});
					});
				});
			});
		}
	});
};

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
			plugins: [
				'./',
			],
			rules: {
				[input.ruleName]: input.config,
			},
		};

		return stylelint.lint({
			code: '',
			config,
		}).then(function (data) {
			const invalidOptionWarnings = data.results[0].invalidOptionWarnings;

			if (input.valid) {
				expect(invalidOptionWarnings.length).toBe(0);
			} else {
				expect(invalidOptionWarnings[0].text).toBe(input.message);
			}
		});
	});
};
