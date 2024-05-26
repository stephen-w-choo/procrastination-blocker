import { SiteDataRepository } from "../data/SiteDataRepository"
import { SiteData } from "../data/models/SiteData"
import NaiveBayesModel from "./NaiveBayesModel"
import { TextData } from "./models/TextData"

export class SiteClassifier {
	private siteDataRepository: SiteDataRepository
	titleModel: NaiveBayesModel
	domainModel: NaiveBayesModel
	modelsInvalid: boolean = false

	// How likely a site has to be for procrastination before we block it
	threshold: number = 0.6

	constructor(siteDataRepository: SiteDataRepository) {
		this.siteDataRepository = siteDataRepository
		this.titleModel = new NaiveBayesModel()
		this.domainModel = new NaiveBayesModel()
		this.syncModels()
	}

	syncModels() {
		/*
        Initialises/resyncs the model with the site data
        Computationally intensive, avoid calling unless necessary

        TODO: Consider saving this to disk (Chrome storage) so that it can be 
        retrieved without needing to retrain the model each time the background 
        process re-initialises. The model can be saved as JSON.
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

		// If the data is empty on either side, the model is invalid
		this.modelsInvalid = this.siteDataRepository.isDataEmpty()
		this.siteDataRepository.resetChangesSinceLastSync()
	}

	classify(site: SiteData): [combined: number, [title: number, domain: number]] | null {
		if (this.modelsInvalid === true) { 
			return null
		}
		
		// returns probability of non-productive site
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
