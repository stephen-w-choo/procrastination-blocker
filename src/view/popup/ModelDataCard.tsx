import {
	Button,
	Heading,
	Spacer,
	Stat,
	StatGroup,
	StatHelpText,
	StatNumber,
	Text,
} from "@chakra-ui/react"
import React from "react"
import { ModelMetricsResponse } from "../../messagePassing/base/MessageTypes"

type ModelDataCardProps = {
	modelData: ModelMetricsResponse
	showChanges: boolean
	resyncModel: () => void
}

export function ModelDataCard({
	modelData,
	showChanges,
	resyncModel,
}: ModelDataCardProps) {
	const changesSection = () => {
		if (modelData?.changesSinceLastSync === 0) {
			return <Text textAlign={"center"}>Model is up to date with data</Text>
		} else {
			return (
				<>
					<Text textAlign={"center"}>
						Data changes since last model sync:{" "}
						{modelData?.changesSinceLastSync}
					</Text>
					<Button
						onClick={() => {
							resyncModel()
						}}
					>
						Resync model
					</Button>
				</>
			)
		}
	}

	return (
		<>
			<Heading size="sm">Text classifier data</Heading>
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
			{showChanges && changesSection()}
			<Spacer p={2} />
		</>
	)
}
