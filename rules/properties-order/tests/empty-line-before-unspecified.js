const rule = require('..');

const { ruleName, messages } = rule;

testRule(rule, {
	ruleName,
	config: [
		['height', 'width'],
		{
			unspecified: 'bottom',
			emptyLineBeforeUnspecified: 'always',
		},
	],
	fix: true,

	accept: [
		{
			description: '1',
			code: `
				a {
					height: 20px;

					width: 20px;

					font-style: italic;
				}
			`,
		},
		{
			description: '2',
			code: `
				a {
					height: 20px;
					width: 20px;

					font-style: italic;
				}
			`,
		},
		{
			description: '3',
			code: `
				a {
					height: 20px;

					font-style: italic;
				}
			`,
		},
		{
			description: '4',
			code: `
				a {
					font-style: italic;
				}
			`,
		},
		{
			description: '5',
			code: `
				a {
				}
			`,
		},
		{
			description: '6',
			code: `
				a {
					height: 20px;
					/* other props */
					font-style: italic;
				}
			`,
		},
		{
			description: '7',
			code: `
				a {
					height: 20px;

					/* other props */
					font-style: italic;
				}
			`,
		},
		{
			description: '8',
			code: `
				a {
					height: 20px;
					width: 20px;

					b {
						font-style: italic;
					}
				}
			`,
		},
		{
			description: '9',
			code: `
				a {
					height: 20px;
					width: 20px;
					b {
						font-style: italic;
					}
				}
			`,
		},
	],

	reject: [
		{
			description: '10',
			code: `
				a {
					height: 20px;

					width: 20px;
					font-style: italic;
				}
			`,
			fixed: `
				a {
					height: 20px;

					width: 20px;

					font-style: italic;
				}
			`,
			message: messages.expectedEmptyLineBefore('font-style'),
		},
		{
			description: '11',
			code: `
				a {
					height: 20px;
					width: 20px;
					font-style: italic;
				}
			`,
			fixed: `
				a {
					height: 20px;
					width: 20px;

					font-style: italic;
				}
			`,
			message: messages.expectedEmptyLineBefore('font-style'),
		},
		{
			description: '12',
			code: `
				a {
					height: 20px;
					font-style: italic;
				}
			`,
			fixed: `
				a {
					height: 20px;

					font-style: italic;
				}
			`,
			message: messages.expectedEmptyLineBefore('font-style'),
		},
		{
			description: '12',
			code: `
				a {

					font-style: italic;
				}
			`,
			fixed: `
				a {
					font-style: italic;
				}
			`,
			message: messages.rejectedEmptyLineBefore('font-style'),
		},
	],
});

testRule(rule, {
	ruleName,
	config: [
		['height', 'width'],
		{
			unspecified: 'bottom',
			emptyLineBeforeUnspecified: 'never',
		},
	],
	fix: true,

	accept: [
		{
			description: '13',
			code: `
				a {
					height: 20px;

					width: 20px;
					font-style: italic;
				}
			`,
		},
		{
			description: '14',
			code: `
				a {
					height: 20px;
					width: 20px;
					font-style: italic;
				}
			`,
		},
		{
			description: '15',
			code: `
				a {
					height: 20px;
					font-style: italic;
				}
			`,
		},
		{
			description: '16',
			code: `
				a {
					font-style: italic;
				}
			`,
		},
		{
			description: '17',
			code: `
				a {
				}
			`,
		},
		{
			description: '18',
			code: `
				a {
					height: 20px;
					/* other props */
					font-style: italic;
				}
			`,
		},
		{
			description: '19',
			code: `
				a {
					height: 20px;

					/* other props */
					font-style: italic;
				}
			`,
		},
		{
			description: '20',
			code: `
				a {
					height: 20px;
					width: 20px;

					b {
						font-style: italic;
					}
				}
			`,
		},
		{
			description: '21',
			code: `
				a {
					height: 20px;
					width: 20px;
					b {
						font-style: italic;
					}
				}
			`,
		},
	],

	reject: [
		{
			description: '22',
			code: `
				a {
					height: 20px;

					width: 20px;

					font-style: italic;
				}
			`,
			fixed: `
				a {
					height: 20px;

					width: 20px;
					font-style: italic;
				}
			`,
			message: messages.rejectedEmptyLineBefore('font-style'),
		},
		{
			description: '23',
			code: `
				a {
					height: 20px;
					width: 20px;

					font-style: italic;
				}
			`,
			fixed: `
				a {
					height: 20px;
					width: 20px;
					font-style: italic;
				}
			`,
			message: messages.rejectedEmptyLineBefore('font-style'),
		},
		{
			description: '24',
			code: `
				a {
					height: 20px;

					font-style: italic;
				}
			`,
			fixed: `
				a {
					height: 20px;
					font-style: italic;
				}
			`,
			message: messages.rejectedEmptyLineBefore('font-style'),
		},
	],
});
