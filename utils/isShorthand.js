import { shorthandData } from './shorthandData.js';

export function isShorthand(a, b) {
	if (!shorthandData[a]) {
		return false;
	}

	if (shorthandData[a].includes(b)) {
		return true;
	}

	for (const longhand of shorthandData[a]) {
		if (isShorthand(longhand, b)) {
			return true;
		}
	}

	return false;
}
