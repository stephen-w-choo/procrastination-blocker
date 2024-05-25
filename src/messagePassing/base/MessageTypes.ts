import { Category, SiteSeen } from "../../data/models/SiteData"

// TODO - experiment and see if we can use enums for the commands?
// Not sure if it will get propelry serialised into a unique string when parsed

// Content/popup to background script
export type SiteClassificationRequest = {
	command: "checkSiteStatus"
	serialisedSiteData: string
}

export type RepositoryRequest = {
	command: "addSite" | "removeSite" | "reclassifySite"
	serialisedSiteData: string
	type?: Category
}

export type ModelMetricsRequest = {
	command: "modelDataRequest"
}

export type ModelMetricsResponse = {
	procrastination: number
	productive: number
}

// Background script to content script
export type SiteClassificationResponse = {
	isProcrastinationSite?: number
	seenBefore?: Category | SiteSeen
	success: boolean
	debugInfo?: string
}

export type SiteDataRequest = {
	command: "siteDataRequest"
}

export type SiteDataResponse = {
	serialisedSiteData: string
}

export type GenericResponse = {
	success: boolean
	debugInfo?: string
}

export type GenericRequest = {
	command: string
}
