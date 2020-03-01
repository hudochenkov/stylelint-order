const rule = require('..');

const { ruleName, messages } = rule;

testRule(rule, {
	ruleName,
	config: [['my', 'transform', 'font-smoothing', 'top', 'transition', 'border', 'color']],
	fix: true,

	accept: [
		{
			code: 'a { color: pink; }',
		},
		{
			code: 'a { color: pink; color: red; }',
		},
		{
			code: 'a { top: 0; color: pink; }',
		},
		{
			code: 'a { -moz-transform: scale(1); -webkit-transform: scale(1); transform: scale(1); }',
		},
		{
			code: 'a { -webkit-transform: scale(1); -moz-transform: scale(1); transform: scale(1); }',
		},
		{
			code: 'a { -webkit-font-smoothing: antialiased; top: 0; color: pink; }',
		},
		{
			code: 'a { top: 0; color: pink; width: 0; }',
		},
		{
			code: 'a { top: 0; color: pink; width: 0; height: 0; }',
		},
		{
			code: 'a { @media (min-width: 10px) { color: pink; } top: 0; }',
			description: 'media query nested in rule has its own ordering',
		},
		{
			code: 'a { border: 1px solid; color: pink; }',
		},
		{
			code: 'a { transition: none; border: 1px solid; }',
		},
		{
			code: 'a { top: 0; color: pink; width: 0; height: 0; display: none; }',
		},
		{
			code: 'a { top: 0; color: pink; display: none; width: 0; height: 0; }',
		},
	],

	reject: [
		{
			code: 'a { color: pink; top: 0;  }',
			fixed: 'a { top: 0; color: pink;  }',
			message: messages.expected('top', 'color'),
		},
		{
			code: 'a { top: 0; transform: scale(1); color: pink; }',
			fixed: 'a { transform: scale(1); top: 0; color: pink; }',
			message: messages.expected('transform', 'top'),
		},
		{
			code: 'a { -moz-transform: scale(1); transform: scale(1); -webkit-transform: scale(1); }',
			fixed: 'a { -moz-transform: scale(1); -webkit-transform: scale(1); transform: scale(1); }',
			message: messages.expected('-webkit-transform', 'transform'),
		},
		{
			code: 'a { color: pink; -webkit-font-smoothing: antialiased; }',
			fixed: 'a { -webkit-font-smoothing: antialiased; color: pink; }',
			message: messages.expected('-webkit-font-smoothing', 'color'),
		},
		{
			code: 'a { color: pink; border: 1px solid; }',
			fixed: 'a { border: 1px solid; color: pink; }',
			message: messages.expected('border', 'color'),
		},
		{
			code: 'a { border: 1px solid; transition: "foo"; }',
			fixed: 'a { transition: "foo"; border: 1px solid; }',
			message: messages.expected('transition', 'border'),
		},
		{
			code: 'a { @media (min-width: 10px) { color: pink; top: 0; } transform: scale(1); }',
			fixed: 'a { @media (min-width: 10px) { top: 0; color: pink; } transform: scale(1); }',
			description: 'media query nested in rule can violates its own ordering',
			message: messages.expected('top', 'color'),
		},
	],
});

testRule(rule, {
	ruleName,
	config: [['my', 'transform', 'font-smoothing', 'top', 'transition', 'border', 'color']],

	accept: [
		{
			code: 'a { my-property: 2em; -webkit-font-smoothing: antialiased; }',
		},
		{
			code: 'a { display: none; top: 0; color: pink; width: 0; height: 0; }',
		},
	],
});

testRule(rule, {
	ruleName,
	config: [
		[
			'padding',
			'padding-top',
			'padding-right',
			'padding-left',
			'border',
			'border-top',
			'border-right',
			'color',
		],
	],
	fix: true,

	accept: [
		{
			code: 'a { padding: 1px; color: pink; }',
		},
		{
			code: 'a { padding-top: 1px; color: pink; }',
		},
		{
			code: 'a { padding-left: 1px; color: pink; }',
		},
		{
			code: 'a { padding-top: 1px; padding-right: 0; color: pink; }',
		},
		{
			code: 'a { border: 1px solid #fff; border-right: 2px solid #fff; border-right-color: #000; }',
		},
		{
			code: 'a { border: 1px solid #fff; border-top: none; border-right-color: #000; }',
		},
	],

	reject: [
		{
			code: 'a { color: pink; padding: 1px; }',
			fixed: 'a { padding: 1px; color: pink; }',
			message: messages.expected('padding', 'color'),
		},
		{
			code: 'a { color: pink; padding-top: 1px; }',
			fixed: 'a { padding-top: 1px; color: pink; }',
			message: messages.expected('padding-top', 'color'),
		},
		{
			code: 'a { padding-right: 1px; padding-top: 0; color: pink;  }',
			fixed: 'a { padding-top: 0; padding-right: 1px; color: pink;  }',
			message: messages.expected('padding-top', 'padding-right'),
		},
	],
});

testRule(rule, {
	ruleName,
	config: [
		[
			'padding',
			'padding-top',
			'padding-right',
			'padding-left',
			'border',
			'border-top',
			'border-right',
			'color',
		],
	],

	accept: [
		{
			code:
				'a { padding-bottom: 0; padding-top: 1px; padding-right: 0; padding-left: 0; color: pink; }',
		},
		{
			code: 'a { padding: 1px; padding-bottom: 0; padding-left: 0; color: pink; }',
		},
	],
});

testRule(rule, {
	ruleName,
	config: [
		['height', 'color'],
		{
			unspecified: 'top',
		},
	],
	fix: true,

	accept: [
		{
			code: 'a { top: 0; height: 1px; color: pink; }',
		},
		{
			code: 'a { bottom: 0; top: 0; }',
		},
	],

	reject: [
		{
			code: 'a { height: 1px; top: 0; }',
			fixed: 'a { top: 0; height: 1px; }',
			message: messages.expected('top', 'height'),
		},
		{
			code: 'a { color: 1px; top: 0; }',
			fixed: 'a { top: 0; color: 1px; }',
			message: messages.expected('top', 'color'),
		},
	],
});

testRule(rule, {
	ruleName,
	config: [
		['height', 'color'],
		{
			unspecified: 'bottom',
		},
	],
	fix: true,

	accept: [
		{
			code: 'a { height: 1px; color: pink; bottom: 0; }',
		},
		{
			code: 'a { bottom: 0; top: 0; }',
		},
	],

	reject: [
		{
			code: 'a { bottom: 0; height: 1px; }',
			fixed: 'a { height: 1px; bottom: 0; }',
			message: messages.expected('height', 'bottom'),
		},
		{
			code: 'a { bottom: 0; color: 1px; }',
			fixed: 'a { color: 1px; bottom: 0; }',
			message: messages.expected('color', 'bottom'),
		},
	],
});

testRule(rule, {
	ruleName,
	config: [
		['all', 'compose'],
		{
			unspecified: 'bottomAlphabetical',
		},
	],
	fix: true,

	accept: [
		{
			code: 'a { all: initial; compose: b; }',
		},
		{
			code: 'a { bottom: 0; top: 0; }',
		},
		{
			code: 'a { all: initial; compose: b; bottom: 0; top: 0; }',
		},
	],

	reject: [
		{
			code: 'a { align-items: flex-end; all: initial; }',
			fixed: 'a { all: initial; align-items: flex-end; }',
			message: messages.expected('all', 'align-items'),
		},
		{
			code: 'a { compose: b; top: 0; bottom: 0; }',
			fixed: 'a { compose: b; bottom: 0; top: 0; }',
			message: messages.expected('bottom', 'top'),
		},
	],
});

testRule(rule, {
	ruleName,
	config: [['left', 'margin']],
	fix: true,

	accept: [
		{
			code: '.foo { left: 0; color: pink; margin: 0; }',
		},
	],

	reject: [
		{
			description: `report incorrect order if there're properties with undefined order`,
			code: '.foo { margin: 0; color: pink; left: 0; }',
			fixed: '.foo { left: 0; margin: 0; color: pink; }',
			message: messages.expected('left', 'margin'),
		},
	],
});

testRule(rule, {
	ruleName,
	config: [
		['my', 'transform', 'font-smoothing', 'top', 'transition', 'border', 'color'],
		{
			disableFix: true,
		},
	],
	fix: true,

	accept: [
		{
			code: 'a { color: pink; color: red; }',
		},
		{
			code: 'a { top: 0; color: pink; }',
		},
	],

	reject: [
		{
			code: 'a { color: pink; top: 0;  }',
			fixed: 'a { color: pink; top: 0;  }',
			message: messages.expected('top', 'color'),
			description: `shouldn't apply fixes`,
		},
		{
			code: 'a { top: 0; transform: scale(1); color: pink; }',
			fixed: 'a { top: 0; transform: scale(1); color: pink; }',
			message: messages.expected('transform', 'top'),
			description: `shouldn't apply fixes`,
		},
	],
});

testRule(rule, {
	ruleName,
	config: [['top', 'color']],
	syntax: 'css-in-js',
	fix: true,

	accept: [
		{
			code: `
				const Component = styled.div\`
					top: 0;
					color: tomato;
				\`;
			`,
		},
		{
			code: `
				const Component = styled.div\`
					top: 0;
					\${props => props.great && 'color: red;'}
					color: tomato;
				\`;
			`,
		},
		{
			code: `
				const Component = styled.div\`
					top: 0;
					\${props => props.great && 'color: red;'}
					color: tomato;

					a {
						top: 0;
						color: tomato;
					}
				\`;
			`,
		},
		{
			code: `
				const Component = styled.div\`
					top: 0;
					color: tomato;

					a {
						top: 0;
						\${props => props.great && 'color: red;'}
						color: tomato;
					}
				\`;
			`,
		},
	],

	reject: [
		{
			code: `
				const Component = styled.div\`
					color: tomato;
					top: 0;
				\`;
			`,
			fixed: `
				const Component = styled.div\`
					top: 0;
					color: tomato;
				\`;
			`,
		},
		{
			code: `
				const Component = styled.div\`
					color: tomato;
					\${props => props.great && 'color: red;'}
					top: 0;
				\`;
			`,
			fixed: `
				const Component = styled.div\`
					color: tomato;
					\${props => props.great && 'color: red;'}
					top: 0;
				\`;
			`,
		},
		{
			code: `
				const Component = styled.div\`
					color: tomato;
					\${props => props.great && 'color: red;'}
					top: 0;

					a {
						top: 0;
						color: tomato;
					}
				\`;
			`,
			fixed: `
				const Component = styled.div\`
					color: tomato;
					\${props => props.great && 'color: red;'}
					top: 0;

					a {
						top: 0;
						color: tomato;
					}
				\`;
			`,
		},
		{
			code: `
				const Component = styled.div\`
					top: 0;
					color: tomato;

					a {
						color: tomato;
						\${props => props.great && 'color: red;'}
						top: 0;
					}
				\`;
			`,
			fixed: `
				const Component = styled.div\`
					top: 0;
					color: tomato;

					a {
						color: tomato;
						\${props => props.great && 'color: red;'}
						top: 0;
					}
				\`;
			`,
		},
	],
});

testRule(rule, {
	ruleName,
	config: [['top', 'color']],
	syntax: 'html',
	fix: true,

	accept: [
		{
			code: `
				<!DOCTYPE html>
				<html>
				<head>
					<style>
						a {
							top: 0;
							color: tomato;
						}
					</style>
				</head>
				<body>
				</body>
				</html>
			`,
		},
		{
			code: `
				<!DOCTYPE html>
				<html>
				<body>
					<div style="top: 0;color: tomato;"></div>
				</body>
				</html>
			`,
		},
	],

	reject: [
		{
			code: `
				<!DOCTYPE html>
				<html>
				<head>
					<style>
						a {
							color: tomato;
							top: 0;
						}
					</style>
				</head>
				<body>
				</body>
				</html>
			`,
			fixed: `
				<!DOCTYPE html>
				<html>
				<head>
					<style>
						a {
							top: 0;
							color: tomato;
						}
					</style>
				</head>
				<body>
				</body>
				</html>
			`,
		},
		{
			code: `
				<!DOCTYPE html>
				<html>
				<body>
					<div style="color: tomato;top: 0;"></div>
				</body>
				</html>
			`,
			fixed: `
				<!DOCTYPE html>
				<html>
				<body>
					<div style="top: 0;color: tomato;"></div>
				</body>
				</html>
			`,
		},
	],
});
