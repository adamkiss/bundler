/**
 * Used for my usage with Kirby CMS <getkirby.com>
 */
const path = require('path')

/**
 * "originalName": {
 * 	type: (css|js|jpg|…)
 * }
 */
const manifestTemplate = files => `<?php
if (! function_exists('bundle')) {
	function bundle($key = '') {
		$manifest = [
			${Object.keys(files).map(k => `'${k}' => [
				'type' => '${files[k].type}',
				'url' => '${files[k].url}'
			]`).join(`,
			`)}
		];
		return array_key_exists($key, $manifest) ? $manifest[$key] : $key;
	}
}
`

module.exports = {
	/**
	 * Parcel/cleanup related options
	 */
	outDir: 'public/assets/dist',
	entryFile: 'assets/assets.html',
	bundlerOpts: {
		publicUrl: '/assets/dist'
	},

	/**
	 * Manifest related options
	 */
	manifestPath: 'site/snippets/_bundler.php',
	manifestTemplate
}
