# stylelint-order [![Build Status][ci-img]][ci]

A plugin pack of order related linting rules for [stylelint].

## Installation

```
npm install stylelint-order
```

## Usage

Add `stylelint-order` to your stylelint config plugins array, then add rules you need to the rules list. All rules from stylelint-order need to be namespaced with `order`.

Like so:

```js
// .stylelintrc
{
	"plugins": [
		"stylelint-order"
	],
	"rules": {
		// ...
		"order/declaration-block-order": [
			"custom-properties",
			"declarations"
		],
		"order/declaration-block-properties-alphabetical-order": true
		// ...
	}
}
```

## List of rules

* [`declaration-block-order`](./rules/declaration-block-order/README.md): Specify the order of content within declaration blocks.
* [`declaration-block-properties-specified-order`](./rules/declaration-block-properties-specified-order/README.md): Specify the almost strict order of properties within declaration blocks.
* [`declaration-block-properties-alphabetical-order`](./rules/declaration-block-properties-alphabetical-order/README.md): Specify the alphabetical order of properties within declaration blocks.
* [`declaration-block-property-groups-structure`](./rules/declaration-block-property-groups-structure/README.md): Require or disallow an empty line before property groups.

## Thanks

`declaration-block-properties-specified-order` and `declaration-block-properties-alphabetical-order` code and readme are based on `declaration-block-properties-order` rule which was a stylelint's core rule prior stylelint 8.0.0.

[ci-img]: https://travis-ci.org/hudochenkov/stylelint-order.svg
[ci]: https://travis-ci.org/hudochenkov/stylelint-order

[stylelint]: http://stylelint.io/
