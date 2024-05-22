import { TextClass, TextData, TextSequence, Token } from "./models/TextData"

// Special nonexistent token for Laplace smoothing and to handle cases where the model
// encounters words it hasn't seen before
const NON_EXISTENT_TOKEN = "///nonexistent///"

// TODO: Current implementation requires retraining on the whole set with additions
// Naive Bayes can actually be updated incrementally - potentially look into this

export default class NaiveBayesClassifier {
	// holds all the unique tokens in the training data
	private vocabulary: Set<Token> = new Set()

	classProbabilities: Record<TextClass, number> = {}
	tokenProbabilities: Record<TextClass, Record<Token, number>> = {}

	public train(data: TextData[]): void {
		/*
        Processes the training data to build up the vocabulary, 
        classProbabilities, and tokenProbabilities. Does it over two passes.
        */

		// first pass to build up the frequencies
		this.buildUpFrequencies(data)
		// second pass to convert frequencies to probabilities
		this.calculateProbabilities(data)
	}

	public predict(text: TextSequence): Record<string, number> {
		/*
        Takes a string and categorises it based on the model
        */

		// Tokenise then run naive Bayes

		const tokens = this.tokenise(text)
		let probabilityTable: Record<string, number> = {}

		// Bayes - P(a | b) = b * P(b | a) / a
		// Treat each word as a possible trait, then calculate the probability of
		// the class given all traits are present

		Object.keys(this.classProbabilities).forEach(textClass => {
			// Start with the base probability of a given class
			let probability = this.classProbabilities[textClass]

			// Multiply by the probability of each token given the class
			tokens.forEach(token => {
				if (token in this.tokenProbabilities[textClass]) {
					probability *= this.tokenProbabilities[textClass][token]
				} else {
					probability *= this.tokenProbabilities[textClass][NON_EXISTENT_TOKEN]
				}
			})

			// Add to probability table
			probabilityTable[textClass] = probability
		})

		this.normalise(probabilityTable)

		return probabilityTable
	}

	public tokenise(text: TextSequence): Token[] {
		/*
        Simple tokeniser that splits the text into words and removes punctuation.
        Unsure if this is efficient - that looks like a lot of copies and memory
        TODO - look into more efficient tokenisation
        */
		return text
			.toLowerCase()
			.replace(/[^\w\s]|_/g, "")
			.replace(/\s+/g, " ")
			.trim()
			.split(" ")
	}

	private normalise(probabilityTable: Record<string, number>) {
		// Normalise probabilities, does it in place as Objects are passed by reference
		const totalProbability = Object.values(probabilityTable).reduce(
			(accum, curr) => accum + curr
		)
		const normaliser = 1 / totalProbability
		Object.keys(probabilityTable).forEach(textClass => {
			probabilityTable[textClass] *= normaliser
		})
	}

	private setUpDataStructure(textDataItem: TextData): void {
		if (!this.classProbabilities[textDataItem.class]) {
			this.classProbabilities[textDataItem.class] = 0
		}
		if (!this.tokenProbabilities[textDataItem.class]) {
			this.tokenProbabilities[textDataItem.class] = {}
		}
	}

	private buildUpFrequencies(data: TextData[]): void {
		data.forEach(textDataItem => {
			const tokens = this.tokenise(textDataItem.text)
			tokens.forEach(token => this.vocabulary.add(token))
			this.setUpDataStructure(textDataItem)

			// Increment the class count
			this.classProbabilities[textDataItem.class]++

			// Increment the token count for a given class
			tokens.forEach(token => {
				if (!this.tokenProbabilities[textDataItem.class][token]) {
					this.tokenProbabilities[textDataItem.class][token] = 0
				}
				this.tokenProbabilities[textDataItem.class][token]++
			})
		})
	}

	private calculateProbabilities(data: TextData[]): void {
		// Class probabilities
		const totalDocuments = data.length
		for (const textClass in this.classProbabilities) {
			this.classProbabilities[textClass] /= totalDocuments
		}

		// Token probabilities with Laplace smoothing
		for (const textClass in this.tokenProbabilities) {
			// Total tokens in a class + 1 for Laplace smoothing
			// Plus 1 extra for the case where a token doesn't exist
			const totalTokensInClass =
				Object.values(this.tokenProbabilities[textClass]).reduce(
					(acc, val) => acc + val,
					0
				) + 1

			for (const token in this.tokenProbabilities[textClass]) {
				this.tokenProbabilities[textClass][token] =
					(this.tokenProbabilities[textClass][token] + 1) / totalTokensInClass
			}

			// Special non-existent token
			this.tokenProbabilities[textClass][NON_EXISTENT_TOKEN] =
				1 / totalTokensInClass
		}
	}
}
