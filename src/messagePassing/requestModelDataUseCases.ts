import { SiteData } from "../data/models/SiteData"
import {
	ModelDataRequest,
	ModelDataResponse,
	SiteStatusRequest,
	SiteStatusResponse,
} from "./base/MessageTypes"
import { sendMessage } from "./base/sendMessage"

export function requestModelDataUseCase(): Promise<ModelDataResponse> {
	return sendMessage<ModelDataRequest, ModelDataResponse>({
		command: "modelDataRequest",
	})
}

export function requestSiteStatusUseCase(siteData: SiteData): Promise<SiteStatusResponse> {
	return sendMessage<SiteStatusRequest, SiteStatusResponse>({
		command: "checkSiteStatus",
		serialisedSiteData: JSON.stringify(siteData),
	})
}
