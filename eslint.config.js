import { configs } from 'eslint-config-hudochenkov';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';

export default [
	...configs.main,
	eslintConfigPrettier,
	{
		languageOptions: {
			globals: {
				...Object.fromEntries(Object.entries(globals.browser).map(([key]) => [key, 'off'])),
				...globals.node,
				...globals.jest,
				testConfig: true,
				testRule: true,
			},
			ecmaVersion: 'latest',
			sourceType: 'module',
		},
		rules: {
			'import/extensions': [
				'error',
				'always',
				{
					ignorePackages: true,
				},
			],
			'unicorn/prefer-module': 'error',
			'unicorn/prefer-node-protocol': 'error',
		},
	},
];
