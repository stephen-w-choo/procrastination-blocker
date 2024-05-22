import {
	Card,
	CardHeader,
	Spacer,
	Stat,
	StatGroup,
	StatHelpText,
	StatNumber,
	Text,
} from "@chakra-ui/react"
import React from "react"
import { ModelDataResponse } from "../../messagePassing/base/MessageTypes"

type ModelDataCardProps = {
	modelData: ModelDataResponse | null
}

export function ModelDataCard({ modelData }: ModelDataCardProps) {
	return (
		<Card flex={1} minW="250px">
			<CardHeader textAlign={"center"}>Text classifier data</CardHeader>
			{modelData ? (
				<>
					<StatGroup textAlign={"center"}>
						<Stat>
							<StatNumber>{modelData.productive}</StatNumber>
							<StatHelpText>productive</StatHelpText>
						</Stat>
						<Stat>
							<StatNumber>{modelData.procrastination}</StatNumber>
							<StatHelpText>procrastination</StatHelpText>
						</Stat>
					</StatGroup>
					<Spacer p={2} />
				</>
			) : (
				<>
					<Text>No text classifier data available.</Text>
				</>
			)}
		</Card>
	)
}
