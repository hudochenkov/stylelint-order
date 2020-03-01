const stylelint = require('stylelint');
const { ruleName } = require('..');

test(`show warning if --fix enabled, but it didn't fix`, () => {
	const code = `
		const Component = styled.div\`
			color: tomato;
			\${interpolation}
			top: 0;
		\`;
	`;

	const stylelintConfig = {
		plugins: ['./'],
		rules: {
			[ruleName]: [['top', 'color']],
		},
	};

	const options = {
		code,
		config: stylelintConfig,
		syntax: 'css-in-js',
		fix: true,
	};

	return stylelint.lint(options).then(output => {
		expect(output.results[0].warnings.length).toBe(1);

		const fixedCode = getOutputCss(output);

		expect(fixedCode).toBe(code);
	});
});

test(`show warning if --fix enabled, and it fixed`, () => {
	const code = `
		const Component = styled.div\`
			color: tomato;
			top: 0;
		\`;
	`;

	const expectedCode = `
		const Component = styled.div\`
			top: 0;
			color: tomato;
		\`;
	`;

	const stylelintConfig = {
		plugins: ['./'],
		rules: {
			[ruleName]: [['top', 'color']],
		},
	};

	const options = {
		code,
		config: stylelintConfig,
		syntax: 'css-in-js',
		fix: true,
	};

	return stylelint.lint(options).then(output => {
		expect(output.results[0].warnings.length).toBe(0);

		const fixedCode = getOutputCss(output);

		expect(fixedCode).toBe(expectedCode);
	});
});

function getOutputCss(output) {
	const result = output.results[0]._postcssResult;
	const css = result.root.toString(result.opts.syntax);

	return css;
}
