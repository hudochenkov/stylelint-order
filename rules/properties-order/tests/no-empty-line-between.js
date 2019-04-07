const rule = require('..');
const { ruleName, messages } = rule;

testRule(rule, {
	ruleName,
	config: [
		[
			{
				noEmptyLineBetween: true,
				properties: ['display', 'vertical-align', 'content'],
			},
			{
				noEmptyLineBetween: true,
				properties: ['position', 'top', 'bottom'],
			},
		],
	],
	fix: true,

	accept: [
		{
			code: `
				a {
					display: block;
					vertical-align: middle;
					content: "";
					position: absolute;
					top: 0;
					bottom: 0;
				}
			`,
		},
		{
			code: `
				a {
					display: block;
					vertical-align: middle;
					content: "";

					position: absolute;
					top: 0;
					bottom: 0;
				}
			`,
		},
		{
			code: `
				a {
					vertical-align: middle;

					top: 0;
					bottom: 0;
				}
			`,
		},
	],

	reject: [
		{
			code: `
				a {
					display: block;

					vertical-align: middle;
					content: "";
				}
			`,
			fixed: `
				a {
					display: block;
					vertical-align: middle;
					content: "";
				}
			`,
			message: messages.rejectedEmptyLineBefore('vertical-align'),
		},
		{
			code: `
				a {
					display: block;
					vertical-align: middle;


					content: "";
				}
			`,
			fixed: `
				a {
					display: block;
					vertical-align: middle;
					content: "";
				}
			`,
			message: messages.rejectedEmptyLineBefore('content'),
		},
	],
});

testRule(rule, {
	ruleName,
	config: [
		[
			{
				noEmptyLineBetween: true,
				properties: ['display', 'vertical-align', 'content'],
			},
			{
				noEmptyLineBetween: true,
				properties: ['position', 'top', 'bottom'],
			},
		],
	],
	syntax: 'css-in-js',
	fix: true,

	accept: [
		{
			code: `
				const Component = styled.div\`
					display: block;
					vertical-align: middle;
					content: "";
					position: absolute;
					top: 0;
					bottom: 0;
				\`;
			`,
		},
	],

	reject: [
		{
			code: `
				const Component = styled.div\`
					display: block;

					vertical-align: middle;
					content: "";
				\`;
			`,
			fixed: `
				const Component = styled.div\`
					display: block;
					vertical-align: middle;
					content: "";
				\`;
			`,
			message: messages.rejectedEmptyLineBefore('vertical-align'),
		},
	],
});

testRule(rule, {
	ruleName,
	config: [
		[
			{
				emptyLineBefore: 'always',
				noEmptyLineBetween: true,
				properties: ['display', 'vertical-align', 'content'],
			},
			{
				emptyLineBefore: 'always',
				noEmptyLineBetween: true,
				properties: ['position', 'top', 'bottom'],
			},
		],
	],
	fix: true,

	accept: [
		{
			code: `
				a {
					display: block;
					vertical-align: middle;
					content: "";

					position: absolute;
					top: 0;
					bottom: 0;
				}
			`,
		},
		{
			code: `
				a {
					vertical-align: middle;

					top: 0;
					bottom: 0;
				}
			`,
		},
	],

	reject: [
		{
			code: `
				a {
					display: block;

					vertical-align: middle;
					content: "";
				}
			`,
			fixed: `
				a {
					display: block;
					vertical-align: middle;
					content: "";
				}
			`,
			message: messages.rejectedEmptyLineBefore('vertical-align'),
		},
	],
});
