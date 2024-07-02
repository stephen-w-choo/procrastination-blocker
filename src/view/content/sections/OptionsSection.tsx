import { Divider, Stack } from "@chakra-ui/react"
import React from "react"
import { Category, SiteSeen } from "../../../data/models/Category"
import { SiteData } from "../../../data/models/SiteData"
import {
	addSiteUseCase,
	reclassifySiteUseCase,
} from "../../../messagePassing/repositoryUseCases"
import { ContentButton } from "../components/ContentButton"
import { Body1, Heading2 } from "../components/Typography"

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
						<Body1
							color={"inherit"}
							textAlign="center"
							fontWeight={"semibold"}
						>
							Send me back
						</Body1>
					</ContentButton>
					<ContentButton
						color="teal"
						onClick={() => {
							reclassifySite()
							closeTopBar()
						}}
					>
						<Body1
							color={"inherit"}
							textAlign="center"
							fontWeight={"semibold"}
						>
							I marked it wrongly - let me through
						</Body1>
						<Body1
							color={"inherit"}
							textAlign="center"
							fontWeight={"semibold"}
						>
							(reclassify as a productive site)
						</Body1>
					</ContentButton>
					<ContentButton
						color="yellow"
						onClick={() => {
							closeTopBar()
						}}
					>
						<Body1
							color={"inherit"}
							textAlign="center"
							fontWeight={"semibold"}
						>
							😈 This is a procrastination site, but let me in anyway.
						</Body1>
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
						<Body1
							color={"inherit"}
							textAlign="center"
							fontWeight={"semibold"}
						>
							Send me back
						</Body1>
						<Body1
							color={"inherit"}
							textAlign="center"
							fontWeight={"semibold"}
						>
							(mark this as a procrastination site)
						</Body1>
					</ContentButton>
					<ContentButton
						color="teal"
						onClick={() => {
							addProductiveSite()
							closeTopBar()
						}}
					>
						<Body1
							color={"inherit"}
							textAlign="center"
							fontWeight={"semibold"}
						>
							Let me continue
						</Body1>
						<Body1
							color={"inherit"}
							textAlign="center"
							fontWeight={"semibold"}
						>
							(mark this as a productive site)
						</Body1>
					</ContentButton>
					<ContentButton
						color="yellow"
						onClick={() => {
							addProcrastinationSite()
							closeTopBar()
						}}
					>
						<Body1
							color={"inherit"}
							textAlign="center"
							fontWeight={"semibold"}
						>
							😈 This is a procrastination site, but let me in anyway.
						</Body1>
					</ContentButton>
				</>
			)
		}
	}

	return (
		<Stack maxW="350px" p={4}>
			<Heading2>What would you like to do?</Heading2>
			<Divider borderColor="black" />
			<Buttons />
		</Stack>
	)
}
