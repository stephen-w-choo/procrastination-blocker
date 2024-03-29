import { describe, beforeEach, expect, test } from '@jest/globals'
import { SiteDataRepository, serialiseListData } from '../src/data/SiteDataRepository'
import { Category, SiteData } from '../src/data/models/SiteData'
import { ClassifierModels } from '../src/domain/ClassifierModels'

describe("Bayes Classifier", () => {
    let siteDataRepository: SiteDataRepository

    let classifierModels: ClassifierModels

    const productiveSiteData: SiteData[] = [
        {
            "title": "list of text classification models - Google Search",
            "domain": "google"
        },
        {
            "title": "text classification models - Google Search",
            "domain": "google"
        },
        {
            "title": "What is Text Classification? - Hugging Face",
            "domain": "huggingface"
        }
    ]

    const procrastinationSiteData: SiteData[] = [
        {
            "title":"Your Amazon Prime Membership",
            "domain":"amazon"
        },
        {
            "title":"Amazon.com.au Shopping Cart",
            "domain":"amazon"
        },
        {
            "title": "Amazon.com.au : ear tips",
            "domain": "amazon"
        },
    ]

    beforeEach(() => {
        siteDataRepository = new SiteDataRepository()
        siteDataRepository.procrastinationSites = serialiseListData(procrastinationSiteData)
        siteDataRepository.productiveSites = serialiseListData(productiveSiteData)

        classifierModels = new ClassifierModels(siteDataRepository)
    })
    
    test("Should appropriately classify a given SiteData entry", () => {
        // Given
        const procrastinationSite = {
            "title":"Shopping Cart - purchasing non-productive item",
            "domain":"amazon"
        }
        
        // When
        const isProcrastinationSite = classifierModels.classify(procrastinationSite)

        expect(isProcrastinationSite).toBe(true)
    })
})
