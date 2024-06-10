import { beforeEach, describe, expect, test } from "@jest/globals"
import { SiteDataRepository } from "../src/data/SiteDataRepository"
import { SiteData } from "../src/data/models/SiteData"
import { SiteClassifier } from "../src/domain/SiteClassifier"

describe("Site Classifier", () => {
	let siteDataRepository: jest.Mocked<SiteDataRepository>
	let classifierModels: SiteClassifier

	const productiveSiteData: SiteData[] = [
		{
			title: "list of text classification models - Google Search",
			domain: "https://www.google.com/search?q=list+of+text+classification+models&oq=list+of+text+classification+models&gs_lcrp=EgZjaHJvbWUyBggAEEUYOdIBCDExMDFqMGo3qAIAsAIA&sourceid=chrome&ie=UTF-8",
		},
		{
			title: "text classification models - Google Search",
			domain: "https://www.google.com/search?q=text+classification+models&sca_esv=33d67212b85fdaf4&sca_upv=1&sxsrf=ADLYWIJjE6voYYcPY-y6flI6PwW_eVPwPw%3A1717915366415&ei=5k5lZsiGGbnO2roP66ae8Q4&ved=0ahUKEwjIka259c2GAxU5p1YBHWuTJ-4Q4dUDCBA&uact=5&oq=text+classification+models&gs_lp=Egxnd3Mtd2l6LXNlcnAiGnRleHQgY2xhc3NpZmljYXRpb24gbW9kZWxzMgsQABiABBiRAhiKBTIGEAAYBxgeMgYQABgHGB4yBhAAGAcYHjIGEAAYBxgeMgYQABgHGB4yBhAAGAcYHjIGEAAYBxgeMgYQABgHGB4yBhAAGAcYHkidAlAAWABwAHgBkAEAmAH6AaAB-gGqAQMyLTG4AQPIAQD4AQGYAgGgAv8BmAMAkgcDMi0xoAfxBg&sclient=gws-wiz-serp",
		},
		{
			title: "What is Text Classification? - Hugging Face",
			domain: "https://huggingface.co/tasks/text-classification",
		},
	]

	const procrastinationSiteData: SiteData[] = [
		{
			title: "Your Amazon Prime Membership",
			domain: "https://www.amazon.com.au/prime",
		},
		{
			title: "Amazon.com.au Shopping Cart",
			domain: "https://www.amazon.com.au/gp/cart/view.html?ref_=nav_cart",
		},
		{
			title: "Amazon.com.au : ear tips",
			domain: "https://www.amazon.com.au/s?k=ear+tips&crid=3Q9KODGRRQGZ7&sprefix=ear+tip%2Caps%2C323&ref=nb_sb_noss_1",
		},
	]

	beforeEach(() => {
		siteDataRepository = {
			get procrastinationSiteList() {
				return procrastinationSiteData
			},
			get productiveSiteList() {
				return productiveSiteData
			},
			resetChangesSinceLastSync() {
				// Do nothing
			},
		} as jest.Mocked<SiteDataRepository>

		classifierModels = new SiteClassifier(siteDataRepository)
	})

	test("On initialisation, should create two separate Naive Bayes models with different tokenisers", () => {
		// When
		expect(classifierModels.titleModel.tokenise).toBe(
			classifierModels.titleModel.defaultTokeniser
		)
		expect(classifierModels.domainModel.tokenise).toBe(
			classifierModels.domainTokeniser
		)
	})

	test("Domain tokeniser should extract just the domain from a URL", () => {
		// When
		const domain = classifierModels.domainTokeniser(
			"https://www.amazon.com.au/gp/cart/view.html?ref_=nav_cart"
		)

		// Then
		expect(domain).toEqual(["amazon"])
	})

	test("Should appropriately classify a given SiteData entry", () => {
		// Given
		const procrastinationSite = {
			title: "Shopping Cart - purchasing non-productive item",
			domain: "https://www.amazon.com.au/gp/cart/view.html?ref_=nav_cart",
		}

		// When
		const isProcrastinationSite = classifierModels.classify(procrastinationSite)

		// expect a high procrastination score above 0.5
		expect(isProcrastinationSite?.procrastinationScore.title).toBeGreaterThan(0.5)
		expect(isProcrastinationSite?.procrastinationScore.domain).toBeGreaterThan(0.5)
	})
})
