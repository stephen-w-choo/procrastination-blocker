import { SiteDataRepository } from "../data/SiteDataRepository"
import { Category, SiteData } from "../data/models/SiteData"
import { ClassifierModels } from "../domain/ClassifierModels"
import {
	BackgroundRequest,
	BackgroundResponse,
	TrainingRequest,
} from "../domain/models/MessageTypes"
import procrastinationSites from "../procrastinationSites"
import productiveSites from "../productiveSites"

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
chrome.runtime.onMessage.addListener(
	(
		request: BackgroundRequest,
		_: chrome.runtime.MessageSender,
		sendResponse: (response: BackgroundResponse) => void
	) => {
		if (request.command == "checkSiteStatus") {
			try {
				const seenBefore = siteDataRepository.hasSite(request.serialisedSiteData)
				const currentSiteData: SiteData = JSON.parse(
					request.serialisedSiteData
				)
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

chrome.runtime.onMessage.addListener(
	(
		request: TrainingRequest,
		_: chrome.runtime.MessageSender,
		sendResponse: (response: BackgroundResponse) => void
	) => {
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
