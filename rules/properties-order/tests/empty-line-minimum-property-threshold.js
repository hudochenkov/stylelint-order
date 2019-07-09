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
			message: messages.rejectedEmptyLineBefore('border-bottom'),
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
			message: messages.expectedEmptyLineBefore('font-style'),
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
	],
});
