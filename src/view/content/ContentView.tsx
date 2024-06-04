import { useDisclosure } from "@chakra-ui/react"
import React, { useState } from "react"
import { SiteData } from "../../data/models/SiteData"
import { ProcrastinationScore } from "../../domain/models/ProcrastinationScore"
import { TrainedOn } from "../../domain/models/TrainedOn"
import { ModelMetricsResponse } from "../../messagePassing/base/MessageTypes"
import { FocusMode } from "./FocusMode"
import { TopBar } from "./TopBar"

type ContentViewProps = {
	siteData: SiteData
	siteStatus: {
		procrastinationScore: ProcrastinationScore
		trainedOn: TrainedOn
	}
	modelMetrics: ModelMetricsResponse
}

export function ContentView({ siteData, siteStatus, modelMetrics }: ContentViewProps) {
	const { isOpen, onToggle } = useDisclosure()
	const [disabled, disableTopBar] = useState(false)

	function closeTopBar() {
		disableTopBar(true)
	}

	return (
		<TopBar
			isOpen={isOpen}
			onToggle={onToggle}
			disabled={disabled}
			closeTopBar={closeTopBar}
		>
			<FocusMode
				siteData={siteData}
				siteStatus={siteStatus}
				modelMetrics={modelMetrics}
				closeTopBar={closeTopBar}
			/>
		</TopBar>
	)
}
