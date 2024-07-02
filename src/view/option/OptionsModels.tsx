export type OptionsKeywordData = {
	id: number
	text: string
	weight: number
}

export type OptionsGroupedKeywordData = {
	procrastination: OptionsKeywordData[]
	productive: OptionsKeywordData[]
}
