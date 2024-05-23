import { SiteData } from "../data/models/SiteData"
import { SiteDataRepository } from "../data/SiteDataRepository";
import { ClassifierModels } from "../domain/ClassifierModels";
import {
	ModelMetricsRequest,
	ModelMetricsResponse,
    SiteClassificationRequest,
    SiteClassificationResponse,
} from "./base/MessageTypes"
import { sendMessage } from "./base/sendMessage"
import { setListener } from "./base/setListener";

// Messages
export function requestModelMetrics(): Promise<ModelMetricsResponse> {
	return sendMessage<ModelMetricsRequest, ModelMetricsResponse>({
		command: "modelDataRequest",
	})
}

export function requestSiteClassification(
    siteData: SiteData
): Promise<SiteClassificationResponse> {
    return sendMessage<SiteClassificationRequest, SiteClassificationResponse>({
        command: "checkSiteStatus",
        serialisedSiteData: JSON.stringify(siteData),
    });
}
