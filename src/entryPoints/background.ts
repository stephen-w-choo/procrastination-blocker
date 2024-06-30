import { SettingsRepository } from "../data/SettingsRepository"
import { SiteDataRepository } from "../data/SiteDataRepository"
import { SiteData } from "../data/models/SiteData"
import { SiteClassifier } from "../domain/SiteClassifier"
import {
	CheckFocusModeRequest,
	CheckFocusModeResponse,
	CheckSiteSeenRequest,
	CheckSiteSeenResponse,
	ErrorResponse,
	GenericResponse,
	GetSettingsRequest,
	ModelMetricsRequest,
	ModelMetricsResponse,
	ModelSyncRequest,
	ModelSyncResponse,
	RepositoryRequest,
	SetSettingsRequest,
	SettingsResponse,
	SiteClassificationRequest,
	SiteClassificationResponse,
	ToggleFocusModeRequest,
	ToggleFocusModeResponse,
} from "../messagePassing/base/MessageTypes"
import { setAsynchronousListener, setListener } from "../messagePassing/base/setListener"

/**
 * Notes for future refactoring - we can combine the individual listeners into one
 * listener that takes a command and then executes the appropriate function, which will be more efficient
 *
 * A single listener would normally be unreadable, which is why I initially avoided it,
 * but I think we can make a readable version using a builder pattern.
 */

class BackgroundProcess {
	siteDataRepository: SiteDataRepository
	settingsRepository: SettingsRepository
	classifierModels: SiteClassifier
	focusModeState: boolean = false

	private constructor(
		siteDataRepository: SiteDataRepository,
		settingsRepository: SettingsRepository,
		classifierModels: SiteClassifier
	) {
		this.siteDataRepository = siteDataRepository
		this.settingsRepository = settingsRepository
		this.classifierModels = classifierModels
	}

	static async build(): Promise<BackgroundProcess> {
		const siteDataRepository = new SiteDataRepository()
		const settingsRepository = await SettingsRepository.build()
		const classifierModels = new SiteClassifier(
			siteDataRepository,
			settingsRepository
		)

		const focusModeSetting = await settingsRepository.getFocusModeSetting()

		if (focusModeSetting.focusModeStatus === true) {
			await classifierModels.syncModels()
		}

		return new BackgroundProcess(
			siteDataRepository,
			settingsRepository,
			classifierModels
		)
	}

	setListeners() {
		this.setSiteClassificationListener()
		this.setModelMetricsListener()
		this.setRepositoryRequestListener()
		this.setModelSyncRequestListener()
		this.setCheckSiteSeenListener()
		this.setToggleFocusModeListener()
		this.setSettingsListener()
	}

	setSiteClassificationListener() {
		setListener<SiteClassificationRequest, SiteClassificationResponse>(
			(request, _, sendResponse) => {
				if (request.command == "checkSiteStatus") {
					try {
						const currentSiteData: SiteData = JSON.parse(
							request.serialisedSiteData
						)
						let classification =
							this.classifierModels.classify(currentSiteData)
						if (classification != null) {
							sendResponse({
								procrastinationScore: classification.procrastinationScore,
								trainedOn: classification.trainedOn,
								success: true,
							})
						} else {
							sendResponse({
								success: false,
								modelUntrained: true,
							})
						}
					} catch (error) {
						sendResponse({
							success: false,
						})
					}
				}
			}
		)
	}

	setCheckSiteSeenListener() {
		setListener<CheckSiteSeenRequest, CheckSiteSeenResponse>(
			(request, _, sendResponse) => {
				if (request.command == "checkSiteSeen") {
					const seenBefore = this.siteDataRepository.hasSite(
						request.serialisedSiteData
					)
					sendResponse({ seenBefore: seenBefore })
				}
			}
		)
	}

	setToggleFocusModeListener() {
		// This should to be separated out into two separate listeners
		// The original function had a single response type - now that there are two
		// response types, we're losing type safety
		setAsynchronousListener<
			ToggleFocusModeRequest | CheckFocusModeRequest,
			CheckFocusModeResponse | ToggleFocusModeResponse | ErrorResponse
		>((request, _, sendResponse) => {
			try {
				if (request.command == "toggleFocusMode") {
					if (request.toggle === true) {
						// sync models if toggling on
						this.classifierModels
							.syncModels()
							.then(() => {
								// if the models are invalid, don't allow focus mode to be turned on
								// this is already checked in the view layer, but we also want to make sure
								// the background process doesn't allow it
								if (this.classifierModels.modelsInvalid) {
									this.settingsRepository.setFocusModeSetting(false)
									sendResponse({ toggleStatus: false, success: false })
									return
								}
							})
							.catch(() => {
								throw new Error("Error syncing models")
							})
					}
					this.settingsRepository
						.setFocusModeSetting(request.toggle)
						.then(value => {
							sendResponse({ toggleStatus: value, success: true })
						})
				} else if (request.command == "checkFocusMode") {
					this.settingsRepository.getFocusModeSetting().then(settings => {
						sendResponse({
							success: true,
							toggleStatus: settings.focusModeStatus,
							threshold: settings.threshold,
						})
					})
				}
			} catch (e: any) {
				console.error(e)
				sendResponse({ success: false, error: e.toString() })
			}
		})
	}

	setSettingsListener() {
		setAsynchronousListener<
			GetSettingsRequest | SetSettingsRequest,
			SettingsResponse | ErrorResponse
		>((request, _, sendResponse) => {
			try {
				if (request.command == "getSettings") {
					this.settingsRepository.getSettings().then(settings => {
						sendResponse({ settings })
					})
				}
				if (request.command == "setSettings") {
					this.settingsRepository
						.setSettings(request.settings)
						.then(settings => {
							sendResponse({ settings })
						})
				}
			} catch (e: any) {
				sendResponse({ success: false, error: e.toString() })
			}
		})
	}

	setModelMetricsListener() {
		setListener<ModelMetricsRequest, ModelMetricsResponse>(
			(request, _, sendResponse) => {
				if (request.command == "modelDataRequest") {
					sendResponse({
						procrastination:
							this.siteDataRepository.procrastinationSiteList.length,
						productive: this.siteDataRepository.productiveSiteList.length,
						changesSinceLastSync:
							this.siteDataRepository.changesSinceLastSync,
					})
				}
			}
		)
	}

	setModelSyncRequestListener() {
		setListener<ModelSyncRequest, ModelSyncResponse>((request, _, sendResponse) => {
			if (request.command == "syncModel") {
				try {
					this.classifierModels
						.syncModels()
						.then(() => {
							sendResponse({
								success: true,
							})
						})
						.catch(() => {
							throw new Error("Error syncing models")
						})
				} catch {
					sendResponse({
						success: false,
					})
				}
			}
		})
	}

	setRepositoryRequestListener() {
		setListener<RepositoryRequest, GenericResponse>((request, _, sendResponse) => {
			if (request.command == "addSite") {
				try {
					if (request.type == undefined)
						throw new Error("No site type provided")
					const addingSite: SiteData = JSON.parse(request.serialisedSiteData)
					this.siteDataRepository.addSite(addingSite, request.type)
					sendResponse({ success: true })
				} catch {
					sendResponse({
						success: false,
						debugInfo: "Error parsing site data",
					})
				}
			}

			if (request.command == "removeSite") {
				try {
					const removingSite: SiteData = JSON.parse(request.serialisedSiteData)
					this.siteDataRepository.removeSite(removingSite)
					sendResponse({ success: true })
				} catch {
					sendResponse({
						success: false,
						debugInfo: "Error parsing site data",
					})
				}
			}

			if (request.command == "reclassifySite") {
				try {
					const reclassifyingSite: SiteData = JSON.parse(
						request.serialisedSiteData
					)
					this.siteDataRepository.reclassifySite(reclassifyingSite)
					sendResponse({ success: true })
				} catch {
					sendResponse({
						success: false,
						debugInfo: "Error parsing site data",
					})
				}
			}
		})
	}
}

;(async () => {
	const backgroundProcess = await BackgroundProcess.build()
	backgroundProcess.setListeners()

	console.log("Service worker is fully initialized and listeners are set.")
})()
