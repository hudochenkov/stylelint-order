const stylelint = require('stylelint');
const postcss = require('postcss');
const postcssSorting = require('postcss-sorting');
const checkOrder = require('./checkOrder');
const getOrderData = require('./getOrderData');

module.exports = function checkNode(node, sharedInfo, originalNode) {
	if (sharedInfo.isFixEnabled) {
		let shouldFix = false;
		let allNodesData = [];

		node.each(function processEveryNode(child) {
			// return early if we know there is a violation and auto fix should be applied
			if (shouldFix) {
				return;
			}

			let { shouldSkip, isCorrectOrder } = handleCycle(child, allNodesData);

			if (shouldSkip) {
				return;
			}

			if (!isCorrectOrder) {
				shouldFix = true;
			}
		});

		if (shouldFix) {
			let sortingOptions = {
				order: sharedInfo.primaryOption,
			};

			// creating PostCSS Root node with current node as a child,
			// so PostCSS Sorting can process it
			let tempRoot = postcss.root({ nodes: [originalNode] });

			postcssSorting(sortingOptions)(tempRoot);
		}
	}

	let allNodesData = [];

	node.each(function processEveryNode(child) {
		let { shouldSkip, isCorrectOrder, nodeData, previousNodeData } = handleCycle(
			child,
			allNodesData
		);

		if (shouldSkip) {
			return;
		}

		if (isCorrectOrder) {
			return;
		}

		stylelint.utils.report({
			message: sharedInfo.messages.expected(
				nodeData.description,
				previousNodeData.description
			),
			node: child,
			result: sharedInfo.result,
			ruleName: sharedInfo.ruleName,
		});
	});

	function handleCycle(child, allNodes) {
		// Skip comments
		if (child.type === 'comment') {
			return {
				shouldSkip: true,
			};
		}

		// Receive node description and expectedPosition
		let nodeOrderData = getOrderData(sharedInfo.orderInfo, child);

		let nodeData = {
			node: child,
			description: nodeOrderData.description,
			expectedPosition: nodeOrderData.expectedPosition,
		};

		allNodes.push(nodeData);

		let previousNodeData = allNodes[allNodes.length - 2];

		// Skip first node
		if (!previousNodeData) {
			return {
				shouldSkip: true,
			};
		}

		return {
			isCorrectOrder: checkOrder(previousNodeData, nodeData, allNodes, sharedInfo),
			nodeData,
			previousNodeData,
		};
	}
};
