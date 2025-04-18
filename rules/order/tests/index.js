import { rule } from '../index.js';

const { ruleName, messages } = rule;

testRule({
	ruleName,
	config: [['custom-properties', 'dollar-variables', 'declarations', 'rules', 'at-rules']],
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
		{
			description: 'should not report things in css root',
			code: `
				@media (min-width: 100px) {}

				display: none;
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
			message: messages.expected('$-variable', 'declaration'),
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
			message: messages.expected('declaration', 'rule'),
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
			message: messages.expected('$-variable', 'declaration'),
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
			message: messages.expected('rule', 'at-rule'),
		},
		{
			description: 'Fix should apply, when disable comments were used',
			code: `
				a {
					display: none;
					--width: 10px;
				}
				/* stylelint-disable order/order */
			`,
			fixed: `
				a {
					--width: 10px;
					display: none;
				}
				/* stylelint-disable order/order */
			`,
			message: messages.expected('custom property', 'declaration'),
		},
	],
});

testRule({
	ruleName,
	config: [
		[
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
		],
	],
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
			message: messages.expected('@include with a block', '@include'),
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
			message: messages.expected('@include with a block', 'at-rule with a block'),
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
			message: messages.expected('@include "media" with a block', 'at-rule with a block'),
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
			message: messages.expected('at-rule with a block', 'at-rule'),
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
			message: messages.expected('@include', 'at-rule'),
		},
	],
});

testRule({
	ruleName,
	config: [
		[
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
		],
	],
	fix: true,

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

testRule({
	ruleName,
	config: [
		[
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
		],
	],
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
			message: messages.expected('@include with a block', '@include'),
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
			message: messages.expected('@include "media"', '@include "media" with a block'),
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
			message: messages.expected('at-rule with a block', '@include "media" with a block'),
		},
	],
});

testRule({
	ruleName,
	config: [
		[
			{
				type: 'at-rule',
				hasBlock: false,
			},
			'declarations',
		],
	],
	fix: true,

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

testRule({
	ruleName,
	config: [
		[
			{
				type: 'at-rule',
				hasBlock: false,
			},
			'declarations',
		],
	],
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
			message: messages.expected('blockless at-rule', 'declaration'),
		},
	],
});

testRule({
	ruleName,
	config: [
		[
			'declarations',
			{
				type: 'at-rule',
			},
		],
	],
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
			message: messages.expected('declaration', 'at-rule'),
		},
	],
});

testRule({
	ruleName,
	config: [['declarations', 'at-rules']],
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
			message: messages.expected('declaration', 'at-rule'),
		},
	],
});

testRule({
	ruleName,
	config: [
		['custom-properties', 'declarations'],
		{
			unspecified: 'top',
		},
	],
	fix: true,

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

testRule({
	ruleName,
	config: [
		['custom-properties', 'declarations'],
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
			unfixable: true,
			warnings: [{ message: messages.expected('$-variable', 'declaration') }],
		},
		{
			code: `
				a {
					--height: 10px;
					$width: 5px;
				}
			`,
			unfixable: true,
			message: messages.expected('$-variable', 'custom property'),
		},
	],
});

testRule({
	ruleName,
	config: [
		['custom-properties', 'declarations'],
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
			message: messages.expected('declaration', '$-variable'),
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
			message: messages.expected('custom property', '$-variable'),
		},
	],
});

testRule({
	ruleName,
	config: [
		[
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
		],
	],
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
			message: messages.expected(
				'rule with selector matching "^a"',
				'rule with selector matching "/^&/"',
			),
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
			message: messages.expected('rule with selector matching "/^&/"', 'rule'),
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
			message: messages.expected('rule with selector matching "^a"', 'rule'),
		},
	],
});

testRule({
	ruleName,
	config: [
		[
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
		],
	],
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
			message: messages.expected('rule with selector matching "/^&/"', 'rule'),
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
			message: messages.expected('rule with selector matching "/^&/"', 'rule'),
		},
	],
});

testRule({
	ruleName,
	config: [
		[
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
		],
	],
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
			message: messages.expected(
				'rule with selector matching "/^&:\\w/"',
				'rule with selector matching "/^&/"',
			),
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
			message: messages.expected('rule', 'rule with selector matching "/^&:\\w/"'),
		},
	],
});

testRule({
	ruleName,
	config: [
		[
			{
				type: 'rule',
			},
			{
				type: 'rule',
				selector: /^&:\w/,
				name: 'State',
			},
			{
				type: 'rule',
				selector: /^&/,
				name: 'Child',
			},
		],
	],
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
			message: messages.expected('rule "State"', 'rule "Child"'),
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
			message: messages.expected('rule', 'rule "State"'),
		},
	],
});

testRule({
	ruleName,
	customSyntax: 'postcss-less',
	config: [['custom-properties', 'at-variables', 'declarations', 'rules', 'at-rules']],
	fix: true,

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
			fixed: `
				div {
					a {
						@hello: 10px;
						color: blue;
						top: 0;
					}
				}
			`,
			message: messages.expected('@-variable', 'declaration'),
		},
	],
});

// Doesn't has fix, because postcss-sorting doesn't know about less-mixins
testRule({
	ruleName,
	customSyntax: 'postcss-less',
	config: [['less-mixins', 'rules']],

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
			skip: true,
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

testRule({
	ruleName,
	config: [['custom-properties']],
	fix: true,

	accept: [
		{
			code: `
				a {
					--width: 10px;
					display: none;
				}
			`,
		},
		{
			description: 'should not fix if there no violation',
			code: `
				a {
					display: none;
					--width: 10px;
				}
			`,
		},
	],
});

testRule({
	ruleName,
	config: [['declarations', 'rules', 'at-rules']],
	customSyntax: 'postcss-styled-syntax',
	fix: true,

	accept: [
		{
			code: `
				const Component1 = styled.div\`
					color: tomato;

					\${props => props.great && 'color: red'};

					a {
						color: blue;
					}

					@media screen {
						color: black;
					}
				\`;
			`,
		},
		{
			code: `
				const Component5 = styled.div\`
					div {
						display: none;
						\${props => props.great && 'color: red'};
						span {
						}

						@media (min-width: 100px) {
						}
					}
				\`;
			`,
		},
	],

	reject: [
		{
			code: `
				const Component1 = styled.div\`
					a {
						color: blue;
					}
					color: tomato;

					@media screen {
						color: black;
					}
				\`;
			`,
			fixed: `
				const Component1 = styled.div\`
					color: tomato;
					a {
						color: blue;
					}

					@media screen {
						color: black;
					}
				\`;
			`,

			message: messages.expected('declaration', 'rule'),
		},
		{
			code: `
				const Component2 = styled.div\`
					@media screen {
						color: black;
					}
					\${Button} {
						color: blue;
					}
					color: tomato;
				\`;
			`,
			fixed: `
				const Component2 = styled.div\`
					color: tomato;
					\${Button} {
						color: blue;
					}
					@media screen {
						color: black;
					}
				\`;
			`,
			warnings: [
				{
					message: messages.expected('rule', 'at-rule'),
				},
				{
					message: messages.expected('declaration', 'rule'),
				},
			],
		},
		{
			code: `
				const Component3 = styled.div\`
					div {
						a {
							color: blue;
						}
						color: tomato;
					}
				\`;
			`,
			fixed: `
				const Component3 = styled.div\`
					div {
						color: tomato;
						a {
							color: blue;
						}
					}
				\`;
			`,
			message: messages.expected('declaration', 'rule'),
		},
		{
			code: `
				const Component4 = styled.div\`
					span {
					}

					display: none;

					@media (min-width: 100px) {
					}

					div {
					}
				\`;
			`,
			fixed: `
				const Component4 = styled.div\`

					display: none;
					span {
					}

					div {
					}

					@media (min-width: 100px) {
					}
				\`;
			`,
			warnings: [
				{
					message: messages.expected('declaration', 'rule'),
				},
				{
					message: messages.expected('rule', 'at-rule'),
				},
			],
		},
		{
			code: `
				const Component5 = styled.div\`
					div {
						span {
						}

						display: none;

						@media (min-width: 100px) {
						}

						div {
						}
					}
				\`;
			`,
			fixed: `
				const Component5 = styled.div\`
					div {

						display: none;
						span {
						}

						div {
						}

						@media (min-width: 100px) {
						}
					}
				\`;
			`,
			warnings: [
				{
					message: messages.expected('declaration', 'rule'),
				},
				{
					message: messages.expected('rule', 'at-rule'),
				},
			],
		},
		{
			code: `
				const Component3 = styled.div\`
					\${props => props.great && 'color: red'};
					div {
						a {
							color: blue;
						}
						color: tomato;
					}
				\`;
			`,
			fixed: `
				const Component3 = styled.div\`
					\${props => props.great && 'color: red'};
					div {
						color: tomato;
						a {
							color: blue;
						}
					}
				\`;
			`,
			message: messages.expected('declaration', 'rule'),
		},
	],
});
