import { SiteDataRequest, SiteDataResponse } from "./base/MessageTypes"
import { sendMessageActiveTab } from "./base/sendMessage"

export function requestSiteDataUseCase(): Promise<SiteDataResponse> {
	return sendMessageActiveTab<SiteDataRequest, SiteDataResponse>({
		command: "siteDataRequest",
	})
}
