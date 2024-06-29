import { Category, SiteSeen } from "../../data/models/Category"
import { ProcrastinationScores } from "../../domain/models/ProcrastinationScore"
import { TrainedOn } from "../../domain/models/TrainedOn"

// TODO - experiment and see if we can use enums for the commands?
// Not sure if it will get propelry serialised into a unique string when parsed

// Content/popup to background script
export type SiteClassificationRequest = {
	command: "checkSiteStatus"
	serialisedSiteData: string
}

export type SiteClassificationResponse = {
	procrastinationScore?: ProcrastinationScores
	trainedOn?: TrainedOn
	success: boolean
	modelUntrained?: boolean
}

export type RepositoryRequest = {
	command: "addSite" | "removeSite" | "reclassifySite"
	serialisedSiteData: string
	type?: Category
}

export type CheckSiteSeenRequest = {
	command: "checkSiteSeen"
	serialisedSiteData: string
}

export type CheckSiteSeenResponse = {
	seenBefore: Category | SiteSeen
}

export type ModelMetricsRequest = {
	command: "modelDataRequest"
}

export type ModelMetricsResponse = {
	procrastination: number
	productive: number
	changesSinceLastSync: number
}

export type ModelSyncRequest = {
	command: "syncModel"
}

export type ModelSyncResponse = {
	success: boolean
}

export type SiteDataRequest = {
	command: "siteDataRequest"
}

export type SiteDataResponse = {
	serialisedSiteData: string
}

export type ToggleFocusModeRequest = {
	command: "toggleFocusMode"
	toggle: boolean
}

export type FocusModeResponse = {
	success: boolean
	toggleStatus?: boolean
}

export type CheckFocusModeRequest = {
	command: "checkFocusMode"
}

export type GenericResponse = {
	success: boolean
	debugInfo?: string
}

export type GenericRequest = {
	command: string
}
