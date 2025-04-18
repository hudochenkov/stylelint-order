import { isProperty } from '../../utils/isProperty.js';
import { checkEmptyLineBefore } from './checkEmptyLineBefore.js';
import { checkEmptyLineBeforeFirstProp } from './checkEmptyLineBeforeFirstProp.js';
import { getNodeData } from './getNodeData.js';

export function checkNodeForEmptyLines({
	node,
	context,
	emptyLineBeforeUnspecified,
	emptyLineMinimumPropertyThreshold,
	expectedOrder,
	primaryOption,
	result,
}) {
	let lastKnownSeparatedGroup = 1;

	let propsCount = node.nodes.filter((item) => isProperty(item)).length;
	let allNodesData = node.nodes.map((child) => getNodeData(child, expectedOrder));

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

		checkEmptyLineBefore({
			firstPropData: previousNodeData,
			secondPropData: nodeData,
			propsCount,
			lastKnownSeparatedGroup,
			context,
			emptyLineBeforeUnspecified,
			emptyLineMinimumPropertyThreshold,
			primaryOption,
			result,
		});
	});

	// Check if empty line before first prop should be removed
	if (isProperty(allNodesData[0].node)) {
		checkEmptyLineBeforeFirstProp({
			propData: allNodesData[0],
			primaryOption,
			emptyLineBeforeUnspecified,
			context,
			result,
		});
	}
}
