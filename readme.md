
# ➡️ Renamed as [Parcel Mix](https://github.com/adamkiss/parcel-mix)

Due to how this was originally published, named, etc. the project was renamed to parcel-mix (cheeky) and moved. In lieu of just renaming the repository, this one is archived and new can be found at https://github.com/adamkiss/parcel-mix

---

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

2020 Adam.
