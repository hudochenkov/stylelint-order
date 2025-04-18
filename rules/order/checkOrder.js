// eslint-disable-next-line consistent-return
export function checkOrder({ firstNodeData, secondNodeData, unspecified }) {
	let firstNodeIsSpecified = Boolean(firstNodeData.expectedPosition);
	let secondNodeIsSpecified = Boolean(secondNodeData.expectedPosition);

	// If both nodes have their position
	if (firstNodeIsSpecified && secondNodeIsSpecified) {
		return firstNodeData.expectedPosition <= secondNodeData.expectedPosition;
	}

	if (!firstNodeIsSpecified && !secondNodeIsSpecified) {
		return true;
	}

	if (unspecified === 'ignore' && (!firstNodeIsSpecified || !secondNodeIsSpecified)) {
		return true;
	}

	if (unspecified === 'top' && !firstNodeIsSpecified) {
		return true;
	}

	if (unspecified === 'top' && !secondNodeIsSpecified) {
		return false;
	}

	if (unspecified === 'bottom' && !secondNodeIsSpecified) {
		return true;
	}

	if (unspecified === 'bottom' && !firstNodeIsSpecified) {
		return false;
	}
}
