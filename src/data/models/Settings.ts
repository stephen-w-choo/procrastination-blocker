import { Category } from "./Category"

export type KeywordData = {
	text: string
	weight: number
}

export type GroupedKeywordData = {
	procrastination: KeywordData[]
	productive: KeywordData[]
}

export type Settings = {
	keywordData: GroupedKeywordData
	threshold: number
}

export const DefaultKeywordData: GroupedKeywordData = {
	procrastination: [
		{
			text: "reddit",
			weight: 5,
		},
		{
			text: "youtube",
			weight: 5,
		},
		{
			text: "news",
			weight: 5,
		},
		{
			text: "cooking",
			weight: 5,
		},
		{
			text: "games",
			weight: 5,
		},
	],
	productive: [
		{
			text: "wikipedia",
			weight: 5,
		},
		{
			text: "stack overflow",
			weight: 5,
		},
		{
			text: "github",
			weight: 5,
		},
		{
			text: "career",
			weight: 5,
		},
		{
			text: "business",
			weight: 5,
		},
	],
}

export const DefaultSettings = {
	keywordData: DefaultKeywordData,
	threshold: 0.5,
}
