import {
	Accordion,
	AccordionButton,
	AccordionIcon,
	AccordionItem,
	AccordionPanel,
	Button,
	Divider,
	Flex,
	Heading,
	Spacer,
	Stack,
	Text,
	VStack,
} from "@chakra-ui/react"
import React, { useState } from "react"
import { Category, SiteData } from "../../data/models/SiteData"
import { ProcrastinationScore } from "../../domain/models/ProcrastinationScore"
import { TrainedOn } from "../../domain/models/TrainedOn"
import { toggleFocusModeUseCase } from "../../messagePassing/backgroundToggleUseCases"
import {
	requestModelSyncUseCase,
	requestSiteClassificationUseCase,
} from "../../messagePassing/classificationModelUseCases"
import { addSiteUseCase } from "../../messagePassing/repositoryUseCases"
import { ModelDataCard } from "../popup/ModelDataCard"
import { ContentButton } from "./components/ContentButton"
import { ProcrastinationScoreCard } from "./sections/SiteClassificationCard"

export type FocusModeProps = {
	siteData: SiteData
	siteStatus: {
		procrastinationScore: ProcrastinationScore
		trainedOn: TrainedOn
	}
	closeTopBar: () => void
}

export function FocusMode({ siteData, siteStatus, closeTopBar }: FocusModeProps) {
	const serialisedSiteData = JSON.stringify(siteData)
	const [siteStatusState, setSiteStatusState] = useState(siteStatus)

	function addProductiveSite() {
		addSiteUseCase(Category.productive, serialisedSiteData)
		closeTopBar()
	}

	function addProcrastinationSite() {
		addSiteUseCase(Category.procrastination, serialisedSiteData)
		closeTopBar()
	}

	function resyncAndRefreshSiteStatus() {
		requestModelSyncUseCase().then(modelSyncResponse => {
			if (modelSyncResponse.success) {
				refreshSiteStatus()
			}
		})
	}

	function refreshSiteStatus() {
		requestSiteClassificationUseCase(siteData).then(siteClassificationResponse => {
			setSiteStatusState({
				// asserting non-null is not ideal, but the user should not be able
				// to enter this mode without a non-null procrastination score in the first place
				procrastinationScore: siteClassificationResponse.procrastinationScore!!,
				trainedOn: siteClassificationResponse.trainedOn!!,
			})
		})
	}

	return (
		<>
			<Heading size="md">
				This looks like it could be a non-productive site.
			</Heading>
			<Divider borderColor="black" mt="10px" mb="20px" />
			<Flex>
				<VStack p={4} maxW="250px">
					<ProcrastinationScoreCard
						procrastinationScore={siteStatus.procrastinationScore}
						trainedOn={siteStatus.trainedOn}
					/>
					<Accordion allowToggle w="100%">
						<AccordionItem borderStyle="none" w="100%">
							<AccordionButton p={0} w="100%">
								<AccordionIcon />
								<Text fontSize="small" textAlign="start">
									More details about the model
								</Text>
							</AccordionButton>
							<AccordionPanel p={0}>
								<Spacer p={2} />
								<ModelDataCard
									modelData={siteStatus.trainedOn}
									showChanges
									resyncModel={resyncAndRefreshSiteStatus}
								/>
							</AccordionPanel>
						</AccordionItem>
					</Accordion>
				</VStack>
				<Stack maxW="350px" p={4}>
					<Heading size="md">What would you like to do?</Heading>
					<Divider borderColor="black" />
					<ContentButton
						color="red"
						onClick={() => {
							addProcrastinationSite()
							window.history.back()
						}}
					>
						<Text>Send me back</Text>
						<Text>(mark this as a procrastination site)</Text>
					</ContentButton>
					<ContentButton
						color="teal"
						onClick={() => {
							addProductiveSite()
							closeTopBar()
						}}
					>
						<Text>Let me continue</Text>
						<Text>(mark this as a productive site)</Text>
					</ContentButton>
					<ContentButton
						color="yellow"
						onClick={() => {
							addProcrastinationSite()
							closeTopBar()
						}}
					>
						<Text>
							😈 This is a procrastination site, but let me in anyway.
						</Text>
					</ContentButton>
				</Stack>
			</Flex>
			<Flex width="100%" justifyContent="center">
				<Button
					onClick={() => {
						closeTopBar()
						toggleFocusModeUseCase(false)
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
