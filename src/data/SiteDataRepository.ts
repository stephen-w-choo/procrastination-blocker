import { SiteData, SerialisedSiteData, Category } from "./models/SiteData"

function serialise(siteData: SiteData): SerialisedSiteData {
    return JSON.stringify(siteData)
}

export class SiteDataRepository {
    procrastinationSites: Set<SerialisedSiteData>
    productiveSites: Set<SerialisedSiteData>

    constructor() {
        // TODO: Load data from Chrome storage
        this.procrastinationSites = new Set()
        this.productiveSites = new Set()
    }

    syncListAndSet() {
        // TODO - consider keeping both set and list in memory to reduce conversions
        // In hindsight - this is only really necessary when the model needs it.
        // If we reduce explicit model resyncs, we shouldn't be too worried about this
    }

    
    public get procrastinationSiteList(): Array<SiteData> {
        // Look into caching this value - this is a O(n) operation each time
        return this.deserialiseData(this.procrastinationSites)
    }
    
    public get productiveSiteList(): Array<SiteData> {
        // Look into caching this value - this is a O(n) operation each time
        return this.deserialiseData(this.productiveSites)
    }
    
    private deserialiseData(serialised: Set<SerialisedSiteData>): Array<SiteData> {
        // TODO: can't convert Set to Array directly? This seems inefficient
        const res: SiteData[] = []
        serialised.forEach((serialisedSiteData) => {
            res.push(JSON.parse(serialisedSiteData))
        })
        return res
    }

    addSite(site: SiteData, category: Category) {
        if (category == Category.productive) {
            this.productiveSites.add(serialise(site))
        } else {
            this.procrastinationSites.add(serialise(site))
        }
    }

    removeSite(site: SiteData, category: Category){
        if (category == Category.productive) {
            this.productiveSites.delete(serialise(site))
        } else {
            this.procrastinationSites.delete(serialise(site))
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
}