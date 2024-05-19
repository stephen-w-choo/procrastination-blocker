import { beforeEach, describe, expect, test } from "@jest/globals"
import NaiveBayesClassifier from "../src/domain/bayesClassifier"
import { TextData } from "../src/domain/models/TextData"

describe("Bayes Classifier", () => {
	let classifier: NaiveBayesClassifier
	const trainingData: TextData[] = [
		{ text: "I love this product", class: "positive" },
		{ text: "Absolutely great experience", class: "positive" },
		{ text: "Happy with the results", class: "positive" },
		{ text: "This is amazing", class: "positive" },
		{ text: "Very satisfied", class: "positive" },
		{ text: "Not good at all", class: "negative" },
		{ text: "Really disappointed", class: "negative" },
		{ text: "Could be better", class: "negative" },
		{ text: "I am unhappy with this", class: "negative" },
		{ text: "A terrible experience", class: "negative" },
	]

	beforeEach(() => {
		classifier = new NaiveBayesClassifier()
		classifier.train(trainingData)
	})

	test("Tokenise should return an array of tokens", () => {
		// When
		const tokens = classifier.tokenise("This is a test")

		// Then
		expect(tokens).toEqual(["this", "is", "a", "test"])
	})

	test("Classifier should return normalised probabilities that add to one", () => {
		// Given
		const EPSILON = 0.001

		// When
		const table = classifier.predict("I absolutely love this product")
		const totalProbability = Object.values(table).reduce((accum, curr) => accum + curr)

		// Then
		expect(Math.abs(totalProbability - 1)).toBeLessThan(EPSILON)
	})

	test("Classifier should predict correctly based on training data", () => {
		expect(classifier.predict("I absolutely love this product")["positive"]).toBeGreaterThan(
			0.5
		)
		expect(classifier.predict("Unhappy")["negative"]).toBeGreaterThan(0.5)
		expect(classifier.predict("Terrible experience")["negative"]).toBeGreaterThan(0.5)
	})
})
