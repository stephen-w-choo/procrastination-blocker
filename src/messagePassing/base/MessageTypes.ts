import { Category } from "../../data/models/SiteData"

// TODO - experiment and see if we can use enums for the commands?
// Not sure if it will get propelry serialised into a unique string when parsed

// Content/popup to background script
export type SiteStatusRequest = {
	command: "checkSiteStatus"
	serialisedSiteData: string
}

export type ClassificationRequest = {
	command: "addSite" | "removeSite" | "reclassifySite"
	serialisedSiteData: string
	type: Category
}

export type ModelDataRequest = {
	command: "modelDataRequest"
}

export type ModelDataResponse = {
	procrastination: number
	productive: number
}

// Background script to content script
export type SiteStatusResponse = {
	isProcrastinationSite?: number
	seenBefore?: boolean
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
	debugInfo?: String
}

export type GenericRequest = {
	command: string
}