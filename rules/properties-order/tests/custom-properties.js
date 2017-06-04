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
	fix: true,

	accept: [
		{
			code: ':root {--foo: { top: 0; color: pink; } }',
		},
	],

	reject: [
		{
			code: ':root {--foo: { color: pink; top: 0; } }',
			fixed: ':root {--foo: { top: 0; color: pink; } }',
			message: messages.expected('top', 'color'),
		},
	],
});
