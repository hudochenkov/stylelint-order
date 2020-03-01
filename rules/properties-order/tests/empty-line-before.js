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
			message: messages.expectedEmptyLineBefore('position'),
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
			message: messages.expectedEmptyLineBefore('border-bottom'),
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
			message: messages.expectedEmptyLineBefore('position'),
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
			message: messages.expectedEmptyLineBefore('font-style'),
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
			message: messages.expectedEmptyLineBefore('border-bottom'),
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
			message: messages.expectedEmptyLineBefore('border-bottom'),
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
			message: messages.expectedEmptyLineBefore('position'),
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
			message: messages.expectedEmptyLineBefore('position'),
		},
		{
			description: '22',
			code: `
				a {

					display: none;
				}
			`,
			fixed: `
				a {
					display: none;
				}
			`,
			message: messages.rejectedEmptyLineBefore('display'),
		},
		{
			description: '23',
			code: `
				a {

					position: absolute;
				}
			`,
			fixed: `
				a {
					position: absolute;
				}
			`,
			message: messages.rejectedEmptyLineBefore('position'),
		},
		{
			description: '24',
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
	],

	accept: [
		{
			description: '10',
			code: `
				a {
					display: none;

					@media (min-width: 100px) {}

					position: absolute;
				}
			`,
		},
		{
			description: '11',
			code: `
				a {
					display: none;
					@media (min-width: 100px) {}
					position: absolute;
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
				emptyLineBefore: 'never',
				properties: ['display'],
			},
			{
				emptyLineBefore: 'never',
				properties: ['position'],
			},
			{
				emptyLineBefore: 'never',
				properties: ['border-bottom', 'font-style'],
			},
		],
	],
	fix: true,

	accept: [
		{
			description: '22',
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
			description: '23',
			code: `
				a {
					display: none;
					position: absolute;
					font-style: italic;
				}
			`,
		},
		{
			description: '24',
			code: `
				a {
					display: none;
					font-style: italic;
				}
			`,
		},
		{
			description: '25',
			code: `
				a {
					position: absolute;
					border-bottom: 1px solid red;
				}
			`,
		},
		{
			description: '26',
			code: `
				a {
					display: none;
					border-bottom: 1px solid red;
				}
			`,
		},
		{
			description: '27',
			code: `
				a {
					display: none; /* comment */
					position: absolute;
				}
			`,
		},
		{
			description: '28',
			code: `
				a {
					display: none;

					/* comment */
					position: absolute;
				}
			`,
		},
		{
			description: '29',
			code: `
				a {
					/* comment */
					display: none;
					position: absolute;
				}
			`,
		},
		{
			description: '30',
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
			description: '33',
			code: `
				a {
					--display: none;

					position: absolute;
				}
			`,
		},
		{
			description: '34',
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
			description: '35',
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
			description: '36',
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
			description: '37',
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
			description: '38',
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
			description: '39',
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
			description: '40',
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
			description: '41',
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
			description: '42',
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

testRule(rule, {
	ruleName,
	config: [
		[
			{
				emptyLineBefore: 'never',
				properties: ['display'],
			},
			{
				emptyLineBefore: 'never',
				properties: ['position'],
			},
			{
				emptyLineBefore: 'never',
				properties: ['border-bottom', 'font-style'],
			},
		],
	],

	accept: [
		{
			description: '31',
			code: `
				a {
					display: none;

					@media (min-width: 100px) {}

					position: absolute;
				}
			`,
		},
		{
			description: '32',
			code: `
				a {
					display: none;
					@media (min-width: 100px) {}
					position: absolute;
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
				properties: ['border-bottom', 'font-style'],
			},
			{
				emptyLineBefore: 'never',
				properties: ['position'],
			},
			{
				emptyLineBefore: 'always',
				properties: ['display'],
			},
		],
	],
	fix: true,

	accept: [
		{
			description: '43',
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
			description: '44',
			code: `
				a {
					font-style: italic;
					position: absolute;

					display: none;
				}
			`,
		},
		{
			description: '45',
			code: `
				a {
					font-style: italic;

					display: none;
				}
			`,
		},
		{
			description: '46',
			code: `
				a {
					border-bottom: 1px solid red;
					position: absolute;
				}
			`,
		},
		{
			description: '47',
			code: `
				a {
					border-bottom: 1px solid red;

					display: none;
				}
			`,
		},
		{
			description: '48',
			code: `
				a {
					position: absolute; /* comment */

					display: none;
				}
			`,
		},
		{
			description: '49',
			code: `
				a {
					position: absolute;

					/* comment */
					display: none;
				}
			`,
		},
		{
			description: '50',
			code: `
				a {
					position: absolute;
					/* comment */
					display: none;
				}
			`,
		},
		{
			description: '51',
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
			description: '54',
			code: `
				a {
					--display: none;
					position: absolute;
				}
			`,
		},
		{
			description: '55',
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
			description: '56',
			code: `
				a {
					border-bottom: 1px solid red;
					font-style: italic;
					position: absolute;
					display: none;
				}
			`,
			fixed: `
				a {
					border-bottom: 1px solid red;
					font-style: italic;
					position: absolute;

					display: none;
				}
			`,
			message: messages.expectedEmptyLineBefore('display'),
		},
		{
			description: '57',
			code: `
				a {
					border-bottom: 1px solid red;
					font-style: italic;

					position: absolute;

					display: none;
				}
			`,
			fixed: `
				a {
					border-bottom: 1px solid red;
					font-style: italic;
					position: absolute;

					display: none;
				}
			`,
			message: messages.rejectedEmptyLineBefore('position'),
		},
		{
			description: '58',
			code: `
				a {
					font-style: italic;
					position: absolute;
					display: none;
				}
			`,
			fixed: `
				a {
					font-style: italic;
					position: absolute;

					display: none;
				}
			`,
			message: messages.expectedEmptyLineBefore('display'),
		},
		{
			description: '59',
			code: `
				a {
					font-style: italic;
					display: none;
				}
			`,
			fixed: `
				a {
					font-style: italic;

					display: none;
				}
			`,
			message: messages.expectedEmptyLineBefore('display'),
		},
		{
			description: '60',
			code: `
				a {
					border-bottom: 1px solid red;

					position: absolute;
				}
			`,
			fixed: `
				a {
					border-bottom: 1px solid red;
					position: absolute;
				}
			`,
			message: messages.rejectedEmptyLineBefore('position'),
		},
		{
			description: '61',
			code: `
				a {
					border-bottom: 1px solid red;
					display: none;
				}
			`,
			fixed: `
				a {
					border-bottom: 1px solid red;

					display: none;
				}
			`,
			message: messages.expectedEmptyLineBefore('display'),
		},
		{
			description: '62',
			code: `
				a {
					position: absolute; /* comment */
					display: none;
				}
			`,
			fixed: `
				a {
					position: absolute; /* comment */

					display: none;
				}
			`,
			message: messages.expectedEmptyLineBefore('display'),
		},
	],
});

testRule(rule, {
	ruleName,
	config: [
		[
			{
				emptyLineBefore: 'always',
				properties: ['border-bottom', 'font-style'],
			},
			{
				emptyLineBefore: 'never',
				properties: ['position'],
			},
			{
				emptyLineBefore: 'always',
				properties: ['display'],
			},
		],
	],

	accept: [
		{
			description: '52',
			code: `
				a {
					position: absolute;

					@media (min-width: 100px) {}

					display: none;
				}
			`,
		},
		{
			description: '53',
			code: `
				a {
					position: absolute;
					@media (min-width: 100px) {}
					display: none;
				}
			`,
		},
	],
});

testRule(rule, {
	ruleName,
	config: [
		[
			'height',
			'width',
			{
				emptyLineBefore: 'always',
				properties: ['display'],
			},
		],
	],
	fix: true,

	accept: [
		{
			description: '63',
			code: `
				a {
					height: 10px;
					width: 10px;

					display: none;
				}
			`,
		},
		{
			description: '64',
			code: `
				a {
					height: 10px;

					display: none;
				}
			`,
		},
		{
			description: '65',
			code: `
				a {
					display: none;
				}
			`,
		},
		{
			description: '67',
			code: `
				a {
					height: 10px;
				}
			`,
		},
		{
			description: '68',
			code: `
				a {
					height: 10px;
					width: 10px; /* comment */

					display: none;
				}
			`,
		},
		{
			description: '69',
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
			description: '70',
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
			description: '71',
			code: `
				a {
					height: 10px;
					width: 10px;
					display: none;
				}
			`,
			fixed: `
				a {
					height: 10px;
					width: 10px;

					display: none;
				}
			`,
			message: messages.expectedEmptyLineBefore('display'),
		},
		{
			description: '72',
			code: `
				a {
					height: 10px;
					display: none;
				}
			`,
			fixed: `
				a {
					height: 10px;

					display: none;
				}
			`,
			message: messages.expectedEmptyLineBefore('display'),
		},
		{
			description: '73',
			code: `
				a {
					height: 10px;
					width: 10px; /* comment */
					display: none;
				}
			`,
			fixed: `
				a {
					height: 10px;
					width: 10px; /* comment */

					display: none;
				}
			`,
			message: messages.expectedEmptyLineBefore('display'),
		},
		{
			description: '73.1',
			code: `
				a {

					display: none;
				}
			`,
			fixed: `
				a {
					display: none;
				}
			`,
			message: messages.rejectedEmptyLineBefore('display'),
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
				properties: ['border'],
			},
		],
	],
	fix: true,

	accept: [
		{
			description: '74',
			code: `
				a {
					display: none;

					border: none;
				}
			`,
		},
	],

	reject: [
		{
			description: '75',
			code: `
				a {
					display: none;
					border: none;
				}
			`,
			fixed: `
				a {
					display: none;

					border: none;
				}
			`,
			message: messages.expectedEmptyLineBefore('border'),
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
				properties: ['position'],
			},
		],
	],
	fix: true,

	accept: [
		{
			description: '76',
			code: `
				a {
					display: none;

					position: absolute;
				}
			`,
		},
		{
			description: '77',
			code: `
				a {
					display: none;
					position: absolute;
				}
			`,
		},
	],

	reject: [],
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
				properties: ['position'],
			},
			{
				emptyLineBefore: 'always',
				properties: ['border-bottom', 'font-style'],
			},
		],
		{
			disableFix: true,
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
			description: '11',
			code: `
				a {
					display: none;
					@media (min-width: 100px) {}
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
			fixed: `
				a {
					display: none;
					position: absolute;

					border-bottom: 1px solid red;
					font-style: italic;
				}
			`,
			message: messages.expectedEmptyLineBefore('position'),
			description: `shouldn't apply fixes`,
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
			fixed: `
				a {
					display: none;

					position: absolute;
					border-bottom: 1px solid red;
					font-style: italic;
				}
			`,
			message: messages.expectedEmptyLineBefore('border-bottom'),
			description: `shouldn't apply fixes`,
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
