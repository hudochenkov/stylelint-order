// eslint-disable-next-line max-params
export function beforeDeclaration(comments, previousNode, nodeData, currentInitialIndex) {
	if (!previousNode || previousNode.type !== 'comment') {
		return comments;
	}

	if (!previousNode.raws.before || !previousNode.raws.before.includes('\n')) {
		return comments;
	}

	let initialIndex = currentInitialIndex || nodeData.initialIndex;

	const commentData = {
		node: previousNode,
		name: nodeData.name,
	};

	commentData.initialIndex = initialIndex - 0.0001;

	// add a marker
	previousNode.sortProperty = true;

	const newComments = [commentData, ...comments];

	return beforeDeclaration(newComments, previousNode.prev(), nodeData, commentData.initialIndex);
}

// eslint-disable-next-line max-params
export function afterDeclaration(comments, nextNode, nodeData, currentInitialIndex) {
	if (!nextNode || nextNode.type !== 'comment') {
		return comments;
	}

	if (!nextNode.raws.before || nextNode.raws.before.includes('\n')) {
		return comments;
	}

	let initialIndex = currentInitialIndex || nodeData.initialIndex;

	const commentData = {
		node: nextNode,
		name: nodeData.name,
	};

	commentData.initialIndex = initialIndex + 0.0001;

	// add a marker
	nextNode.sortProperty = true;

	return afterDeclaration(
		[...comments, commentData],
		nextNode.next(),
		nodeData,
		commentData.initialIndex,
	);
}
