import stylelint from 'stylelint';
import { rules } from './rules/index.js';
import { namespace } from './utils/namespace.js';

const rulesPlugins = Object.keys(rules).map((ruleName) => {
	return stylelint.createPlugin(namespace(ruleName), rules[ruleName]);
});

// eslint-disable-next-line import/no-default-export
export default rulesPlugins;
