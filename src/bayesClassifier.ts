// eg procrastination or productive
export type TextClass = string

// single lower case word token - keeping it simple
export type Token = string

// the original text
export type TextSequence = string

export interface TextData {
    text: TextSequence;
    class: TextClass;
}

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
        // Tokenise then run naive Bayes

        const tokens = this.tokenise(text)
        let probabilityTable: Record<string, number> = {}

        // Bayes - P(a | b) = b * P(b | a) / a
        // Treat each word as a possible trait, then calculate the probability of
        // the class given all traits are present

        Object.keys(this.classProbabilities).forEach((textClass) => {
            // Start with the base probability of a given class
            let probability = this.classProbabilities[textClass]

            // Multiply by the probability of each token given the class
            tokens.forEach((token) => {
                probability *= this.tokenProbabilities[textClass][token]
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
        return text.toLowerCase()
            .replace(/[^\w\s]|_/g, "")
            .replace(/\s+/g, " ")
            .trim()
            .split(" ");
    }

    private normalise(probabilityTable: Record<string, number>) {
        // Normalise probabilities, does it in place as Objects are passed by reference
        const totalProbability = Object.values(probabilityTable).reduce((accum, curr) => accum + curr)
        const normaliser = 1 / totalProbability
        Object.keys(probabilityTable).forEach((textClass) => {
            probabilityTable[textClass] *= normaliser
        })
    }

    private setUpDataStructure(textDataItem: TextData): void {
        if (!this.classProbabilities[textDataItem.class]) {
            this.classProbabilities[textDataItem.class] = 0;
        }
        if (!this.tokenProbabilities[textDataItem.class]) {
            this.tokenProbabilities[textDataItem.class] = {};
        }
    }

    private buildUpFrequencies(data: TextData[]): void {
        data.forEach((textDataItem) => {
            const tokens = this.tokenise(textDataItem.text)
            tokens.forEach((token) => this.vocabulary.add(token))
            this.setUpDataStructure(textDataItem)
            
            // Increment the class count
            this.classProbabilities[textDataItem.class]++
            
            // Increment the token count for a given class
            tokens.forEach((token) => {
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
            // Total tokens in a class + vocabulary size for Laplace smoothing
            const totalTokensInClass = Object.values(this.tokenProbabilities[textClass])
                .reduce((acc, val) => acc + val, 0) + this.vocabulary.size;
            
            for (const token in this.tokenProbabilities[textClass]) {
                this.tokenProbabilities[textClass][token] = 
                    (this.tokenProbabilities[textClass][token] + 1) / totalTokensInClass;
            }
            // If the token doesn't exist
            this.vocabulary.forEach((token) => {
                if (!this.tokenProbabilities[textClass][token]) {
                    this.tokenProbabilities[textClass][token] = 1 / totalTokensInClass;
                }
            });
        }
    }
}


