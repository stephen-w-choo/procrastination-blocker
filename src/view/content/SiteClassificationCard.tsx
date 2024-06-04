import {
	Card,
	Heading,
	Spacer,
	Stat,
	StatGroup,
	StatHelpText,
	StatNumber,
	Text,
} from "@chakra-ui/react"
import React from "react"
import { ProcrastinationScore } from "../../domain/models/ProcrastinationScore"
import { TrainedOn } from "../../domain/models/TrainedOn"

type ProcrastinationScoreCardProps = {
	procrastinationScore: ProcrastinationScore
	trainedOn: TrainedOn
	showChanges: boolean
	resyncModel: () => void
}

export function ProcrastinationScoreCard({
	procrastinationScore,
	trainedOn,
	showChanges,
	resyncModel,
}: ProcrastinationScoreCardProps) {
	return (
		<Card p={3} maxW="350px" m={3}>
			<Heading size="sm" textAlign="center">
				This website's procrastination score is:
			</Heading>
			<Spacer p={2} />
			<StatGroup textAlign={"center"}>
				<Stat>
					<StatNumber>{procrastinationScore.title}</StatNumber>
					<StatHelpText>title</StatHelpText>
				</Stat>
				<Stat>
					<StatNumber>{procrastinationScore.domain}</StatNumber>
					<StatHelpText>domain</StatHelpText>
				</Stat>
			</StatGroup>
			<Spacer p={2} />
			<Text>
				This procrastination score is based on your model, which has been trained
				on a total of {trainedOn.procrastination + trainedOn.productive} sites.
			</Text>
		</Card>
	)
}
