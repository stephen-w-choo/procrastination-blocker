import { TextClass, TextData, TextSequence, Token } from "./models/TextData"

// Special nonexistent token for Laplace smoothing and to handle cases where the model
// encounters words it hasn't seen before
const NON_EXISTENT_TOKEN = "///nonexistent///"

const ALPHA = 1 // modifiable Alpha for Laplace smoothing

const DECAY_RATE = 1.5 // modifiable decay rate for unseen tokens

// TODO: Current implementation requires retraining on the whole set with additions
// The frequency buildup step can actually be updated incrementally
// However, the probabilities will still need to be recalculated, which is where
// the bulk of the computational cost is

export default class NaiveBayesModel {
	// holds all the unique tokens in the training data

	classProbabilities: Record<TextClass, number> = {}
	classTokenCounts: Record<TextClass, number> = {}
	tokenProbabilities: Record<TextClass, Record<Token, number>> = {}
	vocabulary: Set<Token> = new Set()
	tokenise: (text: TextSequence) => Token[]

	constructor(tokeniser?: (text: TextSequence) => Token[]) {
		if (!tokeniser) {
			this.tokenise = this.defaultTokeniser
		} else {
			this.tokenise = tokeniser
		}
	}

	public train(data: TextData[]): void {
		/*
        Processes the training data to build up the vocabulary, 
        classProbabilities, and tokenProbabilities. Does it over two passes.
        */
		if (data.length === 0) {
			return
		}

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
		// Adjust for smaller token counts
		let nonExistentTokenCount = 0

		Object.keys(this.classProbabilities).forEach(textClass => {
			// Start with the base probability of a given class
			let probability = this.classProbabilities[textClass]

			// Multiply by the probability of each token given the class
			tokens.forEach(token => {
				if (token in this.tokenProbabilities[textClass]) {
					probability *= this.tokenProbabilities[textClass][token]
				} else {
					probability *= this.tokenProbabilities[textClass][NON_EXISTENT_TOKEN]
					nonExistentTokenCount++
				}
			})

			// Add to probability table
			probabilityTable[textClass] = probability
		})

		this.normalise(probabilityTable, nonExistentTokenCount)

		return probabilityTable
	}

	public defaultTokeniser(text: TextSequence): Token[] {
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

	private normalise(
		probabilityTable: Record<string, number>,
		unseenTokenCount: number
	) {
		// Normalise probabilities, does it in place as Objects are passed by reference
		const totalProbability = Object.values(probabilityTable).reduce(
			(accum, curr) => accum + curr
		)
		const normaliser = 1 / totalProbability
		Object.keys(probabilityTable).forEach(textClass => {
			probabilityTable[textClass] *= normaliser
			probabilityTable[textClass] = this.decayTowardsHalf(
				probabilityTable[textClass],
				unseenTokenCount
			)
		})
	}

	private decayTowardsHalf(probability: number, magnitude: number): number {
		magnitude *= 0.2

		return 0.5 + (probability - 0.5) * Math.pow(DECAY_RATE, -magnitude)
	}

	private setUpDataStructure(textDataItem: TextData): void {
		if (!this.classProbabilities[textDataItem.class]) {
			this.classProbabilities[textDataItem.class] = 0
		}
		if (!this.classTokenCounts[textDataItem.class]) {
			this.classTokenCounts[textDataItem.class] = 0
		}
		if (!this.tokenProbabilities[textDataItem.class]) {
			this.tokenProbabilities[textDataItem.class] = {}
		}
	}

	private buildUpFrequencies(data: TextData[]): void {
		data.forEach(textDataItem => {
			const tokens = this.tokenise(textDataItem.text)
			this.setUpDataStructure(textDataItem)

			// Increment the class count
			this.classProbabilities[textDataItem.class]++
			this.classTokenCounts[textDataItem.class] += tokens.length

			// Increment the token count for a given class
			tokens.forEach(token => {
				this.vocabulary.add(token)

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

		const totalTokens = Object.values(this.classTokenCounts).reduce(
			(accum, curr) => accum + curr
		)

		// Token probabilities with Laplace smoothing
		for (const textClass in this.tokenProbabilities) {
			// Total tokens in a class + 1 for Laplace smoothing
			// Plus 1 extra for the case where a token doesn't exist
			const totalTokensInClass = this.classTokenCounts[textClass]

			for (const token in this.tokenProbabilities[textClass]) {
				this.tokenProbabilities[textClass][token] =
					(this.tokenProbabilities[textClass][token] + ALPHA) /
					(totalTokensInClass + this.vocabulary.size)
			}

			// Special non-existent token
			// naive Bayes modification - we divide by total tokens instead of total tokens in class
			// this is because we expect our corpus to rarely be even on both sides
			// this means that with the conventional method, non-existent tokens would have
			// a heavy skew towards the class with less tokens
			this.tokenProbabilities[textClass][NON_EXISTENT_TOKEN] = ALPHA / totalTokens
		}
	}
}
