import {
	SiteDataRepository,
	serialiseListData,
} from "./data/SiteDataRepository"
import { Category } from "./data/models/SiteData"
import { ClassifierModels } from "./domain/ClassifierModels"
import procrastinationSites from "./procrastinationSites"
import productiveSites from "./productiveSites"

// Initialise repository
const siteDataRepository = new SiteDataRepository()
// hardcoded data for seeding for now
for (const procrastinationSite of procrastinationSites) {
	siteDataRepository.addSite(procrastinationSite, Category.procrastination)
}

for (const productiveSite of productiveSites) {
	siteDataRepository.addSite(productiveSite, Category.productive)
}

// Initialise models
const classifierModels = new ClassifierModels(siteDataRepository)

// In background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.command == "checkSiteStatus") {
		let url = new URL(request.url)

		console.log(url)
		// let isProcrastinationSite = classifierModels.classify()
		// sendResponse({ isProcrastinationSite })
	}
})
