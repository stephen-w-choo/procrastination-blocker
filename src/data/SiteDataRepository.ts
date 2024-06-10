import { Category, SerialisedSiteData, SiteData, SiteSeen } from "./models/SiteData"

const SITE_STORAGE_PREFIX = "$SITEDATA"

export function serialise(siteData: SiteData): SerialisedSiteData {
	return JSON.stringify(siteData)
}

export function serialiseListData(
	deserialisedList: Array<SiteData>
): Set<SerialisedSiteData> {
	return new Set(deserialisedList.map(siteData => JSON.stringify(siteData)))
}

export function deserialiseSetData(serialised: Set<SerialisedSiteData>): Array<SiteData> {
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
	changesSinceLastSync = 0

	constructor() {
		// TODO: Load data from Chrome storage
		this.procrastinationSites = new Set()
		this.productiveSites = new Set()
		this.loadStoredSites()
	}

	hasSite(site: SerialisedSiteData): Category | SiteSeen {
		if (this.procrastinationSites.has(site)) {
			return Category.procrastination
		}
		if (this.productiveSites.has(site)) {
			return Category.productive
		}
		return SiteSeen.notSeen
	}

	resetChangesSinceLastSync() {
		this.changesSinceLastSync = 0
	}

	private loadStoredSites() {
		chrome.storage.local.get(null, items => {
			console.log(items)

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
		switch (category) {
			case Category.productive:
				this.productiveSites.add(serialise(site))
				this.addToLocalStorageSet("productive", serialise(site))
				break
			case Category.procrastination:
				this.procrastinationSites.add(serialise(site))
				this.addToLocalStorageSet("procrastination", serialise(site))
				break
		}
		this.changesSinceLastSync++
	}

	removeSite(site: SiteData) {
		const category = this.hasSite(serialise(site))

		if (category == SiteSeen.notSeen) return

		switch (category) {
			case Category.productive:
				this.productiveSites.delete(serialise(site))
				this.removeFromLocalStorageSet("productive", serialise(site))
				break
			case Category.procrastination:
				this.procrastinationSites.delete(serialise(site))
				this.removeFromLocalStorageSet("procrastination", serialise(site))
				break
		}

		this.changesSinceLastSync++
	}

	reclassifySite(site: SiteData) {
		const category = this.hasSite(serialise(site))

		switch (category) {
			case SiteSeen.notSeen:
				break
			case Category.productive:
				this.removeSite(site)
				this.addSite(site, Category.procrastination)
				this.changesSinceLastSync--
				break
			case Category.procrastination:
				this.removeSite(site)
				this.addSite(site, Category.productive)
				this.changesSinceLastSync--
				break
		}
	}

	private addToLocalStorageSet(category: string, value: SerialisedSiteData) {
		const key = `${SITE_STORAGE_PREFIX}${category}///${value}`
		chrome.storage.local.set({ [key]: true })
	}

	private removeFromLocalStorageSet(category: string, value: SerialisedSiteData) {
		const key = `${SITE_STORAGE_PREFIX}${category}///${value}`
		chrome.storage.local.remove(key)
	}
}
