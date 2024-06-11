import { useDisclosure } from "@chakra-ui/react"
import React, { useState } from "react"
import { Category, SiteData, SiteSeen } from "../../data/models/SiteData"
import { ProcrastinationScore } from "../../domain/models/ProcrastinationScore"
import { TrainedOn } from "../../domain/models/TrainedOn"
import { COLORS } from "../colours"
import { FocusMode } from "./FocusMode"
import { TopBar } from "./components/TopBar"

type ContentViewProps = {
	siteData: SiteData
	siteSeen: Category | SiteSeen
	siteStatus: {
		procrastinationScore: ProcrastinationScore
		trainedOn: TrainedOn
	}
}

export function ContentView({ siteData, siteSeen, siteStatus }: ContentViewProps) {
	const { isOpen, onToggle } = useDisclosure()
	const [disabled, disableTopBar] = useState(false)

	function closeTopBar() {
		disableTopBar(true)
	}

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
