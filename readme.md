# @adamkiss/bundler

> Packaged version of Parcel JS, tailored to my usecases. It's just a simple wrapper around Parcel to generate manifests for me, pre-set with my paths and such.

## Install

``` bash
npm i -D @adamkiss/bundler
```

## Usage

In package.json:

``` json
{
	"scripts": {
		"dev:assets": "npx @adamkiss/bundler [--watch] [--no-hoist] [-m MODE]"
 	}
}
```

## Currently active modes:

- Kirby
- Eleventy

@todo: describe :D

## Gotchas I might forget

### Parcel

2020 Adam.
