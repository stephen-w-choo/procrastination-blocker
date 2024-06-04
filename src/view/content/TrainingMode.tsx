import { Box, Button, Flex, HStack, Stack, Text } from "@chakra-ui/react"
import React from "react"
import { Category } from "../../data/models/SiteData"
import { SiteClassificationResponse } from "../../messagePassing/base/MessageTypes"
import { addSiteUseCase } from "../../messagePassing/repositoryUseCases"

export type TrainingModeProps = {
	serialisedSiteData: string
	siteStatus: SiteClassificationResponse
	closeTopBar: () => void
}

export function TrainingMode({
	serialisedSiteData,
	siteStatus,
	closeTopBar,
}: TrainingModeProps) {
	const COLOR = "#edf2f7"

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
			<HStack spacing={"30px"} mt={5}>
				<Box flex={1}>
					<Stack>
						<Button
							onClick={addProcrastinationSite}
							width="100%"
							colorScheme="red"
							background="white"
							variant="outline"
							textAlign={"left"}
						>
							<Text>Mark this site as non-productive</Text>
						</Button>
						<Button
							onClick={addProductiveSite}
							width="100%"
							colorScheme="green"
							background="white"
							variant="outline"
						>
							<Text>Mark this site as productive</Text>
						</Button>
						<Button
							onClick={() => {
								closeTopBar()
								// TODO - add use case to remove the website
							}}
							width="100%"
							colorScheme="yellow"
							background="white"
							variant="outline"
						>
							<Text>Skip this website (indeterminate)</Text>
						</Button>
					</Stack>
				</Box>
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
					<Text>Turn off training mode and sync the model</Text>
				</Button>
			</Flex>
		</>
	)
}
