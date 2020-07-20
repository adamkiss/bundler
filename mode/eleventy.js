/**
 * Used for my usage with Kirby CMS <getkirby.com>
 */
const path = require('path')

/**
 * "originalName": {
 * 	type: (css|js|jpg|…)
 * }
 */
const manifestTemplate = files => JSON.stringify(files, null, `\t`)

module.exports = {
	/**
	 * Parcel/cleanup related options
	 */
	outDir: '__build__/assets/dist',
	entryFile: 'assets/assets.html',
	bundlerOpts: {
		publicUrl: '/assets/dist'
	},

	/**
	 * Manifest related options
	 */
	manifestPath: 'data/assets.json',
	manifestTemplate
}
