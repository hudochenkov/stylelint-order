'use strict';

const testRule = require('stylelint-test-rule-ava');
const declarationBlockOrder = require('..');

const ruleName = declarationBlockOrder.ruleName;

testRule(declarationBlockOrder, {
	ruleName,
	config: [[
		'custom-properties',
		'dollar-variables',
		'declarations',
		'rules',
		'at-rules',
	]],
	skipBasicChecks: true,

	accept: [
		{
			code: `
				a {
					--width: 10px;
					$height: 20px;
					display: none;

					span {}

					@media (min-width: 100px) {}
				}
			`,
		},
		{
			code: `
				a {
					span {}
					@media (min-width: 100px) {}
				}
			`,
		},
		{
			code: `
				a {
					$height: 20px;

					@media (min-width: 100px) {}
				}
			`,
		},
		{
			code: `
				a {
					$height: 20px;
					/* comment */
					display: block;
				}
			`,
		},
		{
			code: `
				div {
					a {
						$hello: 10px;
						color: blue;
						top: 0;
					}
				}
			`,
		},
	],

	reject: [
		{
			code: `
				a {
					display: none;
					--width: 10px;
				}
			`,
			message: declarationBlockOrder.messages.expected('custom property', 'declaration'),
		},
		{
			code: `
				a {
					--width: 10px;
					display: none;
					$height: 20px;
				}
			`,
		},
		{
			code: `
				div {
					a {
						color: blue;
						top: 0;
					}
					color: tomato;
				}
			`,
		},
		{
			code: `
				div {
					a {
						color: blue;
						top: 0;
						$hello: 10px;
					}
				}
			`,
		},
		{
			code: `
				a {
					--width: 10px;
					$height: 20px;
					display: none;

					span {}

					@media (min-width: 100px) {}

					span {}
				}
			`,
		},
	],
});

testRule(declarationBlockOrder, {
	ruleName,
	config: [[
		{
			type: 'at-rule',
			name: 'include',
			parameter: 'media',
			hasBlock: true,
		},
		{
			type: 'at-rule',
			name: 'include',
			parameter: 'media',
		},
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
	]],
	skipBasicChecks: true,

	accept: [
		{
			code: `
				a {
					@include media('palm') {
						display: block;
					}
					@include media('desk');
					@include hello {
						display: block;
					}
					@include hello;
					@mixin hiya {
						display: none;
					}
					@extend .something;
				}
			`,
		},
	],

	reject: [
		{
			code: `
				a {
					@include hello;
					@include hello {
						display: block;
					}
				}
			`,
		},
		{
			code: `
				a {
					@mixin hiya {
						display: none;
					}
					@include hello {
						display: block;
					}
				}
			`,
		},
		{
			code: `
				a {
					@mixin hiya {
						display: none;
					}
					@include media('palm') {
						display: block;
					}
				}
			`,
		},
		{
			code: `
				a {
					@extend .something;
					@mixin hiya {
						display: none;
					}
				}
			`,
		},
		{
			code: `
				a {
					@extend .something;
					@include hello;
				}
			`,
		},
	],
});

testRule(declarationBlockOrder, {
	ruleName,
	config: [[
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
			name: 'include',
			parameter: 'media',
		},
		{
			type: 'at-rule',
			name: 'include',
			parameter: 'media',
			hasBlock: true,
		},
	]],
	skipBasicChecks: true,

	accept: [
		{
			code: `
				a {
					@include hello {
						display: block;
					}
					@include hello;
					@mixin hiya {
						display: none;
					}
					@extend .something;
					@include media('desk');
					@include media('palm') {
						display: block;
					}
				}
			`,
		},
		{
			code: `
				a {
					@include hello {
						display: block;
					}
					@include hello;
					@extend .something;
					@mixin hiya {
						display: none;
					}
				}
			`,
		},
		{
			code: `
				a {
					@extend .something;
					@include hello {
						display: block;
					}
					@include hello;
					@mixin hiya {
						display: none;
					}
				}
			`,
		},
	],

	reject: [
		{
			code: `
				a {
					@include hello;
					@extend .something;
					@include hello {
						display: block;
					}
				}
			`,
		},
		{
			code: `
				a {
					@include media('palm') {
						display: block;
					}
					@include media('desk');
				}
			`,
		},
		{
			code: `
				a {
					@include media('palm') {
						display: block;
					}
					@mixin media('palm') {
						color: red;
					}
				}
			`,
		},
	],
});

testRule(declarationBlockOrder, {
	ruleName,
	config: [[
		'declarations',
		{
			type: 'at-rule',
		},
	]],
	skipBasicChecks: true,

	accept: [
		{
			code: `
				a {
					display: none;
					@include hello;
				}
			`,
		},
	],

	reject: [
		{
			code: `
				a {
					@include hello;
					display: none;
				}
			`,
		},
	],
});

testRule(declarationBlockOrder, {
	ruleName,
	config: [[
		'declarations',
		'at-rules',
	]],
	skipBasicChecks: true,

	accept: [
		{
			code: `
				a {
					display: none;
					@include hello;
				}
			`,
		},
	],

	reject: [
		{
			code: `
				a {
					@include hello;
					display: none;
				}
			`,
		},
	],
});

testRule(declarationBlockOrder, {
	ruleName,
	config: [
		[
			'custom-properties',
			'declarations',
		],
		{
			unspecified: 'top',
		},
	],
	skipBasicChecks: true,

	accept: [
		{
			code: `
				a {
					$width: 5px;
					--height: 10px;
					display: none;
				}
			`,
		},
		{
			code: `
				a {
					$width: 5px;
					@include hello;
				}
			`,
		},
	],

	reject: [
		{
			code: `
				a {
					display: none;
					$width: 5px;
				}
			`,
		},
		{
			code: `
				a {
					--height: 10px;
					$width: 5px;
				}
			`,
		},
	],
});

testRule(declarationBlockOrder, {
	ruleName,
	config: [
		[
			'custom-properties',
			'declarations',
		],
		{
			unspecified: 'bottom',
		},
	],
	skipBasicChecks: true,

	accept: [
		{
			code: `
				a {
					--height: 10px;
					display: none;
					$width: 5px;
				}
			`,
		},
		{
			code: `
				a {
					$width: 5px;
					@include hello;
				}
			`,
		},
	],

	reject: [
		{
			code: `
				a {
					$width: 5px;
					display: none;
				}
			`,
		},
		{
			code: `
				a {
					$width: 5px;
					--height: 10px;
				}
			`,
		},
	],
});

testRule(declarationBlockOrder, {
	ruleName,
	config: [[
		{
			type: 'rule',
			selector: '^a',
		},
		{
			type: 'rule',
			selector: /^&/,
		},
		{
			type: 'rule',
		},
	]],
	skipBasicChecks: true,

	accept: [
		{
			code: `
				a {
					a {}
					abbr {}
					&:hover {}
					span {}
				}
			`,
		},
		{
			code: `
				a {
					abbr {}
					a {}
					&:hover {}
					span {}
				}
			`,
		},
		{
			code: `
				a {
					a {}
					span {}
				}
			`,
		},
	],

	reject: [
		{
			code: `
				a {
					a {}
					&:hover {}
					abbr {}
					span {}
				}
			`,
		},
		{
			code: `
				a {
					span {}
					&:hover {}
				}
			`,
		},
		{
			code: `
				a {
					span {}
					abbr {}
				}
			`,
		},
	],
});

testRule(declarationBlockOrder, {
	ruleName,
	config: [[
		{
			type: 'rule',
			selector: /^&/,
		},
		{
			type: 'rule',
			selector: /^&:\w/,
		},
		{
			type: 'rule',
		},
	]],
	skipBasicChecks: true,

	accept: [
		{
			code: `
				a {
					&:hover {}
					& b {}
					b & {}
				}
			`,
		},
		{
			code: `
				a {
					& b {}
					&:hover {}
					b & {}
				}
			`,
		},
	],

	reject: [
		{
			code: `
				a {
					& b {}
					b & {}
					&:hover {}
				}
			`,
		},
		{
			code: `
				a {
					&:hover {}
					b & {}
					& b {}
				}
			`,
		},
	],
});

testRule(declarationBlockOrder, {
	ruleName,
	config: [[
		{
			type: 'rule',
		},
		{
			type: 'rule',
			selector: /^&:\w/,
		},
		{
			type: 'rule',
			selector: /^&/,
		},
	]],
	skipBasicChecks: true,

	accept: [
		{
			code: `
				a {
					b & {}
					&:hover {}
					& b {}
				}
			`,
		},
		{
			code: `
				a {
					b & {}
					& b {}
				}
			`,
		},
	],

	reject: [
		{
			code: `
				a {
					b & {}
					& b {}
					&:hover {}
				}
			`,
		},
		{
			code: `
				a {
					&:hover {}
					b & {}
				}
			`,
		},
	],
});
