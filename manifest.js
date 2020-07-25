const path = require('path')
const {writeFile} = require('./utils')

const getAssets = bundle => {
	/*
		if the bundler was given multiple files, the "top level bundle".type is empty
		I just convert it to new one element Set
		and now I'm like 99% sure 'bundleFiles' is set of real bundles
	*/
	return (bundle.type ? [bundle] : Array.from(bundle.childBundles)).map(bundle => Object.assign({
		parcelname: path.basename(bundle.name),
		parcelpath: bundle.name,
		path: path.dirname(bundle.name)
	}, bundle.entryAsset))
}

const getHashName = asset => {
	const parts = asset.parcelname
		.split('.')
	const ext = parts.pop()
	return [...parts, asset.hash.slice(0, 10), ext].join('.')
}

const createManifestObjects = (assets, config) => assets.map(asset => {
	hashname = getHashName(asset)
	return {
		type: asset.type,
		name: asset.relativeName,
		url: path.join(config.parcelOpts.publicUrl, hashname),
		dist: hashname,
		distabs: path.join(asset.path, hashname),
		distrel: path.join(config.parcelOpts.outDir, hashname),
		parcelname: asset.parcelname,
		parcelabs: asset.parcelpath
	}
})

const generateManifest = (bundle, config) => {
	const manifest = {}
	createManifestObjects(getAssets(bundle), config)
		.map(asset => {
			manifest[asset.name] = asset
		})

	return manifest
}

module.exports = {
	generateManifest
}
