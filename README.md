# stylelint-order [![Build Status][ci-img]][ci] [![npm version][npm-version-img]][npm] [![npm downloads last month][npm-downloads-img]][npm]

A plugin pack of order-related linting rules for [stylelint]. Every rule support autofixing (`stylelint --fix`).

## Installation

1. If you haven't, install [stylelint]:

```
npm install stylelint --save-dev
```

2.  Install `stylelint-oder`:

```
npm install stylelint-order --save-dev
```

## Usage

Add `stylelint-order` to your stylelint config `plugins` array, then add rules you need to the rules list. All rules from stylelint-order need to be namespaced with `order`.

```json
{
	"plugins": [
		"stylelint-order"
	],
	"rules": {
		"order/order": [
			"custom-properties",
			"declarations"
		],
		"order/properties-alphabetical-order": true
	}
}
```

## Rules

* [`order`](./rules/order/README.md): Specify the order of content within declaration blocks.
* [`properties-order`](./rules/properties-order/README.md): Specify the order of properties within declaration blocks.
* [`properties-alphabetical-order`](./rules/properties-alphabetical-order/README.md): Specify the alphabetical order of properties within declaration blocks.

## Autofixing

Every rule supports autofixing with `stylelint --fix`. [postcss-sorting] is used internally for order autofixing.

Automatic sorting has some limitations that are described for every rule, if any. Please, take a look at [how comments are handled](https://github.com/hudochenkov/postcss-sorting#handling-comments) by `postcss-sorting`.

CSS-in-JS styles with template interpolation [could be ignored by autofixing](https://github.com/hudochenkov/postcss-sorting#css-in-js) to avoid style corruption.

Autofixing is enabled by default if it's enabled in stylelint's configuration file. It can be disabled on a per rule basis using the secondary option `disableFix: true`. Here's an example:

```json
	"rules": {
		"order/order": [
			[
				"custom-properties",
				"declarations"
			],
			{
				"disableFix": true
			}
		]
	}
```

Less may work but isn't officially supported.

## Thanks

`properties-order` and `properties-alphabetical-order` code and README are based on the `declaration-block-properties-order` rule which was a core rule prior to stylelint 8.0.0.

[ci-img]: https://travis-ci.org/hudochenkov/stylelint-order.svg
[ci]: https://travis-ci.org/hudochenkov/stylelint-order
[npm-version-img]: https://img.shields.io/npm/v/stylelint-order.svg
[npm-downloads-img]: https://img.shields.io/npm/dm/stylelint-order.svg
[npm]: https://www.npmjs.com/package/stylelint-order
[stylelint]: https://stylelint.io/
[postcss-sorting]: https://github.com/hudochenkov/postcss-sorting
