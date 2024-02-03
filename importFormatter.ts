import { readdir, readFileSync, writeFileSync } from "fs"
import { join } from "path"

const BUILD_FOLDER_NAME = "build"

const mainDirectoryPath = join(__dirname, "build")

function importFormatter(directoryPath: string) {
	readdir(directoryPath, { withFileTypes: true }, (err, entries) => {
		if (err) {
			return console.log("Import formatting failed on build: " + err)
		}

		entries.forEach(entry => {
			let entryPath = join(directoryPath, entry.name)
			if (entry.isDirectory()) {
                // recurse through the folders
				importFormatter(entryPath)
			} else if (entry.isFile() && entry.name.endsWith(".js")) {
                // this regex was made by ChatGPT
                // I genuinely have no idea how it works
				let content: string = readFileSync(entryPath, "utf8")
				const modifiedContent: string = content.replace(
					/from\s+['"]([^'"]+)['"]/g,
					(match: string, p1: string) => {
						if (!p1.endsWith(".js") && !p1.startsWith("http")) {
							return `from '${p1}.js'`
						}
						return match
					}
				)
				writeFileSync(entryPath, modifiedContent)
			}
		})
	})
}

importFormatter(mainDirectoryPath)
