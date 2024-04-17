import stylelint from 'stylelint';
import { ruleName } from './ruleName.js';

export const messages = stylelint.utils.ruleMessages(ruleName, {
	expected: (first, second) => `Expected ${first} to come before ${second}`,
});
