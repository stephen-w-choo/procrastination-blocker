const SETTINGS_STORAGE_PREFIX = "$SETTINGS"

// boolean flag to enable/disable focus mode
const FOCUS_MODE_SUFFIX = "///focusMode"

// boolean flag to determine if the extension has been seeded with data
const SEEDED_SUFFIX = "///seeded"

export class SettingsRepository {
	static getFocusModeSetting(): Promise<boolean> {
		return new Promise(resolve => {
			chrome.storage.local.get(
				`${SETTINGS_STORAGE_PREFIX}${FOCUS_MODE_SUFFIX}`,
				result => {
					resolve(result[`${SETTINGS_STORAGE_PREFIX}${FOCUS_MODE_SUFFIX}`])
				}
			)
		})
	}

	static setFocusModeSetting(value: boolean): Promise<boolean> {
		return new Promise(resolve => {
			chrome.storage.local.set(
				{ [`${SETTINGS_STORAGE_PREFIX}${FOCUS_MODE_SUFFIX}`]: value },
				() => {
					resolve(value)
				}
			)
		})
	}
}
