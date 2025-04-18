import stylelint from 'stylelint';
import sortNode from 'postcss-sorting/lib/order/sortNode.js';
import { checkOrder } from './checkOrder.js';
import { getOrderData } from './getOrderData.js';
import { ruleName } from './ruleName.js';
import { messages } from './messages.js';

export function checkNode({ node, orderInfo, primaryOption, result, unspecified }) {
	let hasRunFixer = false;

	checkAndReport(fixer);

	function checkAndReport(fix) {
		let allNodesData = [];

		node.each(function processEveryNode(child) {
			if (child.type === 'comment') {
				return;
			}

			// Receive node description and expectedPosition
			let nodeOrderData = getOrderData(orderInfo, child);

			let nodeData = {
				node: child,
				description: nodeOrderData.description,
				expectedPosition: nodeOrderData.expectedPosition,
			};

			allNodesData.push(nodeData);

			let previousNodeData = allNodesData.at(-2);

			// Skip first node
			if (!previousNodeData) {
				return;
			}

			// Try to find the specified node before the current one,
			// or use the previous one
			let priorSpecifiedNodeData = previousNodeData;

			if (!previousNodeData.expectedPosition) {
				let priorSpecifiedNodeData2 = allNodesData
					.slice(0, -1)
					.reverse()
					.find((node2) => Boolean(node2.expectedPosition));

				if (priorSpecifiedNodeData2) {
					priorSpecifiedNodeData = priorSpecifiedNodeData2;
				}
			}

			let isCorrectOrder = checkOrder({
				firstNodeData: priorSpecifiedNodeData,
				secondNodeData: nodeData,
				unspecified,
			});

			if (isCorrectOrder) {
				return;
			}

			stylelint.utils.report({
				message: messages.expected(
					nodeData.description,
					priorSpecifiedNodeData.description,
				),
				node: child,
				result,
				ruleName,
				fix,
			});
		});
	}

	function fixer() {
		if (hasRunFixer) {
			return;
		}

		sortNode(node, primaryOption);

		hasRunFixer = true;

		checkAndReport();
	}
}
