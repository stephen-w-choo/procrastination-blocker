import { Category, SerialisedSiteData } from "../data/models/SiteData"
import {
	ClassificationRequest,
	GenericResponse,
	SiteStatusResponse,
} from "./base/MessageTypes"
import { sendMessage } from "./base/sendMessage"

// Use cases for classifying sites.

export function addSiteUseCase(siteType: Category, siteData: SerialisedSiteData) {
	return sendMessage<ClassificationRequest, GenericResponse>({
		command: "addSite",
		serialisedSiteData: siteData,
		type: siteType,
	})
}

export function removeSiteUseCase(siteType: Category, siteData: SerialisedSiteData) {
	return sendMessage<ClassificationRequest, SiteStatusResponse>({
		command: "removeSite",
		serialisedSiteData: siteData,
		type: siteType,
	})
}
