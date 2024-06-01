import { Category, SerialisedSiteData } from "../data/models/SiteData"
import {
	CheckSiteSeenRequest,
	CheckSiteSeenResponse,
	GenericResponse,
	RepositoryRequest,
} from "./base/MessageTypes"
import { sendMessage } from "./base/sendMessage"

// Use cases for adding/removing sites from the repository.
export function addSiteUseCase(siteType: Category, siteData: SerialisedSiteData) {
	return sendMessage<RepositoryRequest, GenericResponse>({
		command: "addSite",
		serialisedSiteData: siteData,
		type: siteType,
	})
}

export function removeSiteUseCase(siteData: SerialisedSiteData) {
	return sendMessage<RepositoryRequest, GenericResponse>({
		command: "removeSite",
		serialisedSiteData: siteData,
	})
}

export function reclassifySiteUseCase(siteData: SerialisedSiteData) {
	return sendMessage<RepositoryRequest, GenericResponse>({
		command: "reclassifySite",
		serialisedSiteData: siteData,
	})
}

export function checkSiteSeenUseCase(siteData: SerialisedSiteData) {
	return sendMessage<CheckSiteSeenRequest, CheckSiteSeenResponse>({
		command: "checkSiteSeen",
		serialisedSiteData: siteData,
	})
}
