import { Category, SerialisedSiteData, SiteData } from "./models/SiteData"

const SITE_STORAGE_PREFIX = "$SITEDATA"

export function serialise(siteData: SiteData): SerialisedSiteData {
	return JSON.stringify(siteData)
}

export function serialiseListData(
	deserialisedList: Array<SiteData>
): Set<SerialisedSiteData> {
	return new Set(deserialisedList.map(siteData => JSON.stringify(siteData)))
}

export function deserialiseSetData(
	serialised: Set<SerialisedSiteData>
): Array<SiteData> {
	// TODO: can't convert Set to Array directly? This seems inefficient
	const res: SiteData[] = []
	serialised.forEach(serialisedSiteData => {
		res.push(JSON.parse(serialisedSiteData))
	})
	return res
}

export class SiteDataRepository {
	procrastinationSites: Set<SerialisedSiteData>
	productiveSites: Set<SerialisedSiteData>

	constructor() {
		// TODO: Load data from Chrome storage
		this.procrastinationSites = new Set()
		this.productiveSites = new Set()
		this.loadStoredSites()
	}

	hasSite(site: SerialisedSiteData) {
		return (
			this.procrastinationSites.has(site) ||
			this.productiveSites.has(site)
		)
	}

	private loadStoredSites() {
		chrome.storage.local.get(null, items => {
			for (const key in items) {
				if (!key.startsWith(SITE_STORAGE_PREFIX)) {
					continue
				}
				// remove the prefix then split the category and value
				const [category, value] = key
					.slice(SITE_STORAGE_PREFIX.length)
					.split("///")

				if (category == "procrastination") {
					this.procrastinationSites.add(value)
				} else if (category == "productive") {
					this.productiveSites.add(value)
				}
			}
		})
	}

	public get procrastinationSiteList(): Array<SiteData> {
		// Look into caching this value - this is a O(n) operation each time
		return deserialiseSetData(this.procrastinationSites)
	}

	public get productiveSiteList(): Array<SiteData> {
		// Look into caching this value - this is a O(n) operation each time
		return deserialiseSetData(this.productiveSites)
	}

	addSite(site: SiteData, category: Category) {
		if (category == Category.productive) {
			this.productiveSites.add(serialise(site))
			this.addToLocalStorageSet("productive", serialise(site))
		} else {
			this.procrastinationSites.add(serialise(site))
			this.addToLocalStorageSet("procrastination", serialise(site))
		}
	}

	removeSite(site: SiteData, category: Category) {
		if (category == Category.productive) {
			this.productiveSites.delete(serialise(site))
			this.removeFromLocalStorageSet("productive", serialise(site))
		} else {
			this.procrastinationSites.delete(serialise(site))
			this.removeFromLocalStorageSet("procrastination", serialise(site))
		}
	}

	reclassifySite(site: SiteData, currentCategory: Category) {
		// feels like there's a smarter way of doing this
		if (currentCategory == Category.productive) {
			this.removeSite(site, Category.productive)
			this.addSite(site, Category.procrastination)
		} else {
			this.removeSite(site, Category.procrastination)
			this.addSite(site, Category.productive)
		}
	}

	private addToLocalStorageSet(category: string, value: SerialisedSiteData) {
		const key = `${SITE_STORAGE_PREFIX}${category}///${value}`
		chrome.storage.local.set({ [key]: true })
	}

	private removeFromLocalStorageSet(
		category: string,
		value: SerialisedSiteData
	) {
		const key = `${SITE_STORAGE_PREFIX}${category}///${value}`
		chrome.storage.local.remove(key)
	}
}
