import { LocalStorageObject } from "./base/LocalStorageObject"

export function exportLocalStorage(): Promise<LocalStorageObject> {
	return new Promise((resolve, reject) => {
		chrome.storage.local.get(null, items => {
			if (chrome.runtime.lastError) {
				reject(chrome.runtime.lastError)
			}
			resolve(items)
		})
	})
}

export function importLocalStorage(importedData: LocalStorageObject): Promise<boolean> {
	return new Promise((resolve, reject) => {
		// TODO: clear the data, not clearing yet to avoid data loss
		// chrome.storage.local.clear()

		chrome.storage.local.set(importedData, () => {
			if (chrome.runtime.lastError) {
				console.error(chrome.runtime.lastError)
			}
			chrome.runtime.reload()
			resolve(true)
		})
	})
}
