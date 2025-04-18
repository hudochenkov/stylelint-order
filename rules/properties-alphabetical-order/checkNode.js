import stylelint from 'stylelint';
import { checkChild } from './checkChild.js';

// eslint-disable-next-line max-params
export function checkNode(node, result, ruleName, messages, fix) {
	let allPropData = [];

	node.each(function processEveryNode(child) {
		const problem = checkChild(child, allPropData);

		if (problem) {
			stylelint.utils.report({
				message: messages.expected(problem.expectedFirst, problem.expectedSecond),
				node: child,
				result,
				ruleName,
				fix,
			});
		}
	});
}
