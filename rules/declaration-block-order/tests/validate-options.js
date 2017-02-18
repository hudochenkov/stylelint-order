'use strict';

const stylelint = require('stylelint');
const test = require('ava');
const ruleName = require('..').ruleName;

function testConfig(input) {
	let testFn;

	if (input.only) {
		testFn = test.only;
	} else if (input.skip) {
		testFn = test.skip;
	} else if (input.failing) {
		testFn = test.failing;
	} else {
		testFn = test;
	}

	testFn(input.description, (t) => {
		const config = {
			plugins: [
				'./',
			],
			rules: {
				[ruleName]: input.config,
			},
		};

		return stylelint.lint({
			code: '',
			config,
		}).then(function (data) {
			const invalidOptionWarnings = data.results[0].invalidOptionWarnings;

			if (input.valid) {
				t.is(invalidOptionWarnings.length, 0);
			} else {
				t.is(
					invalidOptionWarnings[0].text,
					input.message
				);
			}
		});
	});
}

testConfig({
	description: 'valid keywords',
	valid: true,
	config: [
		'custom-properties',
		'dollar-variables',
		'at-variables',
		'declarations',
		'rules',
		'at-rules',
	],
});

testConfig({
	description: 'valid at-rules variants',
	valid: true,
	config: [
		{
			type: 'at-rule',
			name: 'include',
			hasBlock: true,
		},
		{
			type: 'at-rule',
			name: 'include',
		},
		{
			type: 'at-rule',
			hasBlock: true,
		},
		{
			type: 'at-rule',
		},
	],
});

testConfig({
	description: 'valid rules variants',
	valid: true,
	config: [
		{
			type: 'rule',
			selector: /^&:\w/,
		},
		{
			type: 'rule',
			selector: '^&:\\w',
		},
		{
			type: 'rule',
		},
	],
});

testConfig({
	description: 'valid keyword with at-rule variant (keyword last)',
	valid: true,
	config: [
		{
			type: 'at-rule',
		},
		'declarations',
	],
});

// testConfig({
// 	description: 'valid keyword with at-rule variant (keyword first)',
// 	valid: true,
// 	failing: true,
// 	config: [
// 		'declarations',
// 		{
// 			type: 'at-rule',
// 		},
// 	],
// });

testConfig({
	description: 'invalid keyword',
	valid: false,
	config: [
		'custom-property',
	],
	message: `Invalid option "["custom-property"]" for rule ${ruleName}`,
});

testConfig({
	description: 'invalid at-rule type',
	valid: false,
	config: [
		{
			type: 'atrule',
		},
	],
	message: `Invalid option "[{"type":"atrule"}]" for rule ${ruleName}`,
});

testConfig({
	description: 'invalid hasBlock property',
	valid: false,
	config: [
		{
			type: 'at-rule',
			hasBlock: 'yes',
		},
	],
	message: `Invalid option "[{"type":"at-rule","hasBlock":"yes"}]" for rule ${ruleName}`,
});

testConfig({
	description: 'invalid name property',
	valid: false,
	config: [
		{
			type: 'at-rule',
			name: '',
		},
	],
	message: `Invalid option "[{"type":"at-rule","name":""}]" for rule ${ruleName}`,
});

testConfig({
	description: 'invalid name property with hasBlock defined',
	valid: false,
	config: [
		{
			type: 'at-rule',
			hasBlock: true,
			name: '',
		},
	],
	message: `Invalid option "[{"type":"at-rule","hasBlock":true,"name":""}]" for rule ${ruleName}`,
});

testConfig({
	description: 'valid parameter (string) and name',
	valid: true,
	config: [
		{
			type: 'at-rule',
			name: 'include',
			parameter: 'media',
		},
	],
});

testConfig({
	description: 'valid parameter (RegExp) and name',
	valid: true,
	config: [
		{
			type: 'at-rule',
			name: 'include',
			parameter: /$media/,
		},
	],
});

testConfig({
	description: 'invalid. parameter is empty',
	valid: false,
	config: [
		{
			type: 'at-rule',
			name: 'include',
			parameter: '',
		},
	],
	message: `Invalid option "[{"type":"at-rule","name":"include","parameter":""}]" for rule ${ruleName}`,
});

testConfig({
	description: 'invalid. parameter is not a string',
	valid: false,
	config: [
		{
			type: 'at-rule',
			name: 'include',
			parameter: null,
		},
	],
	message: `Invalid option "[{"type":"at-rule","name":"include","parameter":null}]" for rule ${ruleName}`,
});

testConfig({
	description: 'invalid. parameter without "name" property',
	valid: false,
	config: [
		{
			type: 'at-rule',
			parameter: 'media',
		},
	],
	message: `Invalid option "[{"type":"at-rule","parameter":"media"}]" for rule ${ruleName}`,
});

testConfig({
	description: 'valid selector (string)',
	valid: true,
	config: [
		{
			type: 'rule',
			selector: '^&:hover',
		},
	],
});

testConfig({
	description: 'valid selector (RegExp)',
	valid: true,
	config: [
		{
			type: 'rule',
			selector: /^&:\w/,
		},
	],
});

testConfig({
	description: 'invalid. selector is empty',
	valid: false,
	config: [
		{
			type: 'rule',
			selector: '',
		},
	],
	message: `Invalid option "[{"type":"rule","selector":""}]" for rule ${ruleName}`,
});

testConfig({
	description: 'invalid. selector is not a string',
	valid: false,
	config: [
		{
			type: 'rule',
			selector: null,
		},
	],
	message: `Invalid option "[{"type":"rule","selector":null}]" for rule ${ruleName}`,
});
