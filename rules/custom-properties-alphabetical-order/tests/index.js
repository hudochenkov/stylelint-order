import { rule } from '../index.js';

const { ruleName, messages } = rule;

testRule({
	ruleName,
	config: [true],
	fix: true,

	accept: [
		{
			description: 'single custom property',
			code: 'a { --alpha: 1; }',
		},
		{
			description: 'two custom properties in alphabetical order',
			code: 'a { --alpha: 1; --beta: 2; }',
		},
		{
			description: 'multiple custom properties in alphabetical order',
			code: 'a { --alpha: 1; --beta: 2; --gamma: 3; }',
		},
		{
			description: 'custom properties with same prefix in alphabetical order',
			code: 'a { --color-primary: blue; --color-secondary: red; }',
		},
		{
			description: 'custom properties with numbers in alphabetical order',
			code: 'a { --spacing-1: 4px; --spacing-2: 8px; --spacing-3: 12px; }',
		},
		{
			description: 'duplicate custom properties are allowed',
			code: 'a { --alpha: 1; --alpha: 2; }',
		},
		{
			description: 'custom properties mixed with regular properties (custom props sorted)',
			code: 'a { --alpha: 1; --beta: 2; color: red; }',
		},
		{
			description: 'regular properties are ignored (not sorted by this rule)',
			code: 'a { --alpha: 1; z-index: 1; color: red; }',
		},
		{
			description: 'custom properties after regular properties in alphabetical order',
			code: 'a { z-index: 1; --alpha: 1; --beta: 2; }',
		},
		{
			description: 'custom properties in nested rule',
			code: 'a { color: red; { &:hover { --alpha: 1; --beta: 2; } } }',
		},
		{
			description: 'custom properties in nested rule (alternative syntax)',
			code: 'a { color: red; &:hover { --alpha: 1; --beta: 2; } }',
		},
		{
			description: 'custom properties in media query',
			code: 'a { --alpha: 1; @media print { --beta: 2; --gamma: 3; } }',
		},
		{
			description: 'SCSS variables are ignored',
			code: 'a { $scss: 0; $a: 0; --alpha: 1; }',
		},
		{
			description: 'Less variables are ignored',
			code: 'a { @less: 0; @a: 0; --alpha: 1; }',
		},
		{
			description: 'case-insensitive sorting (lowercase first)',
			code: 'a { --Alpha: 1; --alpha: 2; --Beta: 3; }',
		},
		{
			description: 'empty rule',
			code: 'a { }',
		},
		{
			description: 'only regular properties (no custom properties)',
			code: 'a { color: red; top: 0; }',
		},
		{
			description: 'multiple selectors with sorted custom properties',
			code: 'a { --alpha: 1; --beta: 2; } b { --gamma: 3; --zeta: 4; }',
		},
	],

	reject: [
		{
			description: 'two custom properties in wrong order',
			code: 'a { --beta: 2; --alpha: 1; }',
			fixed: 'a { --alpha: 1; --beta: 2; }',
			message: messages.expected('--alpha', '--beta'),
		},
		{
			description: 'multiple custom properties with one out of order',
			code: 'a { --alpha: 1; --gamma: 3; --beta: 2; }',
			fixed: 'a { --alpha: 1; --beta: 2; --gamma: 3; }',
			message: messages.expected('--beta', '--gamma'),
		},
		{
			description: 'custom properties with same prefix in wrong order',
			code: 'a { --color-secondary: red; --color-primary: blue; }',
			fixed: 'a { --color-primary: blue; --color-secondary: red; }',
			message: messages.expected('--color-primary', '--color-secondary'),
		},
		{
			description: 'custom properties mixed with regular properties (custom props unsorted)',
			code: 'a { --beta: 2; --alpha: 1; color: red; }',
			fixed: 'a { --alpha: 1; --beta: 2; color: red; }',
			message: messages.expected('--alpha', '--beta'),
		},
		{
			description: 'custom properties after regular properties in wrong order',
			code: 'a { z-index: 1; --beta: 2; --alpha: 1; }',
			fixed: 'a { z-index: 1; --alpha: 1; --beta: 2; }',
			message: messages.expected('--alpha', '--beta'),
		},
		{
			description: 'custom properties not grouped together - separated by regular property',
			code: 'a { --beta: 2; z-index: 1; --alpha: 1; }',
			fixed: 'a { --alpha: 1; --beta: 2; z-index: 1; }',
			message: messages.expected('--alpha', '--beta'),
		},
		{
			description: 'custom properties not grouped - separated by a nested rule',
			code: 'a { --beta: 2; &:hover {} --alpha: 1; }',
			fixed: 'a { --alpha: 1; --beta: 2; &:hover {} }',
			message: messages.expected('--alpha', '--beta'),
		},
		{
			description: 'custom properties in nested rule (wrong order)',
			code: 'a { color: red; { &:hover { --beta: 2; --alpha: 1; } } }',
			fixed: 'a { color: red; { &:hover { --alpha: 1; --beta: 2; } } }',
			message: messages.expected('--alpha', '--beta'),
		},
		{
			description: 'custom properties in nested rule alternative syntax (wrong order)',
			code: 'a { color: red; &:hover { --beta: 2; --alpha: 1; } }',
			fixed: 'a { color: red; &:hover { --alpha: 1; --beta: 2; } }',
			message: messages.expected('--alpha', '--beta'),
		},
		{
			description: 'custom properties in media query (wrong order)',
			code: 'a { --alpha: 1; @media print { --gamma: 3; --beta: 2; } }',
			fixed: 'a { --alpha: 1; @media print { --beta: 2; --gamma: 3; } }',
			message: messages.expected('--beta', '--gamma'),
		},
		{
			description: 'at-rule level custom properties (wrong order)',
			code: '@media print { --beta: 2; --alpha: 1; }',
			fixed: '@media print { --alpha: 1; --beta: 2; }',
			message: messages.expected('--alpha', '--beta'),
		},
		{
			description: 'first selector has wrong order',
			code: 'a { --beta: 2; --alpha: 1; } b { --gamma: 3; --zeta: 4; }',
			fixed: 'a { --alpha: 1; --beta: 2; } b { --gamma: 3; --zeta: 4; }',
			message: messages.expected('--alpha', '--beta'),
		},
		{
			description: 'fix should apply when disable comments were used',
			code: `
				/* stylelint-disable order/custom-properties-alphabetical-order */
				/* stylelint-enable order/custom-properties-alphabetical-order */
				a { --beta: 2; --alpha: 1; }
			`,
			fixed: `
				/* stylelint-disable order/custom-properties-alphabetical-order */
				/* stylelint-enable order/custom-properties-alphabetical-order */
				a { --alpha: 1; --beta: 2; }
			`,
			message: messages.expected('--alpha', '--beta'),
		},
	],
});

testRule({
	ruleName,
	config: [true],
	fix: true,

	accept: [
		{
			description: 'comment on separate line before custom property - in order',
			code: `a {
				/* alpha */
				--alpha: 1;
				/* beta */
				--beta: 2;
			}`,
		},
		{
			description: 'multiple comments on separate lines before custom property - in order',
			code: `a {
				/* alpha 1 */
				/* alpha 2 */
				/* alpha 3 */
				--alpha: 1;
				/* beta 1 */
				/* beta 2 */
				/* beta 3 */
				--beta: 2;
			}`,
		},
		{
			description: 'inline comment after custom property - in order',
			code: `a {
				--alpha: 1; /* first */
				--beta: 2; /* second */
			}`,
		},
		{
			description: 'multiple inline comments after custom property - in order',
			code: `a {
				--alpha: 1; /* comment 1 */ /* comment 2 */ /* comment 3 */
				--beta: 2; /* comment 4 */ /* comment 5 */ /* comment 6 */
			}`,
		},
	],

	reject: [
		{
			description: 'comment on separate line moves with its custom property when fixed',
			code: `a {
				/* secondary */
				--color-secondary: red;
				/* primary */
				--color-primary: blue;
			}`,
			fixed: `a {
				/* primary */
				--color-primary: blue;
				/* secondary */
				--color-secondary: red;
			}`,
			message: messages.expected('--color-primary', '--color-secondary'),
		},
		{
			description:
				'multiple comments on separate lines move together with their custom property when fixed',
			code: `a {
				/* beta 1 */
				/* beta 2 */
				/* beta 3 */
				--beta: 2;
				/* alpha 1 */
				/* alpha 2 */
				/* alpha 3 */
				--alpha: 1;
			}`,
			fixed: `a {
				/* alpha 1 */
				/* alpha 2 */
				/* alpha 3 */
				--alpha: 1;
				/* beta 1 */
				/* beta 2 */
				/* beta 3 */
				--beta: 2;
			}`,
			message: messages.expected('--alpha', '--beta'),
		},
		{
			description: 'inline comment stays with its custom property when fixed',
			code: `a {
				--beta: 2; /* second */
				--alpha: 1; /* first */
			}`,
			fixed: `a {
				--alpha: 1; /* first */
				--beta: 2; /* second */
			}`,
			message: messages.expected('--alpha', '--beta'),
		},
		{
			description: 'multiple inline comments stay with their custom property when fixed',
			code: `a {
				--beta: 2; /* b1 */ /* b2 */ /* b3 */
				--alpha: 1; /* a1 */ /* a2 */ /* a3 */
			}`,
			fixed: `a {
				--alpha: 1; /* a1 */ /* a2 */ /* a3 */
				--beta: 2; /* b1 */ /* b2 */ /* b3 */
			}`,
			message: messages.expected('--alpha', '--beta'),
		},
	],
});

testRule({
	ruleName,
	config: [true],
	customSyntax: 'postcss-styled-syntax',
	fix: true,

	accept: [
		{
			description: 'styled-components with sorted custom properties',
			code: `
				const Component = styled.div\`
					--alpha: 1;
					--beta: 2;
				\`;
			`,
		},
		{
			description: 'styled-components with interpolation between custom properties',
			code: `
				const Component = styled.div\`
					--alpha: 1;
					\${props => props.great && '--gamma: 3;'}
					--beta: 2;
				\`;
			`,
		},
	],

	reject: [
		{
			description: 'styled-components with unsorted custom properties',
			code: `
				const Component = styled.div\`
					--beta: 2;
					--alpha: 1;
				\`;
			`,
			fixed: `
				const Component = styled.div\`
					--alpha: 1;
					--beta: 2;
				\`;
			`,
			message: messages.expected('--alpha', '--beta'),
		},
		{
			description: 'styled-components with interpolation - unfixable',
			code: `
				const Component = styled.div\`
					--beta: 2;
					\${props => props.great && '--gamma: 3;'}
					--alpha: 1;
				\`;
			`,
			unfixable: true,
			message: messages.expected('--alpha', '--beta'),
		},
	],
});
