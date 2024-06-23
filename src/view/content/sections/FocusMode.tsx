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
import { Category } from "../../../data/models/SiteData"
import { toggleFocusModeUseCase } from "../../../messagePassing/backgroundToggleUseCases"
import { ModelDataCard } from "../../popup/ModelDataCard"
import { Body1, Body2, Heading2 } from "../components/Typography"
import { useContentViewModel } from "../ContentContext"
import { OptionsSection } from "./OptionsSection"
import { ProcrastinationScoreCard } from "./SiteClassificationCard"

export function FocusMode() {
	const {        
		siteData,
        siteSeen,
        siteStatus,
        resyncAndRerenderTopBar,
		setIsTopBarDisabled,
	} = useContentViewModel()

	const closeTopBar = () => { setIsTopBarDisabled(true) }

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
									resyncModel={() => { resyncAndRerenderTopBar() }}
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
