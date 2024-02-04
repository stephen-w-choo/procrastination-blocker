import { describe, beforeEach, expect, test } from '@jest/globals'
import NaiveBayesClassifier, { TextData } from '../src/bayesClassifier'

describe("Bayes Classifier", () => {
    let classifier: NaiveBayesClassifier
    const trainingData: TextData[] = [
        { "text": "I love this product", "class": "positive" },
        { "text": "Absolutely great experience", "class": "positive" },
        { "text": "Happy with the results", "class": "positive" },
        { "text": "This is amazing", "class": "positive" },
        { "text": "Very satisfied", "class": "positive" },
        { "text": "Not good at all", "class": "negative" },
        { "text": "Really disappointed", "class": "negative" },
        { "text": "Could be better", "class": "negative" },
        { "text": "I am unhappy with this", "class": "negative" },
        { "text": "A terrible experience", "class": "negative" }
    ]

    beforeEach(() => {
        classifier = new NaiveBayesClassifier()
    })
    
    test("Tokenise should return an array of tokens", () => {
        const tokens = classifier.tokenise("This is a test")
        expect(tokens).toEqual(["this", "is", "a", "test"])
    })

    test("Classifier should predict correctly based on training data", () => {
        classifier.train(trainingData)
        expect(classifier.predict("I absolutely love this product")).toEqual("positive")
        expect(classifier.predict("Unhappy")).toEqual("negative")
        expect(classifier.predict("Terrible experience")).toEqual("negative")
    })
})
