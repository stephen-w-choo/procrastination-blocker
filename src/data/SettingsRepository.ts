import { DefaultSettings, Settings } from "./models/Settings"

const SETTINGS_PREFIX = "$SETTINGS"
const BASE_KEYWORDS_SUFFIX = "///baseKeywords"
const THRESHOLD_SUFFIX = "///threshold"

// boolean flag to enable/disable focus mode
const FOCUS_MODE_SUFFIX = "///focusMode"
// boolean flag to determine if the extension has been seeded with data
const SEEDED_SUFFIX = "///seeded"

export class SettingsRepository {
	private constructor() {}

	static async build(): Promise<SettingsRepository> {
		const repo = new SettingsRepository()
		await repo.initialiseSettings()
		return repo
	}

	async initialiseSettings(): Promise<void> {
		// check if the extension has been seeded with data
		const result = await this.getChromeStorage(`${SETTINGS_PREFIX}${SEEDED_SUFFIX}`)
		console.log("Seeded flag", result)
		// if not previously seeded, seed the base keywords
		// if (!result[`${SETTINGS_PREFIX}${SEEDED_SUFFIX}`]) {
			await this.seedDefaultSettings()
		// }
	}

	private getChromeStorage(key: string): Promise<{ [key: string]: any }> {
		return new Promise((resolve, reject) => {
			chrome.storage.local.get(key, result => {
				if (chrome.runtime.lastError) {
					reject(chrome.runtime.lastError)
				} else {
					resolve(result)
				}
			})
		})
	}

	async seedDefaultSettings(): Promise<void> {
		try {
			const keywords = await this.getSettings()
			// make sure no keywords are already set
			console.log("Seeding settings", DefaultSettings)
			const result = await this.setSettings(DefaultSettings)
			if (result) {
				await this.setSeeded(true)
			}
		} catch (error) {
			console.error("Error seeding default settings", error)
		}
	}

	setSeeded(value: boolean): Promise<boolean> {
		return new Promise(resolve => {
			chrome.storage.local.set(
				{ [`${SETTINGS_PREFIX}${SEEDED_SUFFIX}`]: value },
				() => {
					resolve(value)
				}
			)
		})
	}

	// Note - unlike the site data, we store the entire base keywords data as a single object
	// rather than in separate key-value pairs. This is because we expect to batch updates,
	// and we do not need to update keywords one-by-one, unlike site data.
	setSettings(settingsData: Settings): Promise<Settings> {
		return new Promise((resolve, reject) => {
			try {
				chrome.storage.local.set(
					{
						[`${SETTINGS_PREFIX}${THRESHOLD_SUFFIX}`]: settingsData.threshold,
						[`${SETTINGS_PREFIX}${BASE_KEYWORDS_SUFFIX}`]:
							settingsData.keywordData,
					},
					() => {
						resolve(settingsData)
					}
				)
			} catch (e) {
				reject(e)
			}
		})
	}

	getSettings(): Promise<Settings> {
		return new Promise((resolve, reject) => {
			chrome.storage.local.get(
				[
					`${SETTINGS_PREFIX}${BASE_KEYWORDS_SUFFIX}`,
					`${SETTINGS_PREFIX}${THRESHOLD_SUFFIX}`,
				],
				result => {
					console.log(result)
					console.log(result.threshold)
					resolve({
						threshold: result[`${SETTINGS_PREFIX}${THRESHOLD_SUFFIX}`],
						keywordData: result[`${SETTINGS_PREFIX}${BASE_KEYWORDS_SUFFIX}`],
					} as Settings)
				}
			)
		})
	}

	getFocusModeSetting(): Promise<{ threshold: number; focusModeStatus: boolean }> {
		return new Promise(resolve => {
			chrome.storage.local.get(
				[
					`${SETTINGS_PREFIX}${FOCUS_MODE_SUFFIX}`,
					`${SETTINGS_PREFIX}${THRESHOLD_SUFFIX}`,
				],
				result => {
					resolve({
						threshold: result[`${SETTINGS_PREFIX}${THRESHOLD_SUFFIX}`],
						focusModeStatus: result[`${SETTINGS_PREFIX}${FOCUS_MODE_SUFFIX}`],
					})
				}
			)
		})
	}

	setFocusModeSetting(value: boolean): Promise<boolean> {
		return new Promise(resolve => {
			chrome.storage.local.set(
				{ [`${SETTINGS_PREFIX}${FOCUS_MODE_SUFFIX}`]: value },
				() => {
					resolve(value)
				}
			)
		})
	}
}
