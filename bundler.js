#!/usr/bin/env node

const path = require('path')
const fs = require('fs')
const Parcel = require('parcel-bundler')
const BrowserSync = require('browser-sync').create()
const stringify = require('stringify-object')
const {
	writeFile, deleteFile, readDir, deleteAllFilesIn,
	findProjectRoot,
	// getBundleFiles,
	// createEntryFile, deleteEntryFile
} = require('./utils.js')
const {
	generateManifest
} = require('./manifest.js')

/* Find bundler.config.js, or expect Kirby setup and set it up */
const configFile = path.join(findProjectRoot(), 'bundler.config.js')
if (!fs.existsSync(configFile)) {
	fs.writeFileSync(configFile, fs.readFileSync(path.join(__dirname, 'default-kirby-config.js')))
}
const config = require(configFile)

const args = require('minimist')(process.argv.slice(2), {
	default: {
		watch: true
	}
})

const opts = {
	production: process.env.NODE_ENV === 'production',
	watch: args.watch && process.env.NODE_ENV !== 'production',
	config
}
const parcelOpts = Object.assign({
	logLevel: opts.production ? 4 : 3,
	scopeHoist: opts.scopeHoist,
	contentHash: opts.production,
	sourceMaps: !opts.production
}, config.parcelOpts)

/*
	RUN
*/
;(async function () {
	// deleteAllFilesIn(parcelOpts.outDir)
	// await createEntryFile(config)

	const bundler = new Parcel(config.files, parcelOpts)
	bundler.on('bundled', async bundle => {
		console.log(bundle)
		await writeFile('inspect.json', stringify(bundle))
		console.log(generateManifest(bundle, config))
	})

	await bundler.bundle()

	if (!opts.watch) {
		await bundler.stop()
		// await deleteEntryFile(config)
	} else {
		if (config.bs && config.bs.proxy) {
			BrowserSync.init(config.bs)
		}

		process.on('beforeExit', code => {
			console.log('beforeExit: ', code)
		})

		process.on('SIGINT', async () => {
			await bundler.stop()
			await deleteEntryFile(config)
			if (BrowserSync.active){
				BrowserSync.exit()
			}
		})
	}
})()
