import {
	Button,
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
import { ModelMetricsResponse } from "../../messagePassing/base/MessageTypes"
import { requestModelSyncUseCase } from "../../messagePassing/classificationModelUseCases"

type ModelDataCardProps = {
	modelData: ModelMetricsResponse | null
	resyncModel: () => void
}

export function ModelDataCard({ modelData, resyncModel }: ModelDataCardProps) {
	return (
		<Card flex={1} minW="250px">
			<CardHeader textAlign={"center"}>Text classifier data</CardHeader>
			{ modelData ? (
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
					{ modelData.changesSinceLastSync === 0 ? (
						<>
							<Text textAlign={"center"}>Model is up to date with data</Text>
						</>
					) : (
						<>
							<Text textAlign={"center"}>Data changes since last model sync: {modelData.changesSinceLastSync}</Text>
							<Button
								onClick={() => { resyncModel() }}
							>
								Resync model
							</Button>
						</>
					)}
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
