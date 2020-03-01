const rule = require('..');

const { ruleName, messages } = rule;

testRule(rule, {
	ruleName,
	config: [true],
	fix: true,

	accept: [
		{
			code: 'a { color: pink; }',
		},
		{
			code: 'a { color: pink; color: red; }',
		},
		{
			code: 'a { color: pink; color: red; } b { color: pink; color: red; }',
		},
		{
			code: 'a { color: pink; top: 0; }',
		},
		{
			code: 'a { border: 1px solid pink; border-left-width: 0; }',
		},
		{
			code: 'a { color: pink; top: 0; transform: scale(1); }',
		},
		{
			code: 'a { border-color: transparent; border-bottom-color: pink; }',
		},
		{
			code: 'a { -moz-transform: scale(1); -webkit-transform: scale(1); transform: scale(1); }',
		},
		{
			code: 'a { -webkit-transform: scale(1); -moz-transform: scale(1); transform: scale(1); }',
		},
		{
			code: 'a { color: pink; -webkit-font-smoothing: antialiased; top: 0; }',
		},
		{
			code: 'a {{ &:hover { color: red; top: 0; } } }',
		},
		{
			code: 'a { top: 0; { &:hover { color: red; } } }',
		},
		{
			code: 'a { top: 0; &:hover { color: red; } }',
		},
		{
			code: 'a { color: red; width: 0; { &:hover { color: red; top: 0; } } }',
		},
		{
			code: 'a { color: red; width: 0; &:hover { color: red; top: 0; } }',
		},
		{
			code: 'a { color: red; width: 0; @media print { color: red; top: 0; } }',
		},
		{
			code: 'a { $scss: 0; $a: 0; alpha: 0; }',
		},
		{
			code: 'a { @less: 0; @a: 0; alpha: 0; }',
		},
		{
			code: 'a { --custom-property: 0; --another: 0; alpha: 0; }',
		},
		{
			code:
				'a { font-size: 1px; -moz-osx-font-smoothing: grayscale; -webkit-font-smoothing: antialised; font-weight: bold; }',
		},
	],

	reject: [
		{
			code: 'a { top: 0; color: pink; }',
			fixed: 'a { color: pink; top: 0; }',
			message: messages.expected('color', 'top'),
		},
		{
			code: 'a { top: 0; color: pink; } b { color: pink; top: 0; }',
			fixed: 'a { color: pink; top: 0; } b { color: pink; top: 0; }',
			message: messages.expected('color', 'top'),
		},
		{
			code: 'a { color: pink; transform: scale(1); top: 0; }',
			fixed: 'a { color: pink; top: 0; transform: scale(1); }',
			message: messages.expected('top', 'transform'),
		},
		{
			code: 'a { border-bottom-color: pink; border-color: transparent; }',
			fixed: 'a { border-color: transparent; border-bottom-color: pink; }',
			message: messages.expected('border-color', 'border-bottom-color'),
		},
		{
			code:
				'a { color: pink; top: 0; -moz-transform: scale(1); transform: scale(1); -webkit-transform: scale(1); }',
			fixed:
				'a { color: pink; top: 0; -moz-transform: scale(1); -webkit-transform: scale(1); transform: scale(1); }',
			message: messages.expected('-webkit-transform', 'transform'),
		},
		{
			code:
				'a { color: pink; top: 0; transform: scale(0); -webkit-transform: scale(1); transform: scale(1); }',
			fixed:
				'a { color: pink; top: 0; -webkit-transform: scale(1); transform: scale(0); transform: scale(1); }',
			message: messages.expected('-webkit-transform', 'transform'),
		},
		{
			code: 'a { -webkit-font-smoothing: antialiased; color: pink;  top: 0; }',
			fixed: 'a { color: pink; -webkit-font-smoothing: antialiased;  top: 0; }',
			message: messages.expected('color', '-webkit-font-smoothing'),
		},
		{
			code: 'a { width: 0; { &:hover { top: 0; color: red; } } }',
			fixed: 'a { width: 0; { &:hover { color: red; top: 0; } } }',
			message: messages.expected('color', 'top'),
		},
		{
			code: 'a { &:hover { top: 0; color: red; }  }',
			fixed: 'a { &:hover { color: red; top: 0; }  }',
			message: messages.expected('color', 'top'),
		},
		{
			code: 'a { width: 0; &:hover { top: 0; color: red; } }',
			fixed: 'a { width: 0; &:hover { color: red; top: 0; } }',
			message: messages.expected('color', 'top'),
		},
		{
			code: 'a { width: 0; @media print { top: 0; color: red; } }',
			fixed: 'a { width: 0; @media print { color: red; top: 0; } }',
			message: messages.expected('color', 'top'),
		},
		{
			code: '@media print { top: 0; color: red; }',
			fixed: '@media print { color: red; top: 0; }',
			message: messages.expected('color', 'top'),
		},
	],
});

testRule(rule, {
	ruleName,
	config: [
		true,
		{
			disableFix: true,
		},
	],
	fix: true,

	accept: [
		{
			code: 'a { color: pink; top: 0; }',
		},
		{
			code: 'a { border: 1px solid pink; border-left-width: 0; }',
		},
	],

	reject: [
		{
			code: 'a { top: 0; color: pink; }',
			fixed: 'a { top: 0; color: pink; }',
			message: messages.expected('color', 'top'),
			description: `shouldn't apply fixes`,
		},
		{
			code: 'a { color: pink; transform: scale(1); top: 0; }',
			fixed: 'a { color: pink; transform: scale(1); top: 0; }',
			message: messages.expected('top', 'transform'),
			description: `shouldn't apply fixes`,
		},
	],
});

testRule(rule, {
	ruleName,
	config: [true],
	syntax: 'css-in-js',
	fix: true,

	accept: [
		{
			code: `
				const Component = styled.div\`
					color: tomato;
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
						color: tomato;
						top: 0;
					}
				\`;
			`,
		},
		{
			code: `
				const Component = styled.div\`
					color: tomato;
					top: 0;

					a {
						color: tomato;
						\${props => props.great && 'color: red;'}
						top: 0;
					}
				\`;
			`,
		},
	],

	reject: [
		{
			code: `
				const Component = styled.div\`
					top: 0;
					color: tomato;
				\`;
			`,
			fixed: `
				const Component = styled.div\`
					color: tomato;
					top: 0;
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
			fixed: `
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
						color: tomato;
						top: 0;
					}
				\`;
			`,
			fixed: `
				const Component = styled.div\`
					top: 0;
					\${props => props.great && 'color: red;'}
					color: tomato;

					a {
						color: tomato;
						top: 0;
					}
				\`;
			`,
		},
		{
			code: `
				const Component = styled.div\`
					color: tomato;
					top: 0;

					a {
						top: 0;
						\${props => props.great && 'color: red;'}
						color: tomato;
					}
				\`;
			`,
			fixed: `
				const Component = styled.div\`
					color: tomato;
					top: 0;

					a {
						top: 0;
						\${props => props.great && 'color: red;'}
						color: tomato;
					}
				\`;
			`,
		},
	],
});
