import stylelint from 'stylelint';
import { sortCustomProperties } from './sortCustomProperties.js';
import { checkNode } from './checkNode.js';
import { namespace } from '../../utils/namespace.js';
import { getContainingNode } from '../../utils/getContainingNode.js';
import { isRuleWithNodes } from '../../utils/isRuleWithNodes.js';

let ruleName = namespace('custom-properties-alphabetical-order');

let messages = stylelint.utils.ruleMessages(ruleName, {
	expected: (first, second) => `Expected ${first} to come before ${second}`,
});

export function rule(actual) {
	return function ruleBody(root, result) {
		let validOptions = stylelint.utils.validateOptions(result, ruleName, {
			actual,
			possible: Boolean,
		});

		if (!validOptions) {
			return;
		}

		let processedParents = [];

		root.walk(function processRulesAndAtrules(input) {
			let node = getContainingNode(input);

			// Avoid warnings duplication, caused by interfering in `root.walk()` algorithm with `getContainingNode()`
			if (processedParents.includes(node)) {
				return;
			}

			processedParents.push(node);

			let hasRunFixer = false;

			function fixer() {
				if (hasRunFixer) {
					return;
				}

				sortCustomProperties(node);

				hasRunFixer = true;

				checkNode(node, result, ruleName, messages);
			}

			if (isRuleWithNodes(node)) {
				checkNode(node, result, ruleName, messages, fixer);
			}
		});
	};
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = {
	fixable: true,
	url: 'https://github.com/hudochenkov/stylelint-order/blob/master/rules/custom-properties-alphabetical-order/README.md',
};
