import { calcAtRulePatternPriority } from './calcAtRulePatternPriority.js';
import { calcRulePatternPriority } from './calcRulePatternPriority.js';
import { getDescription } from './getDescription.js';
import { isAtVariable } from '../../utils/isAtVariable.js';
import { isCustomProperty } from '../../utils/isCustomProperty.js';
import { isDollarVariable } from '../../utils/isDollarVariable.js';
import { isLessMixin } from '../../utils/isLessMixin.js';
import { isStandardSyntaxProperty } from '../../utils/isStandardSyntaxProperty.js';

export function getOrderData(orderInfo, node) {
	let nodeType;

	if (isAtVariable(node)) {
		nodeType = 'at-variables';
	} else if (isLessMixin(node)) {
		nodeType = 'less-mixins';
	} else if (node.type === 'decl') {
		if (isCustomProperty(node.prop)) {
			nodeType = 'custom-properties';
		} else if (isDollarVariable(node.prop)) {
			nodeType = 'dollar-variables';
		} else if (isStandardSyntaxProperty(node.prop)) {
			nodeType = 'declarations';
		}
	} else if (node.type === 'rule') {
		nodeType = {
			type: 'rule',
			selector: node.selector,
		};

		const rules = orderInfo.rule;

		// Looking for most specified pattern, because it can match many patterns
		if (rules && rules.length) {
			let prioritizedPattern;
			let max = 0;

			rules.forEach((pattern) => {
				const priority = calcRulePatternPriority(pattern, nodeType);

				if (priority > max) {
					max = priority;
					prioritizedPattern = pattern;
				}
			});

			if (max) {
				return prioritizedPattern;
			}
		}
	} else if (node.type === 'atrule') {
		nodeType = {
			type: 'at-rule',
			name: node.name,
			hasBlock: false,
		};

		if (node.nodes && node.nodes.length) {
			nodeType.hasBlock = true;
		}

		if (node.params && node.params.length) {
			nodeType.parameter = node.params;
		}

		const atRules = orderInfo['at-rule'];

		// Looking for most specified pattern, because it can match many patterns
		if (atRules && atRules.length) {
			let prioritizedPattern;
			let max = 0;

			atRules.forEach((pattern) => {
				const priority = calcAtRulePatternPriority(pattern, nodeType);

				if (priority > max) {
					max = priority;
					prioritizedPattern = pattern;
				}
			});

			if (max) {
				return prioritizedPattern;
			}
		}
	}

	if (orderInfo[nodeType]) {
		return orderInfo[nodeType];
	}

	// Return only description if there no patterns for that node
	return {
		description: getDescription(nodeType),
	};
}
