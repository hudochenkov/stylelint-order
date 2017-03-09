'use strict';

const testRule = require('stylelint-test-rule-ava');
const rule = require('..');

const ruleName = rule.ruleName;
const messages = rule.messages;

testRule(rule, {
	ruleName,

	config: [[
		'position',
		{
			order: 'flexible',
			properties: ['top', 'right', 'bottom', 'left'],
		},
		'margin',
		'padding',
	]],

	accept: [
		{
			code: '.foo { position: absolute; margin: 0; }',
		},
		{
			code: '.foo { position: absolute; right: 0; top: 0; padding: 0; }',
		},
	],

	reject: [
		{
			code: '.foo { position: absolute; margin: 0; top: 0; }',
			message: messages.expected('top', 'margin'),
		},
		{
			code: '.foo { position: absolute; left: 0; margin: 0; top: 0; }',
			message: messages.expected('top', 'margin'),
		},
	],
});

testRule(rule, {
	ruleName,

	config: [[
		'position',
		{
			order: 'strict',
			properties: ['top', 'right', 'bottom', 'left'],
		},
		'margin',
		'padding',
	]],

	accept: [
		{
			code: '.foo { position: absolute; margin: 0; }',
		},
	],

	reject: [
		{
			code: '.foo { position: absolute; margin: 0; top: 0; }',
			message: messages.expected('top', 'margin'),
		},
		{
			code: '.foo { position: absolute; right: 0; top: 0; padding: 0; }',
			message: messages.expected('top', 'right'),
		},
	],
});
