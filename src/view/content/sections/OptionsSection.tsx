import { Divider, Heading, Stack, Text } from "@chakra-ui/react"
import React from "react"
import { Category, SiteData, SiteSeen } from "../../../data/models/SiteData"
import {
	addSiteUseCase,
	reclassifySiteUseCase,
} from "../../../messagePassing/repositoryUseCases"
import { ContentButton } from "../components/ContentButton"

interface OptionsSectionProps {
	siteData: SiteData
	siteSeen: Category | SiteSeen
	closeTopBar: () => void
}

export function OptionsSection({ siteData, siteSeen, closeTopBar }: OptionsSectionProps) {
	const serialisedSiteData = JSON.stringify(siteData)

	const addProductiveSite = () => {
		addSiteUseCase(Category.productive, serialisedSiteData)
	}

	const addProcrastinationSite = () => {
		addSiteUseCase(Category.procrastination, serialisedSiteData)
	}

	const reclassifySite = () => {
		reclassifySiteUseCase(serialisedSiteData)
	}

	function Buttons() {
		if (siteSeen === Category.procrastination) {
			return (
				<>
					<ContentButton
						color="red"
						onClick={() => {
							window.history.back()
						}}
					>
						<Text>Send me back</Text>
					</ContentButton>
					<ContentButton
						color="teal"
						onClick={() => {
							reclassifySite()
							closeTopBar()
						}}
					>
						<Text>I marked it wrongly - let me through</Text>
						<Text>(reclassify as a productive site)</Text>
					</ContentButton>
					<ContentButton
						color="yellow"
						onClick={() => {
							closeTopBar()
						}}
					>
						<Text>
							😈 This is a procrastination site, but let me in anyway.
						</Text>
					</ContentButton>
				</>
			)
		} else {
			return (
				<>
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
				</>
			)
		}
	}

	return (
		<Stack maxW="350px" p={4}>
			<Heading size="md">What would you like to do?</Heading>
			<Divider borderColor="black" />
			<Buttons />
		</Stack>
	)
}
