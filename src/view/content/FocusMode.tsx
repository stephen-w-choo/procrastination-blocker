import {
	Accordion,
	AccordionButton,
	AccordionIcon,
	AccordionItem,
	AccordionPanel,
	Box,
	Button,
	Divider,
	Flex,
	Spacer,
	VStack,
} from "@chakra-ui/react"
import React from "react"
import { Category, SiteData, SiteSeen } from "../../data/models/SiteData"
import { ProcrastinationScores } from "../../domain/models/ProcrastinationScore"
import { TrainedOn } from "../../domain/models/TrainedOn"
import { toggleFocusModeUseCase } from "../../messagePassing/backgroundToggleUseCases"
import { requestModelSyncUseCase } from "../../messagePassing/classificationModelUseCases"
import { ModelDataCard } from "../popup/ModelDataCard"
import { Body1, Body2, Heading2 } from "./components/Typography"
import { OptionsSection } from "./sections/OptionsSection"
import { ProcrastinationScoreCard } from "./sections/SiteClassificationCard"

export type FocusModeProps = {
	rerenderTopBar: () => void
	siteData: SiteData
	siteSeen: Category | SiteSeen
	siteStatus: {
		procrastinationScore: ProcrastinationScores
		trainedOn: TrainedOn
	}
	closeTopBar: () => void
}

export function FocusMode({
	rerenderTopBar,
	siteData,
	siteSeen,
	siteStatus,
	closeTopBar,
}: FocusModeProps) {
	function resyncAndRefreshSiteStatus() {
		requestModelSyncUseCase().then(modelSyncResponse => {
			if (modelSyncResponse.success) {
				rerenderTopBar()
			}
		})
	}

	return (
		<>
			<Heading2>
				{siteSeen === Category.procrastination
					? "You've previously marked this as a non-productive site."
					: "This looks like it could be a non-productive site."}
			</Heading2>
			<Divider borderColor="black" mt="10px" mb="20px" />
			<Flex>
				<VStack p={4} maxW="250px">
					<ProcrastinationScoreCard
						procrastinationScore={siteStatus.procrastinationScore}
						trainedOn={siteStatus.trainedOn}
					/>
					<Box h={1} />
					<Accordion allowToggle w="100%">
						<AccordionItem borderStyle="none" w="100%">
							<AccordionButton p={0} w="100%">
								<AccordionIcon />
								<Body2 fontWeight="semibold">
									More details about the model
								</Body2>
							</AccordionButton>
							<Spacer p={1} />
							<AccordionPanel p={0}>
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
					<Body1 color="inherit" fontWeight="semibold">
						Turn off focus mode
					</Body1>
				</Button>
			</Flex>
		</>
	)
}
