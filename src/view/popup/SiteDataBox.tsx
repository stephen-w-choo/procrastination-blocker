import { Badge, Flex, Icon } from "@chakra-ui/react"
import React from "react"
import { CiGlobe } from "react-icons/ci"
import { GoStack } from "react-icons/go"
import { IoIosLink } from "react-icons/io"
import { Category, SiteData, SiteSeen } from "../../data/models/SiteData"

type SiteDataBoxProps = {
	siteDataState: SiteData
	siteCategory: Category | SiteSeen | null
}

export function SiteDataBox({ siteDataState, siteCategory }: SiteDataBoxProps) {
	const mapCategoryToBadge = (category: Category | SiteSeen | null) => {
		switch (category) {
			case Category.productive:
				return <Badge colorScheme="green">Productive site</Badge>
			case Category.procrastination:
				return <Badge colorScheme="red">Procrastination site</Badge>
			default:
				return <Badge variant="outline">Not categorised</Badge>
		}
	}

	return (
		<>
			<Flex
				alignItems="center"
				whiteSpace="nowrap"
				overflow="hidden"
				textOverflow="ellipsis"
			>
				<Icon as={CiGlobe} m={2} /> {siteDataState.title}
			</Flex>
			<Flex
				alignItems="center"
				whiteSpace="nowrap"
				overflow="hidden"
				textOverflow="ellipsis"
			>
				<Icon as={IoIosLink} m={2} />
				{siteDataState.domain}
			</Flex>
			<Flex alignItems="center">
				<Icon as={GoStack} m={2} />
				{mapCategoryToBadge(siteCategory)}
			</Flex>
		</>
	)
}
