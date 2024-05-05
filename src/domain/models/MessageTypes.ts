export type BackgroundRequest = {
	command: "checkSiteStatus" | "addSite" | "removeSite"
	serialisedSiteData: string
}

export type BackgroundResponse = {
	isProcrastinationSite?: number
	success: boolean
	debugInfo?: string
}
