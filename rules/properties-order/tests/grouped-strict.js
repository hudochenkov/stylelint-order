const rule = require('..');

const { ruleName, messages } = rule;

testRule(rule, {
	ruleName,
	config: [
		[
			'height',
			'width',
			{
				properties: ['color', 'font-size', 'font-weight'],
			},
		],
	],

	accept: [
		{
			code: 'a { background: orange; height: 10px; }',
			description: 'unspecified before groupless specified',
		},
		{
			code: 'a { background: orange; font-weight: bold; }',
			description: 'unspecified before grouped specified',
		},
	],
});

// Also test with groupName
testRule(rule, {
	ruleName,
	config: [
		[
			{
				groupName: 'font',
				properties: ['font-size', 'font-weight'],
			},
			'height',
			'width',
		],
	],

	accept: [
		{
			code: 'a { font-size: 2px; font-weight: bold; height: 1px; width: 2px; }',
		},
	],
	reject: [
		{
			code: 'a { height: 1px; font-weight: bold; }',
			message: messages.expected('font-weight', 'height', 'font'),
			line: 1,
			column: 18,
		},
		{
			code: 'a { font-weight: bold; font-size: 2px; height: 1px; }',
			message: messages.expected('font-size', 'font-weight', 'font'),
			line: 1,
			column: 24,
		},
	],
});

testRule(rule, {
	ruleName,
	config: [
		[
			'height',
			'width',
			{
				properties: ['color', 'font-size', 'font-weight'],
			},
		],
	],
	fix: true,

	accept: [
		{
			code: 'a { height: 1px; width: 2px; color: pink; font-size: 2px; font-weight: bold; }',
		},
		{
			code: 'a { height: 10px; background: orange; }',
			description: 'unspecified after groupless specified',
		},
		{
			code: 'a { font-weight: bold; background: orange; }',
			description: 'unspecified after grouped specified',
		},
	],

	reject: [
		{
			code: 'a { width: 2px; color: pink; font-size: 2px; font-weight: bold; height: 1px; }',
			fixed: 'a { height: 1px; width: 2px; color: pink; font-size: 2px; font-weight: bold; }',
			message: messages.expected('height', 'font-weight'),
		},
		{
			code: 'a { height: 1px; color: pink; width: 2px; font-size: 2px; font-weight: bold; }',
			fixed: 'a { height: 1px; width: 2px; color: pink; font-size: 2px; font-weight: bold; }',
			message: messages.expected('width', 'color'),
		},
		{
			code: 'a { height: 1px; width: 2px; font-size: 2px; color: pink; font-weight: bold; }',
			fixed: 'a { height: 1px; width: 2px; color: pink; font-size: 2px; font-weight: bold; }',
			message: messages.expected('color', 'font-size'),
		},
		{
			code: 'a { height: 1px; width: 2px; font-size: 2px; font-weight: bold; color: pink; }',
			fixed: 'a { height: 1px; width: 2px; color: pink; font-size: 2px; font-weight: bold; }',
			message: messages.expected('color', 'font-weight'),
		},
		{
			code: 'a { height: 1px; width: 2px; color: pink; font-weight: bold; font-size: 2px; }',
			fixed: 'a { height: 1px; width: 2px; color: pink; font-size: 2px; font-weight: bold; }',
			message: messages.expected('font-size', 'font-weight'),
		},
	],
});

testRule(rule, {
	ruleName,
	config: [
		[
			{
				properties: ['width', 'height'],
			},
			{
				properties: ['color', 'font-size', 'font-weight'],
			},
		],
	],
	fix: true,

	accept: [
		{
			code: 'a { width: 2px; height: 1px; color: pink; font-size: 2px; font-weight: bold; }',
		},
	],

	reject: [
		{
			code: 'a { width: 2px; color: pink; font-size: 2px; font-weight: bold; height: 1px; }',
			fixed: 'a { width: 2px; height: 1px; color: pink; font-size: 2px; font-weight: bold; }',
			message: messages.expected('height', 'font-weight'),
		},
		{
			code: 'a { height: 1px; color: pink; width: 2px; font-size: 2px; font-weight: bold; }',
			fixed: 'a { width: 2px; height: 1px; color: pink; font-size: 2px; font-weight: bold; }',
			message: messages.expected('width', 'color'),
		},
		{
			code: 'a { width: 2px; height: 1px; font-size: 2px; color: pink; font-weight: bold; }',
			fixed: 'a { width: 2px; height: 1px; color: pink; font-size: 2px; font-weight: bold; }',
			message: messages.expected('color', 'font-size'),
		},
		{
			code: 'a { width: 2px; height: 1px; font-size: 2px; font-weight: bold; color: pink; }',
			fixed: 'a { width: 2px; height: 1px; color: pink; font-size: 2px; font-weight: bold; }',
			message: messages.expected('color', 'font-weight'),
		},
		{
			code: 'a { width: 2px; height: 1px; color: pink; font-weight: bold; font-size: 2px; }',
			fixed: 'a { width: 2px; height: 1px; color: pink; font-size: 2px; font-weight: bold; }',
			message: messages.expected('font-size', 'font-weight'),
		},
	],
});
