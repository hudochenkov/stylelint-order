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
	description: 'valid groups with emptyLineBefore: "always"',
	valid: true,
	config: [
		{
			emptyLineBefore: 'always',
			order: 'flexible',
			properties: [
				'border-bottom',
				'font-style',
			],
		},
		{
			emptyLineBefore: 'never',
			order: 'strict',
			properties: [
				'position',
			],
		},
		{
			emptyLineBefore: 'always',
			order: 'strict',
			properties: [
				'display',
			],
		},
	],
});

testConfig({
	description: 'valid group and declaration',
	valid: true,
	config: [
		'height',
		'width',
		{
			emptyLineBefore: 'always',
			order: 'strict',
			properties: [
				'display',
			],
		},
	],
});

testConfig({
	description: 'valid groups (one without emptyLineBefore)',
	valid: true,
	config: [
		{
			properties: [
				'display',
			],
		},
		{
			emptyLineBefore: 'always',
			order: 'strict',
			properties: [
				'border',
			],
		},
	],
});

testConfig({
	description: 'empty properties',
	valid: true,
	config: [
		{
			emptyLineBefore: 'always',
			properties: [
			],
		},
	],
});

testConfig({
	description: 'invalid emptyLineBefore',
	valid: false,
	config: [
		{
			emptyLineBefore: true,
			order: 'flexible',
			properties: [
				'border-bottom',
				'font-style',
			],
		},
	],
	message: `Invalid option "[{"emptyLineBefore":true,"order":"flexible","properties":["border-bottom","font-style"]}]" for rule ${ruleName}`,
});

testConfig({
	description: 'properties should be an array',
	valid: false,
	config: [
		{
			emptyLineBefore: 'always',
			order: 'flexible',
			properties: null,
		},
	],
	message: `Invalid option "[{"emptyLineBefore":"always","order":"flexible","properties":null}]" for rule ${ruleName}`,
});
