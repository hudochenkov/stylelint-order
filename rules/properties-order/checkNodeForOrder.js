import stylelint from 'stylelint';
import sortNodeProperties from 'postcss-sorting/lib/properties-order/sortNodeProperties.js';
import { isProperty } from '../../utils/isProperty.js';
import { checkOrder } from './checkOrder.js';
import { getNodeData } from './getNodeData.js';
import { createFlatOrder } from './createFlatOrder.js';
import { ruleName } from './ruleName.js';
import { messages } from './messages.js';

export function checkNodeForOrder({
	node,
	isFixEnabled,
	primaryOption,
	unspecified,
	result,
	expectedOrder,
}) {
	if (isFixEnabled) {
		let allPropertiesData = getAllPropertiesData(node);
		let shouldFixOrder = false;

		// Check if there order violation to avoid running re-ordering unnecessery
		allPropertiesData.forEach(function checkEveryPropForOrder2(propertyData, index) {
			// Skip first decl
			if (index === 0) {
				return;
			}

			// return early if we know there is a violation and auto fix should be applied
			if (shouldFixOrder) {
				return;
			}

			let previousPropertyData = allPropertiesData[index - 1];

			let checkedOrder = checkOrder({
				firstPropertyData: previousPropertyData,
				secondPropertyData: propertyData,
				unspecified,
				allPropertiesData: allPropertiesData.slice(0, index),
			});

			if (!checkedOrder.isCorrect) {
				shouldFixOrder = true;
			}
		});

		if (shouldFixOrder) {
			sortNodeProperties(node, {
				order: createFlatOrder(primaryOption),
				unspecifiedPropertiesPosition: unspecified === 'ignore' ? 'bottom' : unspecified,
			});
		}
	}

	getAllPropertiesData(node).forEach((propertyData, index, listOfProperties) => {
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
			});
		}
	});

	function getAllPropertiesData(inputNode) {
		return inputNode.nodes
			.filter((item) => isProperty(item))
			.map((item) => getNodeData(item, expectedOrder));
	}
}
