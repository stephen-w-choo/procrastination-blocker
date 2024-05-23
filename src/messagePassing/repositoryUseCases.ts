import { Category, SerialisedSiteData } from "../data/models/SiteData"
import {
	RepositoryRequest,
	GenericResponse,
	SiteClassificationResponse,
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

export function removeSiteUseCase(siteType: Category, siteData: SerialisedSiteData) {
	return sendMessage<RepositoryRequest, SiteClassificationResponse>({
		command: "removeSite",
		serialisedSiteData: siteData,
		type: siteType,
	})
}
