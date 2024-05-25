import { SiteDataRepository } from "../data/SiteDataRepository"
import { Category, SiteData } from "../data/models/SiteData"
import { ClassifierModels } from "../domain/ClassifierModels"
import {
	GenericResponse,
	ModelMetricsRequest,
	ModelMetricsResponse,
	RepositoryRequest,
	SiteClassificationRequest,
	SiteClassificationResponse,
} from "../messagePassing/base/MessageTypes"
import { setListener } from "../messagePassing/base/setListener"
import procrastinationSites from "../procrastinationSitesSeed"
import productiveSites from "../productiveSitesSeed"

class BackgroundProcess {
	siteDataRepository: SiteDataRepository
	classifierModels: ClassifierModels

	constructor() {
		this.siteDataRepository = new SiteDataRepository()
		// this.seedRepository()
		this.classifierModels = new ClassifierModels(this.siteDataRepository)
	}

	setListeners() {
		this.setSiteClassificationListener()
		this.setModelMetricsListener()
		this.setRepositoryRequestListener()
	}

	seedRepository() {
		for (const procrastinationSite of procrastinationSites) {
			this.siteDataRepository.addSite(procrastinationSite, Category.procrastination)
		}
		for (const productiveSite of productiveSites) {
			this.siteDataRepository.addSite(productiveSite, Category.productive)
		}
	}

	setSiteClassificationListener() {
		setListener<SiteClassificationRequest, SiteClassificationResponse>((request, _, sendResponse) => {
			if (request.command == "checkSiteStatus") {
				try {
					const seenBefore = this.siteDataRepository.hasSite(request.serialisedSiteData)
					const currentSiteData: SiteData = JSON.parse(request.serialisedSiteData)
					console.log("Current site data", currentSiteData)
					// let isProcrastinationSite = this.classifierModels.classify(currentSiteData)
					sendResponse({
						// isProcrastinationSite: isProcrastinationSite[0],
						isProcrastinationSite: 0,
						seenBefore: seenBefore,
						success: true,
						// debugInfo: isProcrastinationSite[1].toString(),
					})
				} catch {
					console.log("Error parsing site data")
					console.log(request)
					sendResponse({
						success: false,
						debugInfo: "Error parsing site data",
					})
				}
			}
		})
	}

	setModelMetricsListener() {
		setListener<ModelMetricsRequest, ModelMetricsResponse>((request, _, sendResponse) => {
			if (request.command == "modelDataRequest") {
				sendResponse({
					procrastination: this.siteDataRepository.procrastinationSiteList.length,
					productive: this.siteDataRepository.productiveSiteList.length,
				})
			}
		})
	}
	
	setRepositoryRequestListener() {
		setListener<RepositoryRequest, GenericResponse>((request, _, sendResponse) => {
			if (request.command == "addSite") {
				try {
					if (request.type == undefined) throw new Error("No site type provided")
					const addingSite: SiteData = JSON.parse(request.serialisedSiteData)
					this.siteDataRepository.addSite(addingSite, request.type)
					sendResponse({ success: true })
				} catch {
					console.log("Error parsing site data")
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
					console.log("Error parsing site data")
					sendResponse({
						success: false,
						debugInfo: "Error parsing site data",
					})
				}
			}

			if (request.command == "reclassifySite") {
				try {
					const reclassifyingSite: SiteData = JSON.parse(request.serialisedSiteData)
					this.siteDataRepository.reclassifySite(reclassifyingSite)
					sendResponse({ success: true })
				} catch {
					console.log("Error parsing site data")
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