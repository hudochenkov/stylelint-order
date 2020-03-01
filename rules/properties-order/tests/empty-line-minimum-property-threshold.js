const rule = require('..');

const { ruleName, messages } = rule;

testRule(rule, {
	ruleName,
	config: [
		[
			{
				emptyLineBefore: 'threshold',
				properties: ['display'],
			},
			{
				emptyLineBefore: 'threshold',
				properties: ['position'],
			},
			{
				emptyLineBefore: 'threshold',
				properties: ['border-bottom', 'font-style'],
			},
		],
		{
			emptyLineMinimumPropertyThreshold: 5,
		},
	],
	fix: true,

	accept: [
		{
			description: '1',
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
			description: '2',
			code: `
				a {
					display: none;
					position: absolute;
					font-style: italic;
				}
			`,
		},
		{
			description: '3',
			code: `
				a {
					display: none;
					font-style: italic;
				}
			`,
		},
		{
			description: '4',
			code: `
				a {
					position: absolute;
					border-bottom: 1px solid red;
				}
			`,
		},
		{
			description: '5',
			code: `
				a {
					display: none;
					border-bottom: 1px solid red;
				}
			`,
		},
		{
			description: '6',
			code: `
				a {
					display: none; /* comment */
					position: absolute;
				}
			`,
		},
		{
			description: '7',
			code: `
				a {
					display: none;
					/* comment */
					position: absolute;
				}
			`,
		},
		{
			description: '8',
			code: `
				a {
					/* comment */
					display: none;
					position: absolute;
				}
			`,
		},
		{
			description: '9',
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
			description: '12',
			code: `
				a {
					--display: none;

					position: absolute;
				}
			`,
		},
		{
			description: '13',
			code: `
				a {
					--display: none;
					position: absolute;
				}
			`,
		},
		{
			description: '13.1',
			code: `
				a {
					$display: none;
					position: absolute;
				}
			`,
		},
		{
			description: '13.2',
			code: `
				a {
					$display: none;

					position: absolute;
				}
			`,
		},
		{
			description: '13.3',
			code: `
				a {
					position: absolute;
					$display: none;
				}
			`,
		},
		{
			description: '13.4',
			code: `
				a {
					position: absolute;

					$display: none;
				}
			`,
		},
		{
			description: '14',
			code: `
				a {
					display: 0;

					/* comment */
					position: 0;

					/* comment */
					border-bottom: 0;
				}
			`,
		},
	],

	reject: [
		{
			description: '14',
			code: `
				a {
					display: none;

					position: absolute;

					border-bottom: 1px solid red;
					font-style: italic;
				}
			`,
			fixed: `
				a {
					display: none;
					position: absolute;
					border-bottom: 1px solid red;
					font-style: italic;
				}
			`,
			message: messages.rejectedEmptyLineBefore('position'),
		},
		{
			description: '15',
			code: `
				a {
					display: none;

					position: absolute;
					border-bottom: 1px solid red;
					font-style: italic;
				}
			`,
			fixed: `
				a {
					display: none;
					position: absolute;
					border-bottom: 1px solid red;
					font-style: italic;
				}
			`,
			message: messages.rejectedEmptyLineBefore('position'),
		},
		{
			description: '16',
			code: `
				a {
					display: none;
					position: absolute;

					font-style: italic;
				}
			`,
			fixed: `
				a {
					display: none;
					position: absolute;
					font-style: italic;
				}
			`,
			message: messages.rejectedEmptyLineBefore('font-style'),
		},
		{
			description: '17',
			code: `
				a {
					display: none;

					font-style: italic;
				}
			`,
			fixed: `
				a {
					display: none;
					font-style: italic;
				}
			`,
			message: messages.rejectedEmptyLineBefore('font-style'),
		},
		{
			description: '18',
			code: `
				a {
					position: absolute;

					border-bottom: 1px solid red;
				}
			`,
			fixed: `
				a {
					position: absolute;
					border-bottom: 1px solid red;
				}
			`,
			message: messages.rejectedEmptyLineBefore('border-bottom'),
		},
		{
			description: '19',
			code: `
				a {
					display: none;

					border-bottom: 1px solid red;
				}
			`,
			fixed: `
				a {
					display: none;
					border-bottom: 1px solid red;
				}
			`,
			message: messages.rejectedEmptyLineBefore('border-bottom'),
		},
		{
			description: '20',
			code: `
				a {
					display: none; /* comment */

					position: absolute;
				}
			`,
			fixed: `
				a {
					display: none; /* comment */
					position: absolute;
				}
			`,
			message: messages.rejectedEmptyLineBefore('position'),
		},
		{
			description: '21',
			code: `
				a {
					/* comment */
					display: none;

					position: absolute;
				}
			`,
			fixed: `
				a {
					/* comment */
					display: none;
					position: absolute;
				}
			`,
			message: messages.rejectedEmptyLineBefore('position'),
		},
		{
			description: '22',
			code: `
				a {
					display: absolute;

					--num: 0;

					position: var(--num);

					border-bottom: var(--num);
				}
			`,
			fixed: `
				a {
					display: absolute;

					--num: 0;

					position: var(--num);
					border-bottom: var(--num);
				}
			`,
			message: messages.rejectedEmptyLineBefore('border-bottom'),
		},
	],
});

testRule(rule, {
	ruleName,
	config: [
		[
			{
				emptyLineBefore: 'threshold',
				properties: ['width', 'height'],
			},
			{
				emptyLineBefore: 'threshold',
				properties: ['font-size', 'font-family'],
			},
			{
				emptyLineBefore: 'threshold',
				properties: ['background-repeat'],
			},
		],
		{
			emptyLineMinimumPropertyThreshold: 4,
		},
	],
	fix: true,

	reject: [
		{
			description: 'fix order and empty line before',
			code: `
				a {
					width: 100%;
					font-size: 14px;
					height: 100%;
					font-family: "Arial", "Helvetica", sans-serif;
					background-repeat: no-repeat;
				}
			`,
			fixed: `
				a {
					width: 100%;
					height: 100%;

					font-size: 14px;
					font-family: "Arial", "Helvetica", sans-serif;

					background-repeat: no-repeat;
				}
			`,
		},
		{
			description: 'fix empty line before, order is fine',
			code: `
				a {
					width: 100%;
					height: 100%;
					font-size: 14px;
					font-family: "Arial", "Helvetica", sans-serif;
					background-repeat: no-repeat;
				}
			`,
			fixed: `
				a {
					width: 100%;
					height: 100%;

					font-size: 14px;
					font-family: "Arial", "Helvetica", sans-serif;

					background-repeat: no-repeat;
				}
			`,
		},
	],
});

// Ensure compatibility with emptyLineBeforeUnspecified
testRule(rule, {
	ruleName,
	config: [
		['height', 'width'],
		{
			unspecified: 'bottom',
			emptyLineBeforeUnspecified: 'threshold',
			emptyLineMinimumPropertyThreshold: 4,
		},
	],
	fix: true,

	accept: [
		{
			description: 'emptyLineBeforeUnspecified-compat-1',
			code: `
				a {
					height: 1px;
					width: 2px;
					color: blue;
				}
			`,
		},
		{
			description: 'emptyLineBeforeUnspecified-compat-2',
			code: `
				a {
					height: 1px;
					width: 2px;

					color: blue;
					transform: none;
				}
			`,
		},
	],

	reject: [
		{
			description: 'emptyLineBeforeUnspecified-compat-3',
			code: `
				a {
					height: 1px;
					width: 2px;
					color: blue;
					transform: none;
				}
			`,
			fixed: `
				a {
					height: 1px;
					width: 2px;

					color: blue;
					transform: none;
				}
			`,
			message: messages.expectedEmptyLineBefore('color'),
		},
	],
});

// Documented example verification
testRule(rule, {
	ruleName,
	config: [
		[
			{
				emptyLineBefore: 'threshold',
				properties: ['display'],
			},
			{
				emptyLineBefore: 'threshold',
				properties: ['height', 'width'],
			},
			{
				emptyLineBefore: 'always',
				properties: ['border'],
			},
			{
				emptyLineBefore: 'never',
				properties: ['transform'],
			},
		],
		{
			emptyLineMinimumPropertyThreshold: 4,
		},
	],
	fix: true,

	accept: [
		{
			description: 'example-accept-1',
			code: `
				a {
					display: block;
					height: 1px;
					width: 2px;
				}
			`,
		},
		{
			description: 'example-accept-2',
			code: `
				a {
					display: block;
					height: 1px;

					border: 0;
				}
			`,
		},
		{
			description: 'example-accept-3',
			code: `
				a {
					display: block;

					height: 1px;
					width: 2px;

					border: 0;
				}
			`,
		},
		{
			description: 'example-accept-4',
			code: `
				a {
					display: block;

					height: 1px;
					width: 2px;

					border: 0;
					transform: none;
				}
			`,
		},
	],

	reject: [
		{
			description: 'example-reject-1',
			code: `
				a {
					display: block;

					height: 1px;
					width: 2px;
				}
			`,
			fixed: `
				a {
					display: block;
					height: 1px;
					width: 2px;
				}
			`,
			message: messages.rejectedEmptyLineBefore('height'),
		},
		{
			description: 'example-reject-2',
			code: `
				a {
					display: block;

					height: 1px;
					border: 0;
				}
			`,
			fixed: `
				a {
					display: block;
					height: 1px;

					border: 0;
				}
			`,
			message: messages.rejectedEmptyLineBefore('height'),
		},
		{
			description: 'example-reject-3',
			code: `
				a {
					display: block;
					height: 1px;
					width: 2px;
					border: 0;
				}
			`,
			fixed: `
				a {
					display: block;

					height: 1px;
					width: 2px;

					border: 0;
				}
			`,
			message: messages.expectedEmptyLineBefore('height'),
		},
		{
			description: 'example-reject-4',
			code: `
				a {
					display: block;
					height: 1px;
					width: 2px;
					transform: none;
				}
			`,
			fixed: `
				a {
					display: block;

					height: 1px;
					width: 2px;
					transform: none;
				}
			`,
			message: messages.expectedEmptyLineBefore('height'),
		},
	],
});

// Verify mix of settings
testRule(rule, {
	ruleName,
	config: [
		[
			{
				emptyLineBefore: 'threshold',
				properties: ['display'],
			},
			{
				emptyLineBefore: 'threshold',
				properties: ['height', 'width'],
			},
			{
				emptyLineBefore: 'always',
				properties: ['border'],
			},
			{
				emptyLineBefore: 'never',
				properties: ['transform'],
			},
		],
		{
			unspecified: 'bottom',
			emptyLineBeforeUnspecified: 'threshold',
			emptyLineMinimumPropertyThreshold: 4,
		},
	],
	fix: true,

	accept: [
		{
			description: 'mixed-accept-1',
			code: `
				a {
					display: block;
					height: 1px;
					width: 2px;
				}
			`,
		},
		{
			description: 'mixed-accept-2',
			code: `
				a {
					display: block;

					height: 1px;
					width: 2px;

					border: 0;
				}
			`,
		},
		{
			description: 'mixed-accept-3',
			code: `
				a {
					display: block;

					height: 1px;
					width: 2px;

					border: 0;
					transform: none;
				}
			`,
		},
		{
			description: 'mixed-accept-4',
			code: `
				a {
					display: block;
					height: 1px;

					border: 0;
				}
			`,
		},
		{
			description: 'mixed-accept-5',
			code: `
				a {
					border: 0;
					transform: none;
					color: blue;
				}
			`,
		},
		{
			description: 'mixed-accept-6',
			code: `
				a {
					display: block;
					
					height: 1px;
					width: 2px;
					
					border: 0;
					transform: none;
					
					color: blue;
				}
			`,
		},
	],

	reject: [
		{
			description: 'mixed-reject-1',
			code: `
				a {
					display: block;

					height: 1px;
					width: 2px;
					color: blue;
				}
			`,
			fixed: `
				a {
					display: block;

					height: 1px;
					width: 2px;

					color: blue;
				}
			`,
			message: messages.expectedEmptyLineBefore('color'),
		},
		{
			description: 'mixed-reject-2',
			code: `
				a {
					display: block;

					height: 1px;
					width: 2px;
					border: 0;
					color: blue;
				}
			`,
			fixed: `
				a {
					display: block;

					height: 1px;
					width: 2px;

					border: 0;

					color: blue;
				}
			`,
			message: messages.expectedEmptyLineBefore('border'),
		},
		{
			description: 'mixed-reject-3',
			code: `
				a {
					display: block;

					height: 1px;
					width: 2px;
					border: 0;

					transform: none;
					color: blue;
				}
			`,
			fixed: `
				a {
					display: block;

					height: 1px;
					width: 2px;

					border: 0;
					transform: none;

					color: blue;
				}
			`,
			message: messages.expectedEmptyLineBefore('border'),
		},
	],
});
