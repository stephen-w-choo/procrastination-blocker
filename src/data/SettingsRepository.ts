import { DefaultSettings, Settings } from "./models/Settings"

const SETTINGS_PREFIX = "$SETTINGS"

const SETTINGS_KEYS = {
	baseKeywords: `${SETTINGS_PREFIX}///baseKeywords`,
	threshold: `${SETTINGS_PREFIX}///threshold`,
	focusMode: `${SETTINGS_PREFIX}///focusMode`,
	seeded: `${SETTINGS_PREFIX}///seeded`,
}

export class SettingsRepository {
	private constructor() {}

	static async build(): Promise<SettingsRepository> {
		const repo = new SettingsRepository()
		await repo.initialiseSettings()
		return repo
	}

	async initialiseSettings(): Promise<void> {
		const result = await this.getSettings()

		// If the settings have not been set, seed them
		if (result.keywordData == undefined || result.threshold == undefined) {
			await this.seedDefaultSettings()
		}
	}

	async seedDefaultSettings(): Promise<void> {
		try {
			await this.setSettings(DefaultSettings)
		} catch (error) {
			console.error("Error seeding default settings", error)
		}
	}

	// Note - unlike the site data, we store the entire base keywords data as a single object
	// rather than in separate key-value pairs. This is because we expect to batch updates,
	// and we do not need to update keywords one-by-one, unlike site data.
	setSettings(settingsData: Settings): Promise<Settings> {
		return new Promise((resolve, reject) => {
			try {
				chrome.storage.local.set(
					{
						[SETTINGS_KEYS.threshold]: settingsData.threshold,
						[SETTINGS_KEYS.baseKeywords]: settingsData.keywordData,
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
				[SETTINGS_KEYS.threshold, SETTINGS_KEYS.baseKeywords],
				result => {
					resolve({
						threshold: result[SETTINGS_KEYS.threshold],
						keywordData: result[SETTINGS_KEYS.baseKeywords],
					} as Settings)
				}
			)
		})
	}

	// This will also return the threshold, since it's required for focus mode
	getFocusModeSetting(): Promise<{ threshold: number; focusModeStatus: boolean }> {
		return new Promise(resolve => {
			chrome.storage.local.get(
				[SETTINGS_KEYS.focusMode, SETTINGS_KEYS.threshold],
				result => {
					resolve({
						threshold: result[SETTINGS_KEYS.threshold],
						focusModeStatus: result[SETTINGS_KEYS.focusMode],
					})
				}
			)
		})
	}

	setFocusModeSetting(value: boolean): Promise<boolean> {
		return new Promise(resolve => {
			chrome.storage.local.set({ [SETTINGS_KEYS.focusMode]: value }, () => {
				resolve(value)
			})
		})
	}
}
