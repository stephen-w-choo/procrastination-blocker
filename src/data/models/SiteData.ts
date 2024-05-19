export enum Category {
	productive,
	procrastination,
}

export function catStr(category: Category) {
	switch (category) {
		case Category.productive:
			return "productive"
		case Category.procrastination:
			return "procrastination"
	}
}

export type SerialisedSiteData = string

export type SiteData = {
	title: string
	domain: string
}
