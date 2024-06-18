import { useDisclosure } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import { Category, SiteData, SiteSeen } from "../../data/models/SiteData"
import { ProcrastinationScores } from "../../domain/models/ProcrastinationScore"
import { TrainedOn } from "../../domain/models/TrainedOn"
import { COLORS } from "../colours"
import { FocusMode } from "./FocusMode"
import { TopBar } from "./components/TopBar"

type ContentViewProps = {
	isActive: boolean
	rerenderTopBar: () => void
	siteData: SiteData
	siteSeen: Category | SiteSeen
	siteStatus: {
		procrastinationScore: ProcrastinationScores
		trainedOn: TrainedOn
	}
}

export function ContentView({
	isActive,
	rerenderTopBar,
	siteData,
	siteSeen,
	siteStatus,
}: ContentViewProps) {
	const { isOpen, onToggle, onOpen, onClose } = useDisclosure()
	const [disabled, disableTopBar] = useState(false)

	function closeTopBar() {
		disableTopBar(true)
	}

	useEffect(() => {
		if (isActive) {
			// 0.5 second delay
			setTimeout(() => onOpen(), 500)
		} else {
			setTimeout(() => onClose(), 500)
		}
	}, [isActive])

	return (
		<TopBar
			isOpen={isOpen}
			backgroundColor={COLORS.lightGrey}
			onToggle={onToggle}
			disabled={disabled}
			closeTopBar={closeTopBar}
		>
			<FocusMode
				rerenderTopBar={rerenderTopBar}
				siteData={siteData}
				siteSeen={siteSeen}
				siteStatus={siteStatus}
				closeTopBar={closeTopBar}
			/>
		</TopBar>
	)
}
