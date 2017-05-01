'use strict';

const stylelint = require('stylelint');
const _ = require('lodash');
const utils = require('../../utils');

const ruleName = utils.namespace('order');

const messages = stylelint.utils.ruleMessages(ruleName, {
	expected: (first, second) => `Expected ${first} to come before ${second}`,
});

function rule(expectation, options) {
	return function (root, result) {
		utils.renamedRuleWarning('declaration-block-order', ruleName, result);

		const validOptions = stylelint.utils.validateOptions(
			result,
			ruleName,
			{
				actual: expectation,
				possible: validatePrimaryOption,
			},
			{
				actual: options,
				possible: {
					unspecified: ['top', 'bottom', 'ignore'],
				},
				optional: true,
			}
		);

		if (!validOptions) {
			return;
		}

		const expectedOrder = createExpectedOrder(expectation);

		// By default, ignore unspecified properties
		const unspecified = _.get(options, ['unspecified'], 'ignore');

		// Check all rules and at-rules recursively
		root.walk(function processRulesAndAtrules(node) {
			if (node.type === 'rule' || node.type === 'atrule') {
				checkNode(node);
			}
		});

		function checkNode(node) {
			// Skip if it's an empty rule
			if (!node.nodes || !node.nodes.length) {
				return;
			}

			const allNodesData = [];

			node.each(function processEveryNode(child) {
				// Skip comments
				if (child.type === 'comment') {
					return;
				}

				// Receive node description and expectedPosition
				const nodeOrderData = getOrderData(expectedOrder, child);

				const nodeData = {
					description: nodeOrderData.description,
					node: child,
				};

				if (nodeOrderData.expectedPosition) {
					nodeData.expectedPosition = nodeOrderData.expectedPosition;
				}

				const previousNodeData = _.last(allNodesData);

				allNodesData.push(nodeData);

				// Skip first node
				if (!previousNodeData) {
					return;
				}

				const isCorrectOrder = checkOrder(previousNodeData, nodeData);

				if (isCorrectOrder) {
					return;
				}

				complain({
					message: messages.expected(nodeData.description, previousNodeData.description),
					node: child,
				});
			});

			function checkOrder(firstNodeData, secondNodeData) {
				const firstNodeIsUnspecified = !firstNodeData.expectedPosition;
				const secondNodeIsUnspecified = !secondNodeData.expectedPosition;

				// If both nodes have their position
				if (!firstNodeIsUnspecified && !secondNodeIsUnspecified) {
					return firstNodeData.expectedPosition <= secondNodeData.expectedPosition;
				}

				if (firstNodeIsUnspecified && !secondNodeIsUnspecified) {
					// If first node is unspecified, look for a specified node before it to
					// compare to the current node
					const priorSpecifiedNodeData = _.findLast(allNodesData.slice(0, -1), (d) => Boolean(d.expectedPosition));

					if (
						priorSpecifiedNodeData && priorSpecifiedNodeData.expectedPosition
						&& priorSpecifiedNodeData.expectedPosition > secondNodeData.expectedPosition
					) {
						complain({
							message: messages.expected(secondNodeData.description, priorSpecifiedNodeData.description),
							node: secondNodeData.node,
						});

						return true; // avoid logging another warning
					}
				}

				if (firstNodeIsUnspecified && secondNodeIsUnspecified) {
					return true;
				}

				if (unspecified === 'ignore' && (firstNodeIsUnspecified || secondNodeIsUnspecified)) {
					return true;
				}

				if (unspecified === 'top' && firstNodeIsUnspecified) {
					return true;
				}
				if (unspecified === 'top' && secondNodeIsUnspecified) {
					return false;
				}

				if (unspecified === 'bottom' && secondNodeIsUnspecified) {
					return true;
				}
				if (unspecified === 'bottom' && firstNodeIsUnspecified) {
					return false;
				}
			}
		}

		function complain(input) {
			const message = input.message;
			const node = input.node;

			stylelint.utils.report({
				message,
				node,
				result,
				ruleName,
			});
		}
	};
}

function createExpectedOrder(input) {
	const order = {};
	let expectedPosition = 0;

	input.forEach((item) => {
		expectedPosition += 1;

		if (
			(
				_.isString(item)
				&& item !== 'at-rules'
				&& item !== 'rules'
			)
			|| item === 'less-mixins'
		) {
			order[item] = {
				expectedPosition,
				description: getDescription(item),
			};
		}

		if (
			item === 'rules'
			|| item.type === 'rule'
		) {
			// Convert 'rules' into extended pattern
			if (item === 'rules') {
				item = {
					type: 'rule',
				};
			}

			// It there are no nodes like that create array for them
			if (!order[item.type]) {
				order[item.type] = [];
			}

			const nodeData = {
				expectedPosition,
				description: getDescription(item),
			};

			if (item.selector) {
				nodeData.selector = item.selector;

				if (_.isString(item.selector)) {
					nodeData.selector = new RegExp(item.selector);
				}
			}

			order[item.type].push(nodeData);
		}

		if (
			item === 'at-rules'
			|| item.type === 'at-rule'
		) {
			// Convert 'at-rules' into extended pattern
			if (item === 'at-rules') {
				item = {
					type: 'at-rule',
				};
			}

			// It there are no nodes like that create array for them
			if (!order[item.type]) {
				order[item.type] = [];
			}

			const nodeData = {
				expectedPosition,
				description: getDescription(item),
			};

			if (item.name) {
				nodeData.name = item.name;
			}

			if (item.parameter) {
				nodeData.parameter = item.parameter;

				if (_.isString(item.parameter)) {
					nodeData.parameter = new RegExp(item.parameter);
				}
			}

			if (!_.isUndefined(item.hasBlock)) {
				nodeData.hasBlock = item.hasBlock;
			}

			order[item.type].push(nodeData);
		}
	});

	return order;
}

function getDescription(item) {
	const descriptions = {
		'custom-properties': 'custom property',
		'dollar-variables': '$-variable',
		'at-variables': '@-variable',
		'less-mixins': 'Less mixin',
		'declarations': 'declaration',
	};

	if (_.isPlainObject(item)) {
		let text;

		if (item.type === 'at-rule') {
			text = 'at-rule';

			if (item.name) {
				text = `@${item.name}`;
			}

			if (item.parameter) {
				text += ` "${item.parameter}"`;
			}

			if (item.hasOwnProperty('hasBlock')) {
				if (item.hasBlock) {
					text += ' with a block';
				} else {
					text = `blockless ${text}`;
				}
			}
		}

		if (item.type === 'rule') {
			text = 'rule';

			if (item.selector) {
				text += ` with selector matching "${item.selector}"`;
			}
		}

		return text;
	}

	// Return description for keyword patterns
	return descriptions[item];
}

function getOrderData(expectedOrder, node) {
	let nodeType;

	if (node.type === 'decl') {
		if (utils.isCustomProperty(node.prop)) {
			nodeType = 'custom-properties';
		} else if (utils.isDollarVariable(node.prop)) {
			nodeType = 'dollar-variables';
		} else if (utils.isAtVariable(node.prop)) {
			nodeType = 'at-variables';
		} else if (utils.isStandardSyntaxProperty(node.prop)) {
			nodeType = 'declarations';
		}
	} else if (
		node.type === 'rule'
		&& node.ruleWithoutBody
		&& !node.extendRule
	) {
		nodeType = 'less-mixins';
	} else if (
		node.type === 'rule'
		&& utils.isScssNestedPropertiesRoot(node)
	) {
		const prop = node.selector.slice(0, -1);

		if (
			utils.isStandardSyntaxProperty(prop)
			&& !utils.isCustomProperty(prop)
		) {
			nodeType = 'declarations';
		}
	} else if (node.type === 'rule') {
		nodeType = {
			type: 'rule',
			selector: node.selector,
		};

		const rules = expectedOrder.rule;

		// Looking for most specified pattern, because it can match many patterns
		if (rules && rules.length) {
			let prioritizedPattern;
			let max = 0;

			rules.forEach(function (pattern) {
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

		const atRules = expectedOrder['at-rule'];

		// Looking for most specified pattern, because it can match many patterns
		if (atRules && atRules.length) {
			let prioritizedPattern;
			let max = 0;

			atRules.forEach(function (pattern) {
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

	if (expectedOrder[nodeType]) {
		return expectedOrder[nodeType];
	}

	// Return only description if there no patterns for that node
	return {
		description: getDescription(nodeType),
	};
}

function calcAtRulePatternPriority(pattern, node) {
	// 0 — it pattern doesn't match
	// 1 — pattern without `name` and `hasBlock`
	// 10010 — pattern match `hasBlock`
	// 10100 — pattern match `name`
	// 20110 — pattern match `name` and `hasBlock`
	// 21100 — patter match `name` and `parameter`
	// 31110 — patter match `name`, `parameter`, and `hasBlock`

	let priority = 0;

	// match `hasBlock`
	if (pattern.hasOwnProperty('hasBlock') && node.hasBlock === pattern.hasBlock) {
		priority += 10;
		priority += 10000;
	}

	// match `name`
	if (pattern.hasOwnProperty('name') && node.name === pattern.name) {
		priority += 100;
		priority += 10000;
	}

	// match `name`
	if (pattern.hasOwnProperty('parameter') && pattern.parameter.test(node.parameter)) {
		priority += 1100;
		priority += 10000;
	}

	// doesn't have `name` and `hasBlock`
	if (!pattern.hasOwnProperty('hasBlock') && !pattern.hasOwnProperty('name') && !pattern.hasOwnProperty('paremeter')) {
		priority = 1;
	}

	// patter has `name` and `hasBlock`, but it doesn't match both properties
	if (pattern.hasOwnProperty('hasBlock') && pattern.hasOwnProperty('name') && priority < 20000) {
		priority = 0;
	}

	// patter has `name` and `parameter`, but it doesn't match both properties
	if (pattern.hasOwnProperty('name') && pattern.hasOwnProperty('parameter') && priority < 21100) {
		priority = 0;
	}

	// patter has `name`, `parameter`, and `hasBlock`, but it doesn't match all properties
	if (pattern.hasOwnProperty('name') && pattern.hasOwnProperty('parameter') && pattern.hasOwnProperty('hasBlock') && priority < 30000) {
		priority = 0;
	}

	return priority;
}

function calcRulePatternPriority(pattern, node) {
	// 0 — it pattern doesn't match
	// 1 — pattern without `selector`
	// 2 — pattern match `selector`

	let priority = 0;

	// doesn't have `selector`
	if (!pattern.hasOwnProperty('selector')) {
		priority = 1;
	}

	// match `selector`
	if (pattern.hasOwnProperty('selector') && pattern.selector.test(node.selector)) {
		priority = 2;
	}

	return priority;
}

function validatePrimaryOption(actualOptions) {
	// Otherwise, begin checking array options
	if (!Array.isArray(actualOptions)) {
		return false;
	}

	// Every item in the array must be a certain string or an object
	// with a "type" property
	if (!actualOptions.every((item) => {
		if (_.isString(item)) {
			return _.includes(['custom-properties', 'dollar-variables', 'at-variables', 'declarations', 'rules', 'at-rules', 'less-mixins'], item);
		}

		return _.isPlainObject(item) && !_.isUndefined(item.type);
	})) {
		return false;
	}

	const objectItems = actualOptions.filter(_.isPlainObject);

	if (!objectItems.every((item) => {
		let result = true;

		if (item.type !== 'at-rule' && item.type !== 'rule') {
			return false;
		}

		if (item.type === 'at-rule') {
			// if parameter is specified, name should be specified also
			if (!_.isUndefined(item.parameter) && _.isUndefined(item.name)) {
				return false;
			}

			if (!_.isUndefined(item.hasBlock)) {
				result = item.hasBlock === true || item.hasBlock === false;
			}

			if (!_.isUndefined(item.name)) {
				result = _.isString(item.name) && item.name.length;
			}

			if (!_.isUndefined(item.parameter)) {
				result = (_.isString(item.parameter) && item.parameter.length) || _.isRegExp(item.parameter);
			}
		}

		if (item.type === 'rule') {
			if (!_.isUndefined(item.selector)) {
				result = (_.isString(item.selector) && item.selector.length) || _.isRegExp(item.selector);
			}
		}

		return result;
	})) {
		return false;
	}

	return true;
}

rule.primaryOptionArray = true;

module.exports = rule;
module.exports.ruleName = ruleName;
module.exports.messages = messages;
