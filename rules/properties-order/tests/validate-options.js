const { ruleName } = require('..');

testConfig({
	ruleName,
	description: 'valid groups with emptyLineBefore: "always"',
	valid: true,
	config: [
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
	],
});

testConfig({
	ruleName,
	description: 'valid group and declaration',
	valid: true,
	config: [
		'height',
		'width',
		{
			emptyLineBefore: 'always',
			order: 'strict',
			properties: ['display'],
		},
	],
});

testConfig({
	ruleName,
	description: 'valid groups (one without emptyLineBefore)',
	valid: true,
	config: [
		{
			properties: ['display'],
		},
		{
			emptyLineBefore: 'always',
			order: 'strict',
			properties: ['border'],
		},
	],
});

testConfig({
	ruleName,
	description: 'empty properties',
	valid: true,
	config: [
		{
			emptyLineBefore: 'always',
			properties: [],
		},
	],
});

testConfig({
	ruleName,
	description: 'noEmptyLineBetween',
	valid: true,
	config: [
		{
			emptyLineBefore: 'always',
			noEmptyLineBetween: true,
			properties: [],
		},
	],
});

testConfig({
	ruleName,
	description: 'invalid noEmptyLineBetween',
	valid: false,
	config: [
		{
			noEmptyLineBetween: 'true',
			properties: [],
		},
	],
	message: `Invalid option "[{"noEmptyLineBetween":"true","properties":[]}]" for rule ${ruleName}`,
});

testConfig({
	ruleName,
	description: 'invalid emptyLineBefore',
	valid: false,
	config: [
		{
			emptyLineBefore: true,
			order: 'flexible',
			properties: ['border-bottom', 'font-style'],
		},
	],
	message: `Invalid option "[{"emptyLineBefore":true,"order":"flexible","properties":["border-bottom","font-style"]}]" for rule ${ruleName}`,
});

testConfig({
	ruleName,
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

testConfig({
	ruleName,
	description: 'disableFix true',
	valid: true,
	config: [
		['height', 'width'],
		{
			disableFix: true,
		},
	],
});

testConfig({
	ruleName,
	description: 'disableFix false',
	valid: true,
	config: [
		['height', 'width'],
		{
			disableFix: false,
		},
	],
});
