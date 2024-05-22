import { SiteDataRepository } from "../data/SiteDataRepository"
import { SiteData } from "../data/models/SiteData"
import NaiveBayesClassifier from "./bayesClassifier"
import { TextData } from "./models/TextData"

export class ClassifierModels {
	private siteDataRepository: SiteDataRepository
	titleModel: NaiveBayesClassifier
	domainModel: NaiveBayesClassifier

	// How likely a site has to be for procrastination before we block it
	threshold: number = 0.6

	constructor(siteDataRepository: SiteDataRepository) {
		this.siteDataRepository = siteDataRepository
		this.titleModel = new NaiveBayesClassifier()
		this.domainModel = new NaiveBayesClassifier()
		this.syncModels()
	}

	syncModels() {
		/*
        Initialises/resyncs the model with the site data
        Computationally intensive, avoid calling unless necessary

        TODO: Consider saving this to disk (Chrome storage) so that it can be 
        retrieved without needing to retrain the model each time the background 
        process re-initialises. The model can be saved as JSON.

        When retrieving the model from storage, we can do a simple length check 
        to verify that the models are synced with existing data
        */

		let trainingDataSiteTitles: TextData[] = []
		let trainingDataSiteDomains: TextData[] = []

		this.siteDataRepository.procrastinationSiteList.forEach(site => {
			trainingDataSiteTitles.push({
				text: site.title,
				class: "procrastination",
			})
			trainingDataSiteDomains.push({
				text: site.domain,
				class: "procrastination",
			})
		})

		this.siteDataRepository.productiveSiteList.forEach(site => {
			trainingDataSiteTitles.push({
				text: site.title,
				class: "productive",
			})
			trainingDataSiteDomains.push({
				text: site.domain,
				class: "productive",
			})
		})

		this.titleModel.train(trainingDataSiteTitles)
		this.domainModel.train(trainingDataSiteDomains)
	}

	classify(site: SiteData): [number, [number, number]] {
		const titleProbabilities = this.titleModel.predict(site.title)
		const domainProbabilities = this.domainModel.predict(site.domain)

		return [
			(titleProbabilities["procrastination"] +
				domainProbabilities["procrastination"]) /
				2,
			[
				titleProbabilities["procrastination"],
				domainProbabilities["procrastination"],
			],
		]
	}
}
