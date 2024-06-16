import { Card, Spacer } from "@chakra-ui/react"
import React from "react"
import { ProcrastinationScore } from "../../../domain/models/ProcrastinationScore"
import { TrainedOn } from "../../../domain/models/TrainedOn"
import { Body2, Heading1, Heading3 } from "../components/Typography"

type ProcrastinationScoreCardProps = {
	procrastinationScore: ProcrastinationScore
	trainedOn: TrainedOn
}

export function ProcrastinationScoreCard({
	procrastinationScore,
	trainedOn,
}: ProcrastinationScoreCardProps) {
	const calculatePercentage = () => {
		return (
			Math.round(
				((procrastinationScore.title + procrastinationScore.domain) / 2) * 100
			).toString() + "%"
		)
	}

	return (
		<Card p={3} backgroundColor="white">
			<Heading3 textAlign="center">Procrastination score</Heading3>
			<Spacer p={2} />
			<Heading1 textAlign="center">{calculatePercentage()}</Heading1>
			<Spacer p={2} />
			<Body2>
				This score is based on your model, which has been trained on a total of{" "}
				<strong>{trainedOn.procrastination + trainedOn.productive}</strong> sites.
			</Body2>
		</Card>
	)
}
