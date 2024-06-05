import { SiteData } from "../data/models/SiteData"
import {
	ModelMetricsRequest,
	ModelMetricsResponse,
	ModelSyncRequest,
	ModelSyncResponse,
	SiteClassificationRequest,
	SiteClassificationResponse,
} from "./base/MessageTypes"
import { sendMessage } from "./base/sendMessage"

// Messages
export function requestModelMetricsUseCase(): Promise<ModelMetricsResponse> {
	return sendMessage<ModelMetricsRequest, ModelMetricsResponse>({
		command: "modelDataRequest",
	})
}

export function requestSiteClassificationUseCase(
	siteData: SiteData
): Promise<SiteClassificationResponse> {
	return sendMessage<SiteClassificationRequest, SiteClassificationResponse>({
		command: "checkSiteStatus",
		serialisedSiteData: JSON.stringify(siteData),
	})
}

export function requestModelSyncUseCase() {
	return sendMessage<ModelSyncRequest, ModelSyncResponse>({ command: "syncModel" })
}
