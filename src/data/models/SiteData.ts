export enum Category {
	productive = "productive",
	procrastination = "procrastination",
}

export enum SiteSeen {
	notSeen = "notSeen",
}

export function opposite(category: Category) {
	switch (category) {
		case Category.productive:
			return Category.procrastination
		case Category.procrastination:
			return Category.productive
	}
}

export type SerialisedSiteData = string

export type SiteData = {
	title: string
	domain: string
}
