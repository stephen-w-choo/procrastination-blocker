import { Category, SiteSeen } from "../../data/models/Category"
import { GroupedKeywordData, Settings } from "../../data/models/Settings"
import { ProcrastinationScores } from "../../domain/models/ProcrastinationScore"
import { TrainedOn } from "../../domain/models/TrainedOn"

/**
 * These types are a mess and I apologise.
 * This is my first really large TypeScript project where I'm
 * leaning heavily into the structural typing system.
 * If I was to redo this, I would merge the base requests into a single type,
 * and I would have a separate error type, removing the need for the success field.
 *
 * The listeners can then be typed to a Union of the response and error types.
 *
 * May or may not refactor this in the future, but it will be an arduous task.
 */

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

export type CheckFocusModeRequest = {
	command: "checkFocusMode"
}

export type ToggleFocusModeRequest = {
	command: "toggleFocusMode"
	toggle: boolean
}

export type CheckFocusModeResponse = {
	success: boolean
	toggleStatus?: boolean
	threshold: number
}

export type ToggleFocusModeResponse = {
	success: boolean
	toggleStatus: boolean
}

export type GetSettingsRequest = {
	command: "getSettings"
}

export type SetSettingsRequest = {
	command: "setSettings"
	settings: Settings
}

export type SettingsResponse = {
	settings: Settings
}

export type GenericResponse = {
	success: boolean
	debugInfo?: string
}

export type GenericRequest = {
	command: string
}

export type ErrorResponse = {
	success: false
	error: string
}
