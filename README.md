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
		"order/order": [
			"custom-properties",
			"declarations"
		],
		"order/properties-alphabetical-order": true
		// ...
	}
}
```

## List of rules

* [`order`](./rules/order/README.md): Specify the order of content within declaration blocks.
* [`properties-order`](./rules/properties-order/README.md): Specify the order of properties within declaration blocks.
* [`properties-alphabetical-order`](./rules/properties-alphabetical-order/README.md): Specify the alphabetical order of properties within declaration blocks.

## Thanks

`properties-order` and `properties-alphabetical-order` code and readme are based on `declaration-block-properties-order` rule which was a stylelint's core rule prior stylelint 8.0.0.

[ci-img]: https://travis-ci.org/hudochenkov/stylelint-order.svg
[ci]: https://travis-ci.org/hudochenkov/stylelint-order

[stylelint]: https://stylelint.io/
