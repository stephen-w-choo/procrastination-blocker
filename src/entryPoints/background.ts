import { SettingsRepository } from "../data/SettingsRepository"
import { SiteDataRepository } from "../data/SiteDataRepository"
import { SiteData } from "../data/models/SiteData"
import { SiteClassifier } from "../domain/SiteClassifier"
import {
	CheckFocusModeRequest,
	CheckSiteSeenRequest,
	CheckSiteSeenResponse,
	FocusModeResponse,
	GenericResponse,
	ModelMetricsRequest,
	ModelMetricsResponse,
	ModelSyncRequest,
	ModelSyncResponse,
	RepositoryRequest,
	SiteClassificationRequest,
	SiteClassificationResponse,
	ToggleFocusModeRequest,
} from "../messagePassing/base/MessageTypes"
import { setAsynchronousListener, setListener } from "../messagePassing/base/setListener"

class BackgroundProcess {
	siteDataRepository: SiteDataRepository
	classifierModels: SiteClassifier
	focusModeState: boolean = false

	constructor() {
		this.siteDataRepository = new SiteDataRepository()
		this.classifierModels = new SiteClassifier(this.siteDataRepository)

		SettingsRepository.getFocusModeSetting().then(value => {
			if (value) {
				this.classifierModels.syncModels()
			}
		})
	}

	setListeners() {
		this.setSiteClassificationListener()
		this.setModelMetricsListener()
		this.setRepositoryRequestListener()
		this.setModelSyncRequestListener()
		this.setCheckSiteSeenListener()
		this.setToggleFocusModeListener()
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
		setAsynchronousListener<
			ToggleFocusModeRequest | CheckFocusModeRequest,
			FocusModeResponse
		>((request, _, sendResponse) => {
			try {
				if (request.command == "toggleFocusMode") {
					if (request.toggle === true) {
						// sync models if toggling on
						this.classifierModels.syncModels()

						// if the models are invalid, don't allow focus mode to be turned on
						// this is already checked in the view layer, but we also want to make sure
						// the background process doesn't allow it
						if (this.classifierModels.modelsInvalid) {
							SettingsRepository.setFocusModeSetting(false)
							sendResponse({ toggleStatus: false, success: false })
							return
						}
					}

					SettingsRepository.setFocusModeSetting(request.toggle).then(value => {
						sendResponse({ toggleStatus: value, success: true })
					})
				} else if (request.command == "checkFocusMode") {
					SettingsRepository.getFocusModeSetting().then(value => {
						sendResponse({ toggleStatus: value, success: true })
					})
				}
			} catch (e) {
				console.error(e)
				sendResponse({ success: false })
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
					this.classifierModels.syncModels()
					sendResponse({
						success: true,
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

const backgroundProcess = new BackgroundProcess()
backgroundProcess.setListeners()
