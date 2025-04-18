import stylelint from 'stylelint';
import { isString } from '../../utils/validateType.js';
import { ruleName } from './ruleName.js';
import { messages } from './messages.js';
import { hasEmptyLineBefore } from './hasEmptyLineBefore.js';
import { removeEmptyLinesBefore } from './removeEmptyLinesBefore.js';

export function checkEmptyLineBeforeFirstProp({
	propData,
	primaryOption,
	emptyLineBeforeUnspecified,
	context,
	result,
}) {
	let emptyLineBefore = false;

	if (propData.orderData) {
		// Get an array of just the property groups, remove any solo properties
		let groups = primaryOption.filter((item) => !isString(item));

		emptyLineBefore =
			groups[propData.orderData.separatedGroup - 2] &&
			groups[propData.orderData.separatedGroup - 2].emptyLineBefore;
	} else if (emptyLineBeforeUnspecified) {
		emptyLineBefore = true;
	}

	if (emptyLineBefore && hasEmptyLineBefore(propData.node)) {
		stylelint.utils.report({
			message: messages.rejectedEmptyLineBefore(propData.name),
			node: propData.node,
			result,
			ruleName,
			fix: () => {
				removeEmptyLinesBefore(propData.node, context.newline);
			},
		});
	}
}
