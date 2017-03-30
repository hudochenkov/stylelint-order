'use strict';

const rule = require('..');
const ruleName = rule.ruleName;
const messages = rule.messages;

testRule(rule, {
	ruleName,
	config: [[
		'top',
		'color',
	]],

	accept: [
		{
			code: ':root {--foo: { top: 0; color: pink; } }',
		},
	],

	reject: [
		{
			code: ':root {--foo: { color: pink; top: 0; } }',
			message: messages.expected('top', 'color'),
		},
	],
});
