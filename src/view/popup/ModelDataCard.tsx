import {
	Button,
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

type ModelDataCardProps = {
	modelData: {
		procrastination: number
		productive: number
		changesSinceLastSync: number
	}
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
			return <Text fontSize="small">Model is up to date with data</Text>
		} else {
			return (
				<>
					<Text fontSize="small">
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
		<Card p={3} backgroundColor="white">
			<Heading size="sm" textAlign="center">
				Text classifier data
			</Heading>
			<Spacer p={2} />
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
			{showChanges && changesSection()}
		</Card>
	)
}
