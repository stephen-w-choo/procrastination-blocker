import { Badge, Flex, Icon } from "@chakra-ui/react"
import React from "react"
import { CiGlobe } from "react-icons/ci"
import { GoStack } from "react-icons/go"
import { IoIosLink } from "react-icons/io"
import { SiteData, } from "../../data/models/SiteData"
import { Category, SiteSeen } from "../../data/models/Category"

type SiteDataBoxProps = {
	siteDataState: SiteData | null
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
				maxW="300px"
				whiteSpace="nowrap"
				overflow="hidden"
				textOverflow="ellipsis"
			>
				<Icon as={CiGlobe} m={2} /> 
				{ siteDataState ? siteDataState.title: "Unable to get page title" }
			</Flex>
			<Flex
				alignItems="center"
				maxW="300px"
				whiteSpace="nowrap"
				overflow="hidden"
				textOverflow="ellipsis"
			>
				<Icon as={IoIosLink} m={2} />
				{ siteDataState ? siteDataState.domain : "Unable to get page domain" }
			</Flex>
			<Flex alignItems="center">
				<Icon as={GoStack} m={2} />
				{mapCategoryToBadge(siteCategory)}
			</Flex>
		</>
	)
}
