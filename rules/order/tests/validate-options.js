const { ruleName } = require('..');

testConfig({
	ruleName,
	description: 'valid keywords',
	valid: true,
	config: [
		'custom-properties',
		'dollar-variables',
		'at-variables',
		'declarations',
		'rules',
		'at-rules',
		'less-mixins',
	],
});

testConfig({
	ruleName,
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
			hasBlock: false,
		},
		{
			type: 'at-rule',
		},
	],
});

testConfig({
	ruleName,
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
	ruleName,
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
// 	ruleName,
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
	ruleName,
	description: 'invalid keyword',
	valid: false,
	config: ['custom-property'],
	message: `Invalid option "["custom-property"]" for rule ${ruleName}`,
});

testConfig({
	ruleName,
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
	ruleName,
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
	ruleName,
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
	ruleName,
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
	ruleName,
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
	ruleName,
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
	ruleName,
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
	ruleName,
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
	ruleName,
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
	ruleName,
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
	ruleName,
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
	ruleName,
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
	ruleName,
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

testConfig({
	ruleName,
	description: 'disableFix true',
	valid: true,
	config: [
		['custom-properties', 'dollar-variables'],
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
		['custom-properties', 'dollar-variables'],
		{
			disableFix: false,
		},
	],
});
