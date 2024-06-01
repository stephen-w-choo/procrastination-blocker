import { SiteData } from "../data/models/SiteData"
import {
	GenericResponse,
	ModelMetricsRequest,
	ModelMetricsResponse,
	ModelSyncRequest,
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
	return sendMessage<ModelSyncRequest, GenericResponse>({ command: "syncModel" })
}
