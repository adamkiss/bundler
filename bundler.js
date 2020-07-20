#!/usr/bin/env node

const path = require('path')
const fs = require('fs')
const util = require('util')
const Parcel = require('parcel-bundler')

const writeFile = util.promisify(fs.writeFile)
const deleteFile = util.promisify(fs.unlink)
const readDir = util.promisify(fs.readdir)

const modes = {
	kirby: require('./mode/kirby'),
	eleventy: require('./mode/eleventy')
}

const args = require('minimist')(process.argv.slice(2), {
	default: {
		watch: false,
		mode: 'eleventy'
	}
})
const opts = {
	production: process.env.NODE_ENV === 'production',
	watch: args.watch && process.env.NODE_ENV !== 'production',
	mode: args.m || args.mode,
	scopeHoist: ('--no-hoist' in args) ? false : true
}

const mode = modes[opts.mode]
const entryFile = mode.entryFile
const bundlerOpts = Object.assign({
	autoInstall: false,
	scopeHoist: opts.scopeHoist,
	contentHash: opts.production,
	sourceMaps: !opts.production
}, {
	outDir: mode.outDir
}, mode.bundlerOpts)

/*
	LIB
*/
const getBundleFiles = bundle => {
	const bundleFiles = {}
	// Set.forEach has weird callback
	// "value, key, Set", but key is… the same as value?
	bundle.childBundles.forEach(child => {
		bundleFiles[child.entryAsset.relativeName] = {
			type: child.type,
			dist: path.join(
				mode.outDir,
				path.basename(child.name)
			),
			url: path.join(
				mode.bundlerOpts.publicUrl,
				path.basename(child.name)
			)
		}
	})
	return bundleFiles
}

const deleteAllFilesIn = async dir => {
	if (!fs.existsSync(dir))
		return

	;(await readDir(dir)).forEach(async file => {
		await deleteFile(path.join(dir, file))
	})
}

const manifest = async (mode, bundle) => {
	await writeFile(
		mode.manifestPath,
		mode.manifestTemplate(getBundleFiles(bundle))
	)
	const outFile = path.join(mode.outDir, path.basename(mode.entryFile))
	if (fs.existsSync(outFile)) {
		await deleteFile(outFile)
	}
}

/*
	RUN
*/
;(async function () {
	deleteAllFilesIn(mode.outDir)

	const bundler = new Parcel(entryFile,bundlerOpts)
	bundler.on('bundled', async bundle => {
		await manifest(mode, bundle)
	})

	const bundle = await bundler.bundle()

	if (!opts.watch) {
		await bundler.stop()
	} else {
		process.on('SIGINT', async () => {
			await bundler.stop()
		})
	}
})()
