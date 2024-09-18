import stylelint from 'stylelint';
import { checkNode } from './checkNode.js';
import { namespace } from '../../utils/namespace.js';
import { getContainingNode } from '../../utils/getContainingNode.js';
import { isRuleWithNodes } from '../../utils/isRuleWithNodes.js';

let ruleName = namespace('properties-alphabetical-order');

let messages = stylelint.utils.ruleMessages(ruleName, {
	expected: (first, second) => `Expected ${first} to come before ${second}`,
});

export function rule(actual, options, context = {}) {
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

			// Avoid warnings duplication, caused by interfering in `root.walk()` algorigthm with `getContainingNode()`
			if (processedParents.includes(node)) {
				return;
			}

			processedParents.push(node);

			if (isRuleWithNodes(node)) {
				checkNode(node, result, ruleName, messages, context.fix);
			}
		});
	};
}

rule.ruleName = ruleName;
rule.messages = messages;
