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
	],

	reject: [
		{
			description: '6',
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
			description: '7',
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
			description: '8',
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
			description: '9',
			code: `
				a {
					height: 20px;
					/* other props */
					font-style: italic;
				}
			`,
			fixed: `
				a {
					height: 20px;

					/* other props */
					font-style: italic;
				}
			`,
			message: messages.expectedEmptyLineBefore('undefined'),
		},
	],
});
