import { useDisclosure } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import { Category, SiteData, SiteSeen } from "../../data/models/SiteData"
import { ProcrastinationScore } from "../../domain/models/ProcrastinationScore"
import { TrainedOn } from "../../domain/models/TrainedOn"
import { COLORS } from "../colours"
import { FocusMode } from "./FocusMode"
import { TopBar } from "./components/TopBar"

type ContentViewProps = {
	isActive: boolean
	siteData: SiteData
	siteSeen: Category | SiteSeen
	siteStatus: {
		procrastinationScore: ProcrastinationScore
		trainedOn: TrainedOn
	}
}

export function ContentView({ isActive, siteData, siteSeen, siteStatus }: ContentViewProps) {
	const { isOpen, onToggle } = useDisclosure()
	const [disabled, disableTopBar] = useState(false)

	function closeTopBar() {
		disableTopBar(true)
	}

	useEffect(() => {
		if (isActive) {
			// 0.5 second delay
			setTimeout(() => {
				onToggle()
			}, 500)
		}
	}, [])

	return (
		<TopBar
			isOpen={isOpen}
			backgroundColor={COLORS.lightGrey}
			onToggle={onToggle}
			disabled={disabled}
			closeTopBar={closeTopBar}
		>
			<FocusMode
				siteData={siteData}
				siteSeen={siteSeen}
				siteStatus={siteStatus}
				closeTopBar={closeTopBar}
			/>
		</TopBar>
	)
}
