import { SiteDataRepository } from "../data/SiteDataRepository"
import { Category, SiteData } from "../data/models/SiteData"
import { ClassifierModels } from "../domain/ClassifierModels"
import {
	ClassificationRequest,
	GenericResponse,
	ModelDataRequest,
	ModelDataResponse,
	SiteStatusRequest,
	SiteStatusResponse,
} from "../messagePassing/base/MessageTypes"
import { setListener } from "../messagePassing/base/setListener"
import procrastinationSites from "../procrastinationSitesSeed"
import productiveSites from "../productiveSitesSeed"

// Initialise repository
const siteDataRepository = new SiteDataRepository()

// hardcoded data for seed data for now
// TODO: Remove this code once the data setting and retrieval is properly set up
// TODO: Optional - keep it as a separate seed script in another file, with options to either wipe or add to existing data
// the way the data structure is set up, duplicates will be removed anyway, so no issues with addition of duplicates

// Note - data setting and retrieval is now set up - this SHOULD be unnecessary
for (const procrastinationSite of procrastinationSites) {
	siteDataRepository.addSite(procrastinationSite, Category.procrastination)
}

for (const productiveSite of productiveSites) {
	siteDataRepository.addSite(productiveSite, Category.productive)
}

// Initialise models
const classifierModels = new ClassifierModels(siteDataRepository)

// In background script
setListener<SiteStatusRequest, SiteStatusResponse>(
	(request, _, sendResponse) => {
		if (request.command == "checkSiteStatus") {
			try {
				const seenBefore = siteDataRepository.hasSite(request.serialisedSiteData)
				const currentSiteData: SiteData = JSON.parse(request.serialisedSiteData)
				let isProcrastinationSite = classifierModels.classify(currentSiteData)
				sendResponse({
					isProcrastinationSite: isProcrastinationSite[0],
					seenBefore: seenBefore,
					success: true,
					debugInfo: isProcrastinationSite[1].toString(),
				})
			} catch {
				console.log("Error parsing site data")
				sendResponse({
					success: false,
					debugInfo: "Error parsing site data",
				})
			}
		}
	}
)

setListener<ModelDataRequest, ModelDataResponse>(
	(request, _, sendResponse) => {
		if (request.command == "modelDataRequest") {
			sendResponse({
				procrastination: siteDataRepository.procrastinationSiteList.length,
				productive: siteDataRepository.productiveSiteList.length,
			})
		}
	}
)

setListener<ClassificationRequest, GenericResponse>(
	(request, _, sendResponse) => {
		if (request.command == "addSite") {
			try {
				const addingSite: SiteData = JSON.parse(request.serialisedSiteData)
				siteDataRepository.addSite(addingSite, request.type)
				sendResponse({ success: true })
			} catch {
				console.log("Error parsing site data")
				sendResponse({
					success: false,
					debugInfo: "Error parsing site data",
				})
			}
		}
	}
)
