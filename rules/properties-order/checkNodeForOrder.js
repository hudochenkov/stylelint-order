import stylelint from 'stylelint';
import sortNodeProperties from 'postcss-sorting/lib/properties-order/sortNodeProperties.js';
import { isProperty } from '../../utils/isProperty.js';
import { checkOrder } from './checkOrder.js';
import { getNodeData } from './getNodeData.js';
import { createFlatOrder } from './createFlatOrder.js';
import { ruleName } from './ruleName.js';
import { messages } from './messages.js';

export function checkNodeForOrder({ node, primaryOption, unspecified, result, expectedOrder }) {
	/*
		Solution is not ideal.

		1. Stylelint requires to use `fix` function for every report since 16.8.2 https://stylelint.io/user-guide/options/#fix:~:text=When%20a%20rule%20relies%20on%20the%20deprecated%20context.fix%20and%20a%20source%20contains%3A Otherwise it will not run fixer if disabled comments present anywhere in the source.

		2. PostCSS Sorting sometimes can't fix order, because fixing could break the code. https://github.com/hudochenkov/postcss-sorting?tab=readme-ov-file#caveats

		3. Fixing an order piece by piece is complicated, because it affects multiple properties. With fixing one by one it is possible that one property if fixed, but then another property, which related to the first one, is fixed, and that introduce a new error with the first property.

		Given all that this is what code does:

		- Check order of properties
		- If order is correct, do nothing
		- If order is incorrect, run fixer
		- Fixer fixes the WHOLE file
		- Check order of properties again and report violations WITHOUT fixer
		- Because Stylelint runs fixer for every violation, but we already fixed the whole file, skip the fixer for the next violations
	*/
	let hasRunFixer = false;

	checkAndReport(fixer);

	function checkAndReport(fix) {
		const allPropertiesData = node.nodes
			.filter((item) => isProperty(item))
			.map((item) => getNodeData(item, expectedOrder));

		allPropertiesData.forEach((propertyData, index, listOfProperties) => {
			// Skip first decl
			if (index === 0) {
				return;
			}

			const previousPropertyData = listOfProperties[index - 1];

			const checkedOrder = checkOrder({
				firstPropertyData: previousPropertyData,
				secondPropertyData: propertyData,
				unspecified,
				allPropertiesData: listOfProperties.slice(0, index),
			});

			if (!checkedOrder.isCorrect) {
				const { orderData } = checkedOrder.secondNode;

				stylelint.utils.report({
					message: messages.expected(
						checkedOrder.secondNode.name,
						checkedOrder.firstNode.name,
						orderData && orderData.groupName,
					),
					node: checkedOrder.secondNode.node,
					result,
					ruleName,
					fix,
				});
			}
		});
	}

	function fixer() {
		if (hasRunFixer) {
			return;
		}

		sortNodeProperties(node, {
			order: createFlatOrder(primaryOption),
			unspecifiedPropertiesPosition: unspecified === 'ignore' ? 'bottom' : unspecified,
		});

		hasRunFixer = true;

		checkAndReport();
	}
}
