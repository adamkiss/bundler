module.exports = {
	/*
	 * Which files do actually get processed?
	 */
	files: [
		'main.sass', 'main.js'
	],

	/**
	 * Parcel/cleanup related options
	 */
	entryFile: 'assets/assets.html',
	parcelOpts: {
		outDir: 'public/assets/dist',
		publicUrl: '/assets/dist'
	},

	/**
	 * Manifest related options
	 *
	 * "originalName": {
	 * 	type: (css|js|jpg|…)
	 * }
	 */
	manifestPath: 'site/snippets/_bundler.php',
	manifestTemplate: files => (`<?php
		if (! function_exists('bundle')) {
			function bundle($key = '') {
				$manifest = [
					${Object.keys(files).map(k => `'${k}' => (object)[
						'name' => '${k}',
						'type' => '${files[k].type}',
						'url' => '${files[k].url}'
					]`).join(`,
					`)}
				];
				return array_key_exists($key, $manifest) ? $manifest[$key] : $key;
			}
		}
	`),

	/**
	 * BrowserSync
	 */
	bs: {
		proxy: false,
		server: false,

		files: [
			'site/collections/**',
			'site/controllers/**',
			'site/models/**',
			'site/snippets/**',
			'site/templates/**'
		],
		watchOptions: {
			ignireInitial: true
		},

		ghostMode: {
			clicks: true,
			scroll: true,
			location: true,
			forms: false
		}
	}
}
