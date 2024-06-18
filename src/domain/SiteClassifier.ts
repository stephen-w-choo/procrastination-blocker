// import { fromUrl, parseDomain, ParseResultType } from "parse-domain"
import { SiteData } from "../data/models/SiteData"
import { SiteDataRepository } from "../data/SiteDataRepository"
import { ProcrastinationScores } from "./models/ProcrastinationScore"
import { TextData } from "./models/TextData"
import { TrainedOn } from "./models/TrainedOn"
import NaiveBayesModel from "./NaiveBayesModel"

export class SiteClassifier {
	private siteDataRepository: SiteDataRepository
	titleModel: NaiveBayesModel
	domainModel: NaiveBayesModel
	modelsInvalid: boolean = false
	trainedOn: {
		procrastination: number
		productive: number
	} = {
		procrastination: 0,
		productive: 0,
	}

	// How likely a site has to be for procrastination before we block it
	threshold: number = 0.6

	constructor(siteDataRepository: SiteDataRepository) {
		this.siteDataRepository = siteDataRepository
		this.titleModel = new NaiveBayesModel() // title model will use the default tokeniser
		this.domainModel = new NaiveBayesModel(this.domainTokeniser)
		this.syncModels()
	}

	domainTokeniser(url: string): string[] {
		try {
			const parsedUrl = new URL(url)
			return [parsedUrl.hostname]
		} catch {
			console.log("Failed to parse the following url", url)
			return []
		}
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

		this.trainedOn = {
			procrastination: this.siteDataRepository.procrastinationSiteList.length,
			productive: this.siteDataRepository.productiveSiteList.length,
		}

		// If the data is empty on either side, the model is invalid
		this.modelsInvalid =
			this.trainedOn.procrastination === 0 || this.trainedOn.productive === 0
		this.siteDataRepository.resetChangesSinceLastSync()
	}

	classify(site: SiteData): {
		procrastinationScore: ProcrastinationScores
		trainedOn: TrainedOn
	} | null {
		if (this.modelsInvalid === true) {
			return null
		}

		// returns probability of non-productive site
		const titleProbabilities = this.titleModel.predict(site.title)
		const domainProbabilities = this.domainModel.predict(site.domain)

		return {
			procrastinationScore: {
				title: titleProbabilities["procrastination"],
				domain: domainProbabilities["procrastination"],
			},
			trainedOn: {
				...this.trainedOn,
				changesSinceLastSync: this.siteDataRepository.changesSinceLastSync,
			},
		}
	}
}
