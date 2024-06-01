import { CloseIcon } from "@chakra-ui/icons"
import {
	Box,
	Button,
	Collapse,
	Flex,
	HStack,
	IconButton,
	Stack,
	Text,
	useDisclosure,
} from "@chakra-ui/react"
import React, { useState } from "react"
import { Category } from "../../data/models/SiteData"
import { SiteClassificationResponse } from "../../messagePassing/base/MessageTypes"
import { addSiteUseCase } from "../../messagePassing/repositoryUseCases"
import { TopBarDropdownTab } from "./TopBarDropdownTab"

export type TopBarProps = {
	serialisedSiteData: string
	siteStatus: SiteClassificationResponse
}

export function TopBar({ serialisedSiteData, siteStatus }: TopBarProps) {
	const COLOR = "#edf2f7"

	const { isOpen, onToggle } = useDisclosure()
	const [disabled, disableTopBar] = useState(false)

	function closeTopBar() {
		disableTopBar(true)
	}

	function addProductiveSite() {
		addSiteUseCase(Category.productive, serialisedSiteData)
		closeTopBar()
	}

	function addProcrastinationSite() {
		addSiteUseCase(Category.procrastination, serialisedSiteData)
		closeTopBar()
	}

	if (disabled === true) {
		return null
	}

	return (
		<>
			<Box
				pos="fixed"
				display="flex"
				flexDirection="column"
				alignItems="center"
				top="0px"
				left="0px"
				width="100%"
				zIndex="10000"
				p={2}
				backgroundColor={COLOR}
			>
				<Collapse animateOpacity in={isOpen} startingHeight="1px">
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
				</Collapse>
				<Box display="flex" justifyContent="center">
					<TopBarDropdownTab
						color={COLOR}
						isOpen={isOpen}
						onToggle={onToggle}
					/>
				</Box>
				<IconButton
					position={"absolute"}
					top="0px"
					right="0px"
					variant="ghost"
					colorScheme="black"
					aria-label="Done"
					fontSize="12px"
					icon={<CloseIcon />}
					height="15px"
					width="15px"
					onClick={closeTopBar}
				/>
			</Box>
		</>
	)
}
