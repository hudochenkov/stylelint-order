const { isProperty } = require('../../utils');
const checkEmptyLineBefore = require('./checkEmptyLineBefore');
const checkEmptyLineBeforeFirstProp = require('./checkEmptyLineBeforeFirstProp');
const getNodeData = require('./getNodeData');

module.exports = function checkNode(node, sharedInfo) {
	sharedInfo.lastKnownSeparatedGroup = 1;

	let propsCount = node.nodes.filter((item) => isProperty(item)).length;
	let allNodesData = node.nodes.map(function collectDataForEveryNode(child) {
		return getNodeData(child, sharedInfo.expectedOrder);
	});

	allNodesData.forEach(function checkEveryPropForEmptyLine(nodeData, index) {
		let previousNodeData = allNodesData[index - 1];

		// if previous node is shared-line comment, use second previous node
		if (
			previousNodeData &&
			previousNodeData.node.type === 'comment' &&
			!previousNodeData.node.raw('before').includes('\n')
		) {
			previousNodeData = allNodesData[index - 2];
		}

		// skip first decl
		if (!previousNodeData) {
			return;
		}

		// Nodes should be standard declarations
		if (!isProperty(previousNodeData.node) || !isProperty(nodeData.node)) {
			return;
		}

		checkEmptyLineBefore(previousNodeData, nodeData, sharedInfo, propsCount);
	});

	// Check if empty line before first prop should be removed
	if (isProperty(allNodesData[0].node)) {
		checkEmptyLineBeforeFirstProp(allNodesData[0], sharedInfo);
	}
};
