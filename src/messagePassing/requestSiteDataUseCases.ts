import { SiteData } from "../data/models/SiteData"
import { SiteDataRequest, SiteDataResponse } from "./base/MessageTypes"
import { sendMessageActiveTab } from "./base/sendMessage"
import { setListener } from "./base/setListener"

export function requestSiteDataUseCase(): Promise<SiteDataResponse> {
	return sendMessageActiveTab<SiteDataRequest, SiteDataResponse>({
		command: "siteDataRequest",
	})
}

export function setSiteDataRequestListener(siteData: SiteData) {
	const serialisedSiteData = JSON.stringify(siteData)
	setListener<SiteDataRequest, SiteDataResponse>(
		(request, _, sendResponse) => {
			if (request.command === "siteDataRequest") {
				sendResponse({serialisedSiteData})
			}
		}
	)
}