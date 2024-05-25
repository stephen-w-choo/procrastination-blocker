export enum Category {
	productive = "productive",
	procrastination = "procrastination",
}

export enum SiteSeen {
	notSeen = "notSeen",
}

export type SerialisedSiteData = string

export type SiteData = {
	title: string
	domain: string
}
