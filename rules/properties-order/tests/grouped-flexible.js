const rule = require('..');

const { ruleName, messages } = rule;

testRule(rule, {
	ruleName,
	config: [
		[
			'height',
			'width',
			{
				order: 'flexible',
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
			code: 'a { height: 1px; width: 2px; font-size: 2px; color: pink; font-weight: bold; }',
		},
		{
			code: 'a { height: 1px; width: 2px; font-size: 2px; font-weight: bold; color: pink; }',
		},
		{
			code: 'a { height: 1px; width: 2px; font-weight: bold; font-size: 2px; color: pink; }',
		},
		{
			code: 'a { height: 10px; background: orange; }',
			description: 'unspecified after groupless specified',
		},
		{
			code: 'a { font-weight: bold; background: orange; }',
			description: 'unspecified after grouped specified',
		},
		{
			code: 'a { background: orange; height: 10px; }',
			description: 'unspecified before groupless specified',
		},
		{
			code: 'a { background: orange; font-weight: bold; }',
			description: 'unspecified before grouped specified',
		},
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
			code: 'a { height: 1px; font-weight: bold; width: 2px; }',
			fixed: 'a { height: 1px; width: 2px; font-weight: bold; }',
			message: messages.expected('width', 'font-weight'),
			line: 1,
			column: 37,
		},
		{
			code: 'a { font-weight: bold; height: 1px; width: 2px; }',
			fixed: 'a { height: 1px; width: 2px; font-weight: bold; }',
			message: messages.expected('height', 'font-weight'),
			line: 1,
			column: 24,
		},
		{
			code: 'a { width: 2px; height: 1px; font-weight: bold; }',
			fixed: 'a { height: 1px; width: 2px; font-weight: bold; }',
			message: messages.expected('height', 'width'),
			line: 1,
			column: 17,
		},
		{
			code: 'a { height: 1px; color: pink; width: 2px; font-weight: bold; }',
			fixed: 'a { height: 1px; width: 2px; color: pink; font-weight: bold; }',
			message: messages.expected('width', 'color'),
			line: 1,
			column: 31,
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
				order: 'flexible',
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
	],
});

testRule(rule, {
	ruleName,
	config: [
		[
			{
				order: 'flexible',
				properties: ['width', 'height'],
			},
			{
				order: 'flexible',
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
			code: 'a { width: 2px; height: 1px; font-size: 2px; color: pink; font-weight: bold; }',
		},
		{
			code: 'a { height: 1px; width: 2px; font-size: 2px; font-weight: bold; color: pink; }',
		},
		{
			code: 'a { width: 2px; height: 1px; font-weight: bold; font-size: 2px; color: pink; }',
		},
	],

	reject: [
		{
			code: 'a { height: 1px; font-weight: bold; width: 2px; }',
			fixed: 'a { width: 2px; height: 1px; font-weight: bold; }',
			message: messages.expected('width', 'font-weight'),
			line: 1,
			column: 37,
		},
		{
			code: 'a { font-weight: bold; height: 1px; width: 2px; }',
			fixed: 'a { width: 2px; height: 1px; font-weight: bold; }',
			message: messages.expected('height', 'font-weight'),
			line: 1,
			column: 24,
		},
		{
			code: 'a { height: 1px; color: pink; width: 2px; font-weight: bold; }',
			fixed: 'a { width: 2px; height: 1px; color: pink; font-weight: bold; }',
			message: messages.expected('width', 'color'),
			line: 1,
			column: 31,
		},
	],
});

// Also test with groupName
testRule(rule, {
	ruleName,
	config: [
		[
			{
				groupName: 'dimensions',
				order: 'flexible',
				properties: ['width', 'height'],
			},
			{
				groupName: 'font',
				order: 'flexible',
				properties: ['color', 'font-size', 'font-weight'],
			},
		],
	],

	accept: [
		{
			code: 'a { height: 1px; width: 2px; color: pink; font-size: 2px; font-weight: bold; }',
		},
	],
	reject: [
		{
			code: 'a { height: 1px; font-weight: bold; width: 2px; }',
			fixed: 'a { width: 2px; height: 1px; font-weight: bold; }',
			message: messages.expected('width', 'font-weight', 'dimensions'),
			line: 1,
			column: 37,
		},
	],
});
