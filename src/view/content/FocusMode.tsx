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
	Text,
	VStack,
} from "@chakra-ui/react"
import React, { useState } from "react"
import { Category, SiteData, SiteSeen } from "../../data/models/SiteData"
import { ProcrastinationScore } from "../../domain/models/ProcrastinationScore"
import { TrainedOn } from "../../domain/models/TrainedOn"
import { toggleFocusModeUseCase } from "../../messagePassing/backgroundToggleUseCases"
import {
	requestModelSyncUseCase,
	requestSiteClassificationUseCase,
} from "../../messagePassing/classificationModelUseCases"
import { ModelDataCard } from "../popup/ModelDataCard"
import { OptionsSection } from "./sections/OptionsSection"
import { ProcrastinationScoreCard } from "./sections/SiteClassificationCard"

export type FocusModeProps = {
	siteData: SiteData
	siteSeen: Category | SiteSeen
	siteStatus: {
		procrastinationScore: ProcrastinationScore
		trainedOn: TrainedOn
	}
	closeTopBar: () => void
}

export function FocusMode({
	siteData,
	siteSeen,
	siteStatus,
	closeTopBar,
}: FocusModeProps) {
	const [siteStatusState, setSiteStatusState] = useState(siteStatus)

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
				{siteSeen === Category.procrastination
					? "You've previously marked this as a non-productive site."
					: "This looks like it could be a non-productive site."}
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
				<OptionsSection
					siteSeen={siteSeen}
					siteData={siteData}
					closeTopBar={closeTopBar}
				/>
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
