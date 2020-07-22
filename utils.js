const path = require('path')
const fs = require('fs')
const util = require('util')
const writeFile = util.promisify(fs.writeFile)
const deleteFile = util.promisify(fs.unlink)
const readDir = util.promisify(fs.readdir)

/*
@note This is for now. I usually run assets from project root
      If it later bites me in the ass, I'll have this prepared
*/
const findProjectRoot = () => process.cwd()

const getBundleFiles = (config, bundle) => {
	const bundleFiles = {}
	/* Set.forEach has weird callback
		"value, key, Set", but key is… the same as value? */
	bundle.childBundles.forEach(child => {
		bundleFiles[child.entryAsset.relativeName] = {
			type: child.type,
			dist: path.join(
				config.parcelOpts.outDir,
				path.basename(child.name)
			),
			url: path.join(
				config.parcelOpts.publicUrl,
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

const entryFile = files => (`
<!DOCTYPE html>
<html>
<head>
	${
		files
			.filter(f => ['.css', '.scss', '.sass', '.pcss', '.postcss'].includes(path.extname(f)))
			.map(f => (`<link rel="stylesheet" href="${f}">`))
			.join('')
	}
	${
		files
			.filter(f => ['.js'].includes(path.extname(f)))
			.map(f => (`<script src="${f}"></script>`))
			.join('')
	}
</head>
<body>
	${
		files
			.filter(f => ['.jpg', '.jpeg', '.gif', '.png', '.svg'].includes(path.extname(f)))
			.map(f => (`<img src="${f}">`))
			.join('')
	}
</body>
</html>
`)
const createEntryFile = config => {
	return writeFile(path.join(findProjectRoot(), config.entryFile), entryFile(config.files))
}
const deleteEntryFile = config => {
	return deleteFile(path.join(findProjectRoot(), config.entryFile))
}

module.exports = {
	writeFile, deleteFile, readDir, deleteAllFilesIn,
	findProjectRoot,
	getBundleFiles,
	createEntryFile, deleteEntryFile
}
