import { Button, ButtonGroup, Flex } from "@chakra-ui/react"
import React from "react"
import { Category, SiteSeen } from "../../data/models/SiteData"

type RepositoryClassificationBoxProps = {
	siteSeenBefore: Category | SiteSeen | null
	addProductiveSite: () => void
	addProcrastinationSite: () => void
	removeSite: () => void
	reclassifySite: () => void
}

export function RepositoryClassificationBox({
	siteSeenBefore,
	addProductiveSite,
	addProcrastinationSite,
	removeSite,
	reclassifySite,
}: RepositoryClassificationBoxProps) {
	const uncategorisedButtonAction: () => void = () => {
		switch (siteSeenBefore) {
			case Category.productive:
			case Category.procrastination:
				removeSite()
			default:
				return // do nothing
		}
	}

	const productiveButtonAction: () => void = () => {
		switch (siteSeenBefore) {
			case Category.productive:
				return
			case Category.procrastination:
				reclassifySite()
				return
			default:
				addProductiveSite()
				return
		}
	}

	const procrastinationButtonAction: () => void = () => {
		switch (siteSeenBefore) {
			case Category.procrastination:
				return
			case Category.productive:
				reclassifySite()
				return
			default:
				addProcrastinationSite()
				return
		}
	}

	return (
		<Flex justifyContent="center">
			<ButtonGroup
				size="md"
				isAttached
				variant="outline"
				orientation="vertical"
				borderRadius="lg"
				boxShadow="xl"
			>
				<Button
					isDisabled={
						siteSeenBefore === SiteSeen.notSeen || siteSeenBefore === null
					}
					isActive={
						siteSeenBefore === SiteSeen.notSeen || siteSeenBefore === null
					}
					flex="1"
					colorScheme="blackAlpha"
					onClick={uncategorisedButtonAction}
					p="10px 30px"
				>
					Uncategorised
				</Button>
				<Button
					colorScheme="teal"
					flex="1"
					isDisabled={siteSeenBefore === Category.productive}
					isActive={siteSeenBefore === Category.productive}
					onClick={productiveButtonAction}
					p="10px 30px"
				>
					Productive
				</Button>
				<Button
					colorScheme="orange"
					flex="1"
					isDisabled={siteSeenBefore === Category.procrastination}
					isActive={siteSeenBefore === Category.procrastination}
					onClick={procrastinationButtonAction}
					p="10px 30px"
				>
					Procrastination
				</Button>
			</ButtonGroup>
		</Flex>
	)
}
