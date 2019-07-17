const rule = require('..');
const { ruleName, messages } = rule;

testRule(rule, {
	ruleName,
	config: [
		[
			{
				emptyLineBefore: 'always',
				properties: ['display'],
			},
			{
				emptyLineBefore: 'always',
				properties: ['position'],
			},
			{
				emptyLineBefore: 'always',
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
				emptyLineBefore: 'always',
				properties: ['width', 'height'],
			},
			{
				emptyLineBefore: 'always',
				properties: ['font-size', 'font-family'],
			},
			{
				emptyLineBefore: 'always',
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

testRule(rule, {
	ruleName,
	config: [
		[
			{
				emptyLineBefore: 'always',
				properties: ['display'],
			},
			{
				emptyLineBefore: 'always',
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
					width: 2px;
				
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
			description: 'example-reject-3',
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
