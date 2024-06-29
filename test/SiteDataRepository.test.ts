import { beforeEach, describe, expect, test } from "@jest/globals"
import { SiteDataRepository, serialiseListData } from "../src/data/SiteDataRepository"
import { SiteData } from "../src/data/models/SiteData"
import { Category } from "../src/data/models/Category"

describe("Bayes Classifier", () => {
	let siteDataRepository: SiteDataRepository
	const productiveSiteData: SiteData[] = [
		{
			title: "list of text classification models - Google Search",
			domain: "google",
		},
		{
			title: "text classification models - Google Search",
			domain: "google",
		},
		{
			title: "What is Text Classification? - Hugging Face",
			domain: "huggingface",
		},
	]

	const procrastinationSiteData: SiteData[] = [
		{
			title: "Your Amazon Prime Membership",
			domain: "amazon",
		},
		{
			title: "Amazon.com.au Shopping Cart",
			domain: "amazon",
		},
		{
			title: "Amazon.com.au : ear tips",
			domain: "amazon",
		},
	]

	beforeEach(() => {
		siteDataRepository = new SiteDataRepository()
		siteDataRepository.procrastinationSites = serialiseListData(
			procrastinationSiteData
		)
		siteDataRepository.productiveSites = serialiseListData(productiveSiteData)
	})

	test("Adding an existing SiteData entry should do nothing - it should be stored as a set", () => {
		// Given
		const duplicateEntry = {
			title: "Your Amazon Prime Membership",
			domain: "amazon",
		}
		const previousLength = siteDataRepository.procrastinationSiteList.length

		// When
		siteDataRepository.addSite(duplicateEntry, Category.procrastination)

		expect(siteDataRepository.procrastinationSiteList.length).toBe(previousLength)
	})

	test("Reclassifying an entry should adjust the lists appropriately", () => {
		// Given
		const procrastinationEntry = {
			title: "Your Amazon Prime Membership",
			domain: "amazon",
		}
		const previousProcrastinationLength =
			siteDataRepository.procrastinationSiteList.length
		const previousProductiveLength = siteDataRepository.productiveSiteList.length

		// When
		siteDataRepository.reclassifySite(procrastinationEntry)

		// Then
		expect(siteDataRepository.procrastinationSiteList.length).toBe(
			previousProcrastinationLength - 1
		)
		expect(siteDataRepository.productiveSiteList.length).toBe(
			previousProductiveLength + 1
		)
	})
})
