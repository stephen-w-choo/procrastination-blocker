export type ProcrastinationScores = {
	title: number
	domain: number
}

export function calculateOverallScore(score: ProcrastinationScores): number {
	return (score.title + score.domain) / 2
}
