import stylelint from 'stylelint';
import { getContainingNode } from '../../utils/getContainingNode.js';
import { isRuleWithNodes } from '../../utils/isRuleWithNodes.js';
import { isNumber } from '../../utils/validateType.js';
import { checkNodeForOrder } from './checkNodeForOrder.js';
import { checkNodeForEmptyLines } from './checkNodeForEmptyLines.js';
import { createOrderInfo } from './createOrderInfo.js';
import { validatePrimaryOption } from './validatePrimaryOption.js';

import { ruleName } from './ruleName.js';
import { messages } from './messages.js';

export function rule(primaryOption, options = {}, context = {}) {
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
					unspecified: ['top', 'bottom', 'ignore', 'bottomAlphabetical'],
					emptyLineBeforeUnspecified: ['always', 'never', 'threshold'],
					emptyLineMinimumPropertyThreshold: isNumber,
				},
				optional: true,
			},
		);

		if (!validOptions) {
			return;
		}

		let expectedOrder = createOrderInfo(primaryOption);

		let processedParents = [];

		// Check all rules and at-rules recursively
		root.walk(function processRulesAndAtrules(input) {
			let node = getContainingNode(input);

			// Avoid warnings duplication, caused by interfering in `root.walk()` algorigthm with `getContainingNode()`
			if (processedParents.includes(node)) {
				return;
			}

			processedParents.push(node);

			if (isRuleWithNodes(node)) {
				checkNodeForOrder({
					node,
					primaryOption,
					unspecified: options.unspecified || 'ignore',
					result,
					expectedOrder,
				});

				checkNodeForEmptyLines({
					node,
					context,
					emptyLineBeforeUnspecified: options.emptyLineBeforeUnspecified,
					emptyLineMinimumPropertyThreshold:
						options.emptyLineMinimumPropertyThreshold || 0,
					expectedOrder,
					primaryOption,
					result,
				});
			}
		});
	};
}

rule.primaryOptionArray = true;
rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = {
	fixable: true,
};
