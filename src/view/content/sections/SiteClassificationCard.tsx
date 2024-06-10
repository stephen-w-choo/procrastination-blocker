import { Card, Heading, Spacer, Text } from "@chakra-ui/react"
import React from "react"
import { ProcrastinationScore } from "../../../domain/models/ProcrastinationScore"
import { TrainedOn } from "../../../domain/models/TrainedOn"

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
			<Heading size="sm" textAlign="center">
				Procrastination score
			</Heading>
			<Spacer p={2} />
			<Heading size="lg" textAlign="center">
				{calculatePercentage()}
			</Heading>
			<Spacer p={2} />
			<Text fontSize="small">
				This score is based on your model, which has been trained on a total of{" "}
				<strong>{trainedOn.procrastination + trainedOn.productive}</strong> sites.
			</Text>
		</Card>
	)
}
