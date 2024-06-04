import { Button, Divider, Flex, Heading, HStack, Stack, Text } from "@chakra-ui/react"
import React from "react"
import { Category, SiteData } from "../../data/models/SiteData"
import { ProcrastinationScore } from "../../domain/models/ProcrastinationScore"
import { TrainedOn } from "../../domain/models/TrainedOn"
import { ModelMetricsResponse } from "../../messagePassing/base/MessageTypes"
import { addSiteUseCase } from "../../messagePassing/repositoryUseCases"
import { ContentButton } from "./ContentButton"
import { ProcrastinationScoreCard } from "./SiteClassificationCard"

export type FocusModeProps = {
	siteData: SiteData
	siteStatus: {
		procrastinationScore: ProcrastinationScore
		trainedOn: TrainedOn
	}
	modelMetrics: ModelMetricsResponse
	closeTopBar: () => void
}

export function FocusMode({
	siteData,
	siteStatus,
	modelMetrics,
	closeTopBar,
}: FocusModeProps) {
	const serialisedSiteData = JSON.stringify(siteData)

	function addProductiveSite() {
		addSiteUseCase(Category.productive, serialisedSiteData)
		closeTopBar()
	}

	function addProcrastinationSite() {
		addSiteUseCase(Category.procrastination, serialisedSiteData)
		closeTopBar()
	}

	return (
		<>
			<Heading size="lg">
				This looks like it could be a non-productive site.
			</Heading>
			<Divider borderColor="black" mt="10px" mb="20px" />
			<HStack>
				<ProcrastinationScoreCard
					procrastinationScore={siteStatus.procrastinationScore}
					trainedOn={siteStatus.trainedOn}
					showChanges={false}
					resyncModel={() => {}} // TODO - add use case to sync the model
				/>
				<Stack>
					<Heading size="md">What would you like to do?</Heading>
					<Divider borderColor="black" />
					<ContentButton
						color="red"
						text="Send me back, and mark this as a procrastination site."
						onClick={() => {
							addProcrastinationSite()
							window.history.back()
						}}
					/>
					<ContentButton
						color="green"
						text="You're wrong - let me in, and mark this as a productive website."
						onClick={() => {
							addProductiveSite()
							closeTopBar()
						}}
					/>
					<ContentButton
						color="yellow"
						text="😈 It is a procrastination site, but let me in anyway."
						onClick={() => {
							addProcrastinationSite()
							closeTopBar()
						}}
					/>
				</Stack>
			</HStack>
			<Flex width="100%">
				<Button
					onClick={() => {
						closeTopBar()
						// TODO - add use case to sync the model
					}}
					colorScheme="blue"
					m="20px"
				>
					<Text>Turn off focus mode</Text>
				</Button>
			</Flex>
		</>
	)
}
