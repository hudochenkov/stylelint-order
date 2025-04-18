import stylelint from 'stylelint';
import { getContainingNode } from '../../utils/getContainingNode.js';
import { isRuleWithNodes } from '../../utils/isRuleWithNodes.js';
import { checkNode } from './checkNode.js';
import { createOrderInfo } from './createOrderInfo.js';
import { validatePrimaryOption } from './validatePrimaryOption.js';
import { ruleName } from './ruleName.js';
import { messages } from './messages.js';

export function rule(primaryOption, options = {}) {
	return function ruleBody(root, result) {
		let validOptions = stylelint.utils.validateOptions(
			result,
			ruleName,
			{
				actual: primaryOption,
				possible: validatePrimaryOption,
			},
			{
				actual: options,
				possible: {
					unspecified: ['top', 'bottom', 'ignore'],
				},
				optional: true,
			},
		);

		if (!validOptions) {
			return;
		}

		let unspecified = options.unspecified || 'ignore';
		let orderInfo = createOrderInfo(primaryOption);

		let processedParents = [];

		// Check all rules and at-rules recursively
		root.walk(function processRulesAndAtrules(originalNode) {
			let node = getContainingNode(originalNode);

			// Avoid warnings duplication, caused by interfering in `root.walk()` algorigthm with `getContainingNode()`
			if (processedParents.includes(node)) {
				return;
			}

			processedParents.push(node);

			if (isRuleWithNodes(node)) {
				checkNode({
					node,
					orderInfo,
					primaryOption,
					result,
					unspecified,
				});
			}
		});
	};
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.primaryOptionArray = true;
rule.meta = {
	fixable: true,
};
