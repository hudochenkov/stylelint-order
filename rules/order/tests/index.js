'use strict';

const rule = require('..');
const ruleName = rule.ruleName;
const messages = rule.messages;

testRule(rule, {
	ruleName,
	config: [[
		'custom-properties',
		'dollar-variables',
		'declarations',
		'rules',
		'at-rules',
	]],
	fix: true,

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
			fixed: `
				a {
					--width: 10px;
					display: none;
				}
			`,
			message: messages.expected('custom property', 'declaration'),
		},
		{
			code: `
				a {
					--width: 10px;
					display: none;
					$height: 20px;
				}
			`,
			fixed: `
				a {
					--width: 10px;
					$height: 20px;
					display: none;
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
			fixed: `
				div {
					color: tomato;
					a {
						color: blue;
						top: 0;
					}
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
			fixed: `
				div {
					a {
						$hello: 10px;
						color: blue;
						top: 0;
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
			fixed: `
				a {
					--width: 10px;
					$height: 20px;
					display: none;

					span {}

					span {}

					@media (min-width: 100px) {}
				}
			`,
		},
	],
});

testRule(rule, {
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
	fix: true,

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
			fixed: `
				a {
					@include hello {
						display: block;
					}
					@include hello;
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
			fixed: `
				a {
					@include hello {
						display: block;
					}
					@mixin hiya {
						display: none;
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
			fixed: `
				a {
					@include media('palm') {
						display: block;
					}
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
					@mixin hiya {
						display: none;
					}
				}
			`,
			fixed: `
				a {
					@mixin hiya {
						display: none;
					}
					@extend .something;
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
			fixed: `
				a {
					@include hello;
					@extend .something;
				}
			`,
		},
	],
});

testRule(rule, {
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
});

testRule(rule, {
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
	fix: true,

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
			fixed: `
				a {
					@include hello {
						display: block;
					}
					@include hello;
					@extend .something;
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
			fixed: `
				a {
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
					@include media('palm') {
						display: block;
					}
					@mixin media('palm') {
						color: red;
					}
				}
			`,
			fixed: `
				a {
					@mixin media('palm') {
						color: red;
					}
					@include media('palm') {
						display: block;
					}
				}
			`,
		},
	],
});

testRule(rule, {
	ruleName,
	config: [[
		{
			type: 'at-rule',
			hasBlock: false,
		},
		'declarations',
	]],

	accept: [
		{
			code: `
				a {
					@include hello;
					@include hello {
						display: block;
					}
					display: none;
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
					display: none;
				}
			`,
		},
	],
});

testRule(rule, {
	ruleName,
	config: [[
		{
			type: 'at-rule',
			hasBlock: false,
		},
		'declarations',
	]],
	fix: true,

	accept: [
		{
			code: `
				a {
					@include hello;
					display: none;
					@include hello {
						display: block;
					}
				}
			`,
		},
		{
			code: `
				a {
					display: none;
					@include hello {
						display: block;
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
					@include hello;
				}
			`,
			fixed: `
				a {
					@include hello;
					display: none;
				}
			`,
		},
	],
});

testRule(rule, {
	ruleName,
	config: [[
		'declarations',
		{
			type: 'at-rule',
		},
	]],
	fix: true,

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
			fixed: `
				a {
					display: none;
					@include hello;
				}
			`,
		},
	],
});

testRule(rule, {
	ruleName,
	config: [[
		'declarations',
		'at-rules',
	]],
	fix: true,

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
			fixed: `
				a {
					display: none;
					@include hello;
				}
			`,
		},
	],
});

testRule(rule, {
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
});

testRule(rule, {
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
	fix: true,

	reject: [
		{
			code: `
				a {
					display: none;
					$width: 5px;
				}
			`,
			fixed: `
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
			fixed: `
				a {
					--height: 10px;
					$width: 5px;
				}
			`,
		},
	],
});

testRule(rule, {
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
	fix: true,

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
			fixed: `
				a {
					display: none;
					$width: 5px;
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
			fixed: `
				a {
					--height: 10px;
					$width: 5px;
				}
			`,
		},
	],
});

testRule(rule, {
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
	fix: true,

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
			fixed: `
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
					span {}
					&:hover {}
				}
			`,
			fixed: `
				a {
					&:hover {}
					span {}
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
			fixed: `
				a {
					abbr {}
					span {}
				}
			`,
		},
	],
});

testRule(rule, {
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
	fix: true,

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
			fixed: `
				a {
					& b {}
					&:hover {}
					b & {}
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
			fixed: `
				a {
					&:hover {}
					& b {}
					b & {}
				}
			`,
		},
	],
});

testRule(rule, {
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
	fix: true,

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
			fixed: `
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
					&:hover {}
					b & {}
				}
			`,
			fixed: `
				a {
					b & {}
					&:hover {}
				}
			`,
		},
	],
});

testRule(rule, {
	ruleName,
	syntax: 'less',
	config: [[
		'custom-properties',
		'at-variables',
		'declarations',
		'rules',
		'at-rules',
	]],

	accept: [
		{
			code: `
				a {
					--width: 10px;
					@size: 30px;
					display: none;

					span {}

					@media (min-width: 100px) {}
				}
			`,
		},
		{
			code: `
				div {
					a {
						@hello: 10px;
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
				div {
					a {
						color: blue;
						top: 0;
						@hello: 10px;
					}
				}
			`,
		},
	],
});

testRule(rule, {
	ruleName,
	syntax: 'less',
	config: [[
		'less-mixins',
		'rules',
	]],

	accept: [
		{
			code: `
				a {
					.mixin();
					span {}
				}
			`,
		},
		{
			code: `
				a {
					.mixin();
					&:extend(.class1);
				}
			`,
		},
	],

	reject: [
		{
			code: `
				a {
					span {}
					.mixin();
				}
			`,
			message: messages.expected('Less mixin', 'rule'),
		},
		{
			code: `
				a {
					&:extend(.class1);
					.mixin();
				}
			`,
			message: messages.expected('Less mixin', 'rule'),
		},
	],
});
