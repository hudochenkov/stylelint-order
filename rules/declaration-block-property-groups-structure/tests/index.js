'use strict';

const rule = require('..');
const ruleName = rule.ruleName;
const messages = rule.messages;

testRule(rule, {
	ruleName,
	config: [[
		{
			emptyLineBefore: 'always',
			properties: [
				'display',
			],
		},
		{
			emptyLineBefore: 'always',
			properties: [
				'position',
			],
		},
		{
			emptyLineBefore: 'always',
			properties: [
				'border-bottom',
				'font-style',
			],
		},
	]],

	accept: [
		{
			code: `
				a {
					display: none;

					position: absolute;

					border-bottom: 1px solid red;
					font-style: italic;
				}
			`,
		},
		{
			code: `
				a {
					display: none;

					position: absolute;

					font-style: italic;
				}
			`,
		},
		{
			code: `
				a {
					display: none;

					font-style: italic;
				}
			`,
		},
		{
			code: `
				a {
					position: absolute;

					border-bottom: 1px solid red;
				}
			`,
		},
		{
			code: `
				a {
					display: none;

					border-bottom: 1px solid red;
				}
			`,
		},
		{
			code: `
				a {
					display: none; /* comment */

					position: absolute;
				}
			`,
		},
		{
			code: `
				a {
					display: none;
					/* comment */
					position: absolute;
				}
			`,
		},
		{
			code: `
				a {
					/* comment */
					display: none;

					position: absolute;
				}
			`,
		},
		{
			code: `
				a {
					/* comment */
					display: none;

					/* comment */
					position: absolute;
				}
			`,
		},
		{
			code: `
				a {
					display: none;

					@media (min-width: 100px) {}

					position: absolute;
				}
			`,
		},
		{
			code: `
				a {
					display: none;
					@media (min-width: 100px) {}
					position: absolute;
				}
			`,
		},
		{
			code: `
				a {
					--display: none;

					position: absolute;
				}
			`,
		},
		{
			code: `
				a {
					--display: none;
					position: absolute;
				}
			`,
		},
	],

	reject: [
		{
			code: `
				a {
					display: none;
					position: absolute;

					border-bottom: 1px solid red;
					font-style: italic;
				}
			`,
			message: messages.expected('position'),
		},
		{
			code: `
				a {
					display: none;

					position: absolute;
					border-bottom: 1px solid red;
					font-style: italic;
				}
			`,
			message: messages.expected('border-bottom'),
		},
		{
			code: `
				a {
					display: none;
					position: absolute;

					font-style: italic;
				}
			`,
			message: messages.expected('position'),
		},
		{
			code: `
				a {
					display: none;
					font-style: italic;
				}
			`,
			message: messages.expected('font-style'),
		},
		{
			code: `
				a {
					position: absolute;
					border-bottom: 1px solid red;
				}
			`,
			message: messages.expected('border-bottom'),
		},
		{
			code: `
				a {
					display: none;
					border-bottom: 1px solid red;
				}
			`,
			message: messages.expected('border-bottom'),
		},
		{
			code: `
				a {
					display: none; /* comment */
					position: absolute;
				}
			`,
			message: messages.expected('position'),
		},
		{
			code: `
				a {
					/* comment */
					display: none;
					position: absolute;
				}
			`,
			message: messages.expected('position'),
		},
	],
});

testRule(rule, {
	ruleName,
	config: [[
		{
			emptyLineBefore: 'never',
			properties: [
				'display',
			],
		},
		{
			emptyLineBefore: 'never',
			properties: [
				'position',
			],
		},
		{
			emptyLineBefore: 'never',
			properties: [
				'border-bottom',
				'font-style',
			],
		},
	]],

	accept: [
		{
			code: `
				a {
					display: none;
					position: absolute;
					border-bottom: 1px solid red;
					font-style: italic;
				}
			`,
		},
		{
			code: `
				a {
					display: none;
					position: absolute;
					font-style: italic;
				}
			`,
		},
		{
			code: `
				a {
					display: none;
					font-style: italic;
				}
			`,
		},
		{
			code: `
				a {
					position: absolute;
					border-bottom: 1px solid red;
				}
			`,
		},
		{
			code: `
				a {
					display: none;
					border-bottom: 1px solid red;
				}
			`,
		},
		{
			code: `
				a {
					display: none; /* comment */
					position: absolute;
				}
			`,
		},
		{
			code: `
				a {
					display: none;

					/* comment */
					position: absolute;
				}
			`,
		},
		{
			code: `
				a {
					/* comment */
					display: none;
					position: absolute;
				}
			`,
		},
		{
			code: `
				a {
					/* comment */
					display: none;

					/* comment */
					position: absolute;
				}
			`,
		},
		{
			code: `
				a {
					display: none;

					@media (min-width: 100px) {}

					position: absolute;
				}
			`,
		},
		{
			code: `
				a {
					display: none;
					@media (min-width: 100px) {}
					position: absolute;
				}
			`,
		},
		{
			code: `
				a {
					--display: none;

					position: absolute;
				}
			`,
		},
		{
			code: `
				a {
					--display: none;
					position: absolute;
				}
			`,
		},
	],

	reject: [
		{
			code: `
				a {
					display: none;
					position: absolute;

					border-bottom: 1px solid red;
					font-style: italic;
				}
			`,
			message: messages.rejected('border-bottom'),
		},
		{
			code: `
				a {
					display: none;

					position: absolute;
					border-bottom: 1px solid red;
					font-style: italic;
				}
			`,
			message: messages.rejected('position'),
		},
		{
			code: `
				a {
					display: none;
					position: absolute;

					font-style: italic;
				}
			`,
			message: messages.rejected('font-style'),
		},
		{
			code: `
				a {
					display: none;

					font-style: italic;
				}
			`,
			message: messages.rejected('font-style'),
		},
		{
			code: `
				a {
					position: absolute;

					border-bottom: 1px solid red;
				}
			`,
			message: messages.rejected('border-bottom'),
		},
		{
			code: `
				a {
					display: none;

					border-bottom: 1px solid red;
				}
			`,
			message: messages.rejected('border-bottom'),
		},
		{
			code: `
				a {
					display: none; /* comment */

					position: absolute;
				}
			`,
			message: messages.rejected('position'),
		},
		{
			code: `
				a {
					/* comment */
					display: none;

					position: absolute;
				}
			`,
			message: messages.rejected('position'),
		},
	],
});

testRule(rule, {
	ruleName,
	config: [[
		{
			emptyLineBefore: 'always',
			properties: [
				'border-bottom',
				'font-style',
			],
		},
		{
			emptyLineBefore: 'never',
			properties: [
				'position',
			],
		},
		{
			emptyLineBefore: 'always',
			properties: [
				'display',
			],
		},
	]],

	accept: [
		{
			code: `
				a {
					border-bottom: 1px solid red;
					font-style: italic;
					position: absolute;

					display: none;
				}
			`,
		},
		{
			code: `
				a {
					font-style: italic;
					position: absolute;

					display: none;
				}
			`,
		},
		{
			code: `
				a {
					font-style: italic;

					display: none;
				}
			`,
		},
		{
			code: `
				a {
					border-bottom: 1px solid red;
					position: absolute;
				}
			`,
		},
		{
			code: `
				a {
					border-bottom: 1px solid red;

					display: none;
				}
			`,
		},
		{
			code: `
				a {
					position: absolute; /* comment */

					display: none;
				}
			`,
		},
		{
			code: `
				a {
					position: absolute;

					/* comment */
					display: none;
				}
			`,
		},
		{
			code: `
				a {
					position: absolute;
					/* comment */
					display: none;
				}
			`,
		},
		{
			code: `
				a {
					/* comment */
					position: absolute;

					/* comment */
					display: none;
				}
			`,
		},
		{
			code: `
				a {
					position: absolute;

					@media (min-width: 100px) {}

					display: none;
				}
			`,
		},
		{
			code: `
				a {
					position: absolute;
					@media (min-width: 100px) {}
					display: none;
				}
			`,
		},
		{
			code: `
				a {
					--display: none;
					position: absolute;
				}
			`,
		},
		{
			code: `
				a {
					--display: none;

					position: absolute;
				}
			`,
		},
	],

	reject: [
		{
			code: `
				a {
					border-bottom: 1px solid red;
					font-style: italic;
					position: absolute;
					display: none;
				}
			`,
			message: messages.expected('display'),
		},
		{
			code: `
				a {
					border-bottom: 1px solid red;
					font-style: italic;

					position: absolute;

					display: none;
				}
			`,
			message: messages.rejected('position'),
		},
		{
			code: `
				a {
					font-style: italic;
					position: absolute;
					display: none;
				}
			`,
			message: messages.expected('display'),
		},
		{
			code: `
				a {
					font-style: italic;
					display: none;
				}
			`,
			message: messages.expected('display'),
		},
		{
			code: `
				a {
					border-bottom: 1px solid red;

					position: absolute;
				}
			`,
			message: messages.rejected('position'),
		},
		{
			code: `
				a {
					border-bottom: 1px solid red;
					display: none;
				}
			`,
			message: messages.expected('display'),
		},
		{
			code: `
				a {
					position: absolute; /* comment */
					display: none;
				}
			`,
			message: messages.expected('display'),
		},
	],
});

testRule(rule, {
	ruleName,
	config: [[
		'height',
		'width',
		{
			emptyLineBefore: 'always',
			properties: [
				'display',
			],
		},
	]],

	accept: [
		{
			code: `
				a {
					height: 10px;
					width: 10px;

					display: none;
				}
			`,
		},
		{
			code: `
				a {
					height: 10px;

					display: none;
				}
			`,
		},
		{
			code: `
				a {
					display: none;
				}
			`,
		},
		{
			code: `
				a {

					display: none;
				}
			`,
		},
		{
			code: `
				a {
					height: 10px;
				}
			`,
		},
		{
			code: `
				a {
					height: 10px;
					width: 10px; /* comment */

					display: none;
				}
			`,
		},
		{
			code: `
				a {
					height: 10px;
					width: 10px;
					/* comment */
					display: none;
				}
			`,
		},
		{
			code: `
				a {
					height: 10px;
					width: 10px;

					/* comment */
					display: none;
				}
			`,
		},
	],

	reject: [
		{
			code: `
				a {
					height: 10px;
					width: 10px;
					display: none;
				}
			`,
			message: messages.expected('display'),
		},
		{
			code: `
				a {
					height: 10px;
					display: none;
				}
			`,
			message: messages.expected('display'),
		},
		{
			code: `
				a {
					height: 10px;
					width: 10px; /* comment */
					display: none;
				}
			`,
			message: messages.expected('display'),
		},
	],
});

testRule(rule, {
	ruleName,
	config: [[
		{
			emptyLineBefore: 'always',
			properties: [
				'display',
			],
		},
		{
			emptyLineBefore: 'always',
			properties: [
				'border',
			],
		},
	]],

	accept: [
		{
			code: `
				a {
					display: none;

					border-top: absolute;
				}
			`,
		},
	],

	reject: [
		{
			code: `
				a {
					display: none;
					border-top: absolute;
				}
			`,
			message: messages.expected('border-top'),
		},
	],
});

testRule(rule, {
	ruleName,
	config: [[
		{
			emptyLineBefore: 'always',
			properties: [
				'display',
			],
		},
		{
			properties: [
				'position',
			],
		},
	]],

	accept: [
		{
			code: `
				a {
					display: none;

					position: absolute;
				}
			`,
		},
		{
			code: `
				a {
					display: none;
					position: absolute;
				}
			`,
		},
	],

	reject: [
	],
});
