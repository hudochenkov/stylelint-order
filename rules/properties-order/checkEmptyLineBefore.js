import stylelint from 'stylelint';
import { isString } from '../../utils/validateType.js';
import { addEmptyLineBefore } from './addEmptyLineBefore.js';
import { hasEmptyLineBefore } from './hasEmptyLineBefore.js';
import { removeEmptyLinesBefore } from './removeEmptyLinesBefore.js';
import { ruleName } from './ruleName.js';
import { messages } from './messages.js';

export function checkEmptyLineBefore({
	firstPropData,
	secondPropData,
	propsCount,
	lastKnownSeparatedGroup,
	context,
	emptyLineBeforeUnspecified,
	emptyLineMinimumPropertyThreshold,
	primaryOption,
	result,
}) {
	let firstPropIsSpecified = Boolean(firstPropData.orderData);
	let secondPropIsSpecified = Boolean(secondPropData.orderData);

	// Check newlines between groups
	let firstPropGroup = firstPropIsSpecified
		? firstPropData.orderData.separatedGroup
		: lastKnownSeparatedGroup;
	let secondPropGroup = secondPropIsSpecified
		? secondPropData.orderData.separatedGroup
		: lastKnownSeparatedGroup;

	let startOfSpecifiedGroup = secondPropIsSpecified && firstPropGroup !== secondPropGroup;
	let startOfUnspecifiedGroup = firstPropIsSpecified && !secondPropIsSpecified;

	if (startOfSpecifiedGroup || startOfUnspecifiedGroup) {
		// Get an array of just the property groups, remove any solo properties
		let groups = primaryOption.filter((item) => !isString(item));

		let emptyLineBefore =
			groups[secondPropGroup - 2] && groups[secondPropGroup - 2].emptyLineBefore;

		if (startOfUnspecifiedGroup) {
			emptyLineBefore = emptyLineBeforeUnspecified;
		}

		// Threshold logic
		let belowEmptyLineThreshold = propsCount < emptyLineMinimumPropertyThreshold;
		let emptyLineThresholdInsertLines =
			emptyLineBefore === 'threshold' && !belowEmptyLineThreshold;
		let emptyLineThresholdRemoveLines =
			emptyLineBefore === 'threshold' && belowEmptyLineThreshold;

		if (
			(emptyLineBefore === 'always' || emptyLineThresholdInsertLines) &&
			!hasEmptyLineBefore(secondPropData.node)
		) {
			stylelint.utils.report({
				message: messages.expectedEmptyLineBefore(secondPropData.name),
				node: secondPropData.node,
				result,
				ruleName,
				fix: () => {
					addEmptyLineBefore(secondPropData.node, context.newline);
				},
			});
		} else if (
			(emptyLineBefore === 'never' || emptyLineThresholdRemoveLines) &&
			hasEmptyLineBefore(secondPropData.node)
		) {
			stylelint.utils.report({
				message: messages.rejectedEmptyLineBefore(secondPropData.name),
				node: secondPropData.node,
				result,
				ruleName,
				fix: () => {
					removeEmptyLinesBefore(secondPropData.node, context.newline);
				},
			});
		}
	}

	// Check newlines between properties inside a group
	if (
		firstPropIsSpecified &&
		secondPropIsSpecified &&
		firstPropData.orderData.groupPosition === secondPropData.orderData.groupPosition
	) {
		if (
			secondPropData.orderData.noEmptyLineBeforeInsideGroup &&
			hasEmptyLineBefore(secondPropData.node)
		) {
			stylelint.utils.report({
				message: messages.rejectedEmptyLineBefore(secondPropData.name),
				node: secondPropData.node,
				result,
				ruleName,
				fix: () => {
					removeEmptyLinesBefore(secondPropData.node, context.newline);
				},
			});
		}
	}
}
